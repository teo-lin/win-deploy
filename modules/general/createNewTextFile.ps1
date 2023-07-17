function Status($root) {
    $folderPath = "$root\test"
    $fileNames = "STATUS: "
    if (Test-Path $folderPath) {
        $files = Get-ChildItem -Path $folderPath -Filter "*.txt" -File
        if ($files.Count -gt 0) {
            $fileNames += "Text files in ${folderPath}: "
            foreach ($file in $files) { $fileNames += $file.Name + ", " }
        }
        else { $fileNames += "No text files found in ${folderPath}." }
    }
    else { $fileNames += "Directory ${folderPath} does not exist." }
    $fileNames = $fileNames.Substring(0, $fileNames.Length - 2) + "."
    return $fileNames
}

function Run($root) {
    $folderPath = "$root\test"
    $fileBaseName = "test"
    $fileExtension = ".txt"
    $fileNumber = 1
    if (-not (Test-Path $folderPath)) { New-Item -ItemType Directory -Path $folderPath }
    while (Test-Path "$folderPath\$fileBaseName$fileNumber$fileExtension") { $fileNumber++ }
    New-Item -ItemType File -Path "$folderPath\$fileBaseName$fileNumber$fileExtension"
}

function Undo($root) {
    $folderPath = "$root\test"
    $fileBaseName = "test"
    $fileExtension = ".txt"
    $fileNumber = 1
    while (Test-Path "$folderPath\$fileBaseName$fileNumber$fileExtension") { $fileNumber++ }
    if ($fileNumber -gt 1) {
        $fileNumber--
        Remove-Item -Path "$folderPath\$fileBaseName$fileNumber$fileExtension"
        Write-Host "Deleted $fileBaseName$fileNumber$fileExtension in $folderPath"
    }
    else { Write-Host "No files found to delete in $folderPath" }
}