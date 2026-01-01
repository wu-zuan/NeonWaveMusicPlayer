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

Add-Type $code

$hwnd = [User32]::GetForegroundWindow()
$pidOut = 0
[User32]::GetWindowThreadProcessId($hwnd, [ref]$pidOut)
$process = Get-Process -Id $pidOut -ErrorAction SilentlyContinue

if ($process) {
    Write-Output $process.ProcessName
}
else {
    Write-Output "unknown"
}
