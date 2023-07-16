const { exec } = require('child_process')
function psRun(command) {
    return new Promise((resolve, reject) => {
        exec('powershell.exe ' + command, (err, stdout, stderr) => {
            if (err) {
                console.error(err)
                reject(err)
            } else {
                console.log(stdout)
                resolve(stdout)
            }
        })
    })
}

psRun('Write-Host "Starting PS"')
    .then(() => psRun('Get-ChildItem C:\\'))