modules/createNewTextFile.ps1function Status {
    $dir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $folderPath = "$dir\test"
    $fileExtension = ".txt"

    if (Test-Path $folderPath) {
        $files = Get-ChildItem -Path $folderPath -Filter "*$fileExtension" -File
        if ($files.Count -gt 0) {
            Write-Host "Text files in ${folderPath}:"
            foreach ($file in $files) {
                Write-Host $file.Name
            }
        }
        else {
            Write-Host "No text files found in ${folderPath}"
        }
    }
    else {
        Write-Host "Directory ${folderPath} does not exist"
    }
}

function Run {
    $dir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $folderPath = "$dir\test"
    $fileBaseName = "test"
    $fileExtension = ".txt"
    $fileNumber = 1

    if (-not (Test-Path $folderPath)) {
        New-Item -ItemType Directory -Path $folderPath
    }

    while (Test-Path "$folderPath\$fileBaseName$fileNumber$fileExtension") {
        $fileNumber++
    }

    New-Item -ItemType File -Path "$folderPath\$fileBaseName$fileNumber$fileExtension"
}

function Undo {
    $dir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $folderPath = "$dir\test"
    $fileBaseName = "test"
    $fileExtension = ".txt"
    $fileNumber = 1

    while (Test-Path "$folderPath\$fileBaseName$fileNumber$fileExtension") {
        $fileNumber++
    }

    if ($fileNumber -gt 1) {
        $fileNumber--
        Remove-Item -Path "$folderPath\$fileBaseName$fileNumber$fileExtension"
        Write-Host "Deleted $fileBaseName$fileNumber$fileExtension in $folderPath"
    }
    else {
        Write-Host "No files found to delete in $folderPath"
    }
}