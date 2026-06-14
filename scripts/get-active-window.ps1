$code = @"
    using System;
    using System.Runtime.InteropServices;
    using System.Text;

    public class User32 {
        [DllImport("user32.dll")]
        public static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        public static extern int GetWindowThreadProcessId(IntPtr hWnd, out int lpdwProcessId);
    }
"@

try {
    Add-Type $code -ErrorAction SilentlyContinue
} catch {}

$lastProcessName = ""

while ($true) {
    try {
        $hwnd = [User32]::GetForegroundWindow()
        if ($hwnd -ne [System.IntPtr]::Zero) {
            $pidOut = 0
            [User32]::GetWindowThreadProcessId($hwnd, [ref]$pidOut)
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
    } catch {
        # ignore
    }
    Start-Sleep -Seconds 2
}
