function Status($root) {
    $folderPath = "$root\drivers"
    $fileCount = (Get-ChildItem -Path $folderPath -File | Measure-Object).Count
    Write-Host "$fileCount installable files (exe, cab, msi) found in $folderPath"
}
function Apply($root) {
    $folderPath = "$root\drivers"
    $installerFiles = Get-ChildItem -Path $folderPath -Recurse | Where-Object { $_.Extension -match '\.(exe|cab|msi)$' }
    Write-Host ("Found " + $installerFiles.Count + " installer files")

    foreach ($installerFile in $installerFiles) {
        try {
            Write-Host ("Installing: " + $installerFile.Name)
            switch -Wildcard ($installerFile.Extension) {
                ".msi" { Start-Process -FilePath $installerFile.FullName -ArgumentList '/passive', '/norestart' -Wait }
                ".exe" { Start-Process -FilePath $installerFile.FullName -ArgumentList '/silent', '/install', '/norestart' -Wait }
                ".cab" { Add-WindowsPackage -Online -PackagePath $installerFile.FullName }
                default { Write-Warning ("Unsupported installer file type: " + $installerFile.Extension + " - Skipping") }
            }
        }
        catch { 
            Write-Error $_ 
            continue
        }
    }

    Write-Host "Finished installing drivers"
}
function Undo($root) {
    Write-Host "NOT AVAILABLE: There is no standardized way to automatically uninstall drivers or undo the installation process, this depends on the specific driver installation method and the driver itself. Some drivers may provide an uninstallation mechanism through an executable or command-line utility specific to that driver."
}

function CreateFolder($root) {
    # Create the "drivers" folder
    $driversFolderPath = Join-Path -Path $root -ChildPath "driversTest"
    New-Item -ItemType Directory -Path $driversFolderPath | Out-Null

    # Inform the user that the "drivers" folder has been created
    Write-Host "The 'drivers' folder has been created next to the executable. $driversFolderPath"
    Write-Host "Please place your driver files inside this folder for batch installation."
}
