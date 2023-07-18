function Status($root) {
    $RegKeyPath = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\PersonalizationCSP"
    $LockScreenImagePath = Get-ItemPropertyValue -Path $RegKeyPath -Name "LockScreenImagePath" -ErrorAction SilentlyContinue
    $LockScreenImageStatus = Get-ItemPropertyValue -Path $RegKeyPath -Name "LockScreenImageStatus" -ErrorAction SilentlyContinue
    if ($LockScreenImagePath -and $LockScreenImageStatus -eq 1) { Write-Host "Lock screen image currently Enabled: $LockScreenImagePath" }
    else { Write-Host "Lock screen image curently Disabled" }
}

function Apply($root) {
    Write-Host "START: Setting Lockscreen background to black"
    $RegKeyPath = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\PersonalizationCSP"
    $LockScreenImagePath = "$env:USERPROFILE\Documents\WindowsCustomisation\LockScreen.jpg"
    $LockScreenSource = "$root\modAssets\BlackScreen.jpg"

    if (!(Test-Path $RegKeyPath)) { New-Item -Path $RegKeyPath -Force | Out-Null }
    if ($LockScreenSource) {
        New-Item -ItemType Directory -Path "$env:USERPROFILE\Documents\WindowsCustomisation" -Force
        Copy-Item $LockScreenSource $LockScreenImagePath -Force
        New-ItemProperty -Path $RegKeyPath -Name "LockScreenImageStatus" -Value 1 -PropertyType DWORD -Force | Out-Null
        New-ItemProperty -Path $RegKeyPath -Name "LockScreenImagePath" -Value $LockScreenImagePath -PropertyType STRING -Force | Out-Null
        New-ItemProperty -Path $RegKeyPath -Name "LockScreenImageUrl" -Value $LockScreenImagePath -PropertyType STRING -Force | Out-Null
    }
    Write-Host "Lock screen image successfully Enabled: $LockScreenImagePath"
}

function Undo($root) {
    Write-Host "START: Disabling Lockscreen background"
    $RegKeyPath = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\PersonalizationCSP"
    if (Test-Path $RegKeyPath) {
        Set-ItemProperty -Path $RegKeyPath -Name "LockScreenImageStatus" -Value 0 -Force | Out-Null
        Write-Output "Lock screen image has been disabled."
    }
    else { Write-Output "Unable to disable lock screen image. Registry key not found." }
}