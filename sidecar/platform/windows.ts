import { spawn, type ChildProcess } from 'node:child_process'
import { onShutdown } from '../transport'

export function startActiveWindowMonitor() {
 let activeWindowName = 'unknown'
 let monitorProcess: ChildProcess | null = null
 let quitting = false
 onShutdown(() => { quitting = true; monitorProcess?.kill() })
  const ACTIVE_WINDOW_MONITOR_PS = `
$code = @"
    using System;
    using System.Runtime.InteropServices;

    public class User32 {
        [DllImport("user32.dll")]
        public static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        public static extern int GetWindowThreadProcessId(IntPtr hWnd, out int lpdwProcessId);
    }
"@

if (-not ([System.Management.Automation.PSTypeName]'User32').Type) {
    try { Add-Type $code -ErrorAction SilentlyContinue } catch {}
}

$lastProcessName = ""

while ($true) {
    try {
        $hwnd = [User32]::GetForegroundWindow()
        if ($hwnd -ne [System.IntPtr]::Zero) {
            $pidOut = 0
            [void][User32]::GetWindowThreadProcessId($hwnd, [ref]$pidOut)
            if ($pidOut -gt 0) {
                $process = Get-Process -Id $pidOut -ErrorAction SilentlyContinue
                if ($process) {
                    $name = $process.ProcessName
                    if ($name -ne $lastProcessName) {
                        $lastProcessName = $name
                        Write-Output $name
                    }
                }
            }
        }
    } catch {}
    Start-Sleep -Seconds 2
}
`

  function startMonitor() {
    if (process.platform !== 'win32') return

    try {
      monitorProcess = spawn('powershell.exe', [
        '-ExecutionPolicy', 'Bypass',
        '-NoProfile',
        '-EncodedCommand', Buffer.from(ACTIVE_WINDOW_MONITOR_PS, 'utf16le').toString('base64')
      ], {
        stdio: ['ignore', 'pipe', 'ignore'],
        windowsHide: true
      })

      monitorProcess.stdout!.on('data', (data: Buffer) => {
        // A chunk may contain several lines; the last one is the newest.
        const lines = data.toString().split(/\r?\n/).map(s => s.trim()).filter(Boolean)
        if (lines.length > 0) {
          activeWindowName = lines[lines.length - 1]
        }
      })

      monitorProcess.on('error', (err: Error) => {
        console.warn('Active window monitor failed to start:', err.message)
      })

      monitorProcess.on('close', () => {
        if (quitting) return
        setTimeout(startMonitor, 5000).unref()
      })
    } catch (e) {
      console.error('Failed to start active window monitor:', e)
    }
  }

  startMonitor()


 return () => activeWindowName
}

export async function gpuInfo(): Promise<{gpuDevice: {deviceString: string}[]}> {
 if (process.platform !== 'win32') return {gpuDevice: []}
 return new Promise(resolve => {
   const child = spawn('powershell.exe', ['-NoProfile', '-Command', 'Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name'], {windowsHide: true})
   let output = ''
   child.stdout.on('data', data => { output += data })
   child.on('error', () => resolve({gpuDevice: []}))
   child.on('close', () => resolve({gpuDevice: output.trim().split(/\r?\n/).filter(Boolean).map(deviceString => ({deviceString}))}))
   const timer = setTimeout(() => child.kill(), 10000)
   child.once('close', () => clearTimeout(timer))
 })
}
