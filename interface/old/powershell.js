const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

function runPowerShellBase64EncodedCommand(command) {
    let args = ['-NoLogo', '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', command]
    return new Promise((resolve, reject) => {
        const child = spawn('powershell.exe', args)
        let stderr = '', stdout = ''
        child.stdout.on('data', data => stdout += data.toString())
        child.stderr.on('data', data => stderr += data.toString())
        child.on('close', code => {
            if (code === 0) resolve(stdout.trim())
            else reject(new Error(`child process exited with code ${code}\n${stderr.trim()}`))
        })
    })
}

function runModFunction(mod, functionName) {
    console.log(`... starting ${functionName}`)
    const checkbox = mod.querySelector('input[type="checkbox"]')
    const modRoot = path.join(path.dirname(__dirname))
    const modType = checkbox.dataset.tabName
    const modName = checkbox.id

    console.log(`RUNNING: ${modType}.${modName}.${functionName}`)
    return new Promise((resolve, reject) => {
        const modPath = path.join(__dirname, '..', 'mods', modType, modName + '.ps1')
        const modText = fs.readFileSync(modPath, 'utf8')
        const modCode = `${modText}\n${functionName} ${modRoot}`
        const command = Buffer.from(modCode, 'utf16le').toString('base64')
        runPowerShellBase64EncodedCommand(command)
            .then(result => {
                const output = document.querySelector("#output")
                output.innerHTML += '<br><br><span style="color: khaki; font-weight: bold;">CURRENT STATUS:</span><br>'
                result = result.replace(/\n|\r\n?/g, "<br>")
                output.innerHTML += '<span style="color: lavender;">' + result + '</span>'
                console.log(result)
                resolve(result)
            })
            .catch(error => {
                console.error(error)
                reject(error)
            })
    })
}