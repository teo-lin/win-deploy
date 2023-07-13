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
    } else {
        Write-Host "No text files found in ${folderPath}"
    }
} else {
    Write-Host "Directory ${folderPath} does not exist"
}