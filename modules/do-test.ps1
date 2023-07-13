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