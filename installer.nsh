!macro customInit
  ; Force close any running NeonWave.exe instances silently before installing
  nsExec::Exec 'taskkill /F /IM NeonWave.exe'
!macroend

!macro customUnInit
  ; Force close any running NeonWave.exe instances silently before uninstalling
  nsExec::Exec 'taskkill /F /IM NeonWave.exe'
!macroend
