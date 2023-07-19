function Status {
    $currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent()
    $principle = New-Object System.Security.Principal.WindowsPrincipal($currentUser)
    $isAdministrator = $principle.IsInRole([System.Security.Principal.WindowsBuiltInRole]::Administrator)
    Write-Host "Running as administrator? $isAdministrator"
}

function Apply {

}

function Undo {

}