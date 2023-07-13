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
} else {
    Write-Host "No files found to delete in $folderPath"
}