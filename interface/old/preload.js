const { contextBridge } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const PowerShell = require('node-powershell')
console.log('preloaded...')

contextBridge.exposeInMainWorld('ps', {
    path: path,
    spawn: spawn,
    PowerShell: PowerShell,
    test: 'gigel'
})

// // Define the API to be exposed to the renderer process
// contextBridge.exposeInMainWorld('myAPI', {
//     runPowerShellScript: (scriptPath, args, callback) => {
//         const fullPath = path.join(__dirname, scriptPath)
//         const powershell = spawn('powershell.exe', ['-File', fullPath, ...args])

//         powershell.stdout.on('data', data => {
//             console.log(`stdout: ${data}`)
//             callback && callback(null, data)
//         })

//         powershell.stderr.on('data', data => {
//             console.error(`stderr: ${data}`)
//             callback && callback(data)
//         })

//         powershell.on('close', code => {
//             console.log(`child process exited with code ${code}`)
//         })
//     }
// })