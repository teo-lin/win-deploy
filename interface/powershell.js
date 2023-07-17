const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

function psRun(fileName, functionName) {
    const scriptPath = path.join(__dirname, fileName + '.ps1')
    let args = ['-ExecutionPolicy', 'Bypass', '-File', scriptPath, '-NoLogo', '-NoProfile', '-NonInteractive']
    if (functionName) args.push(functionName)

    return new Promise((resolve, reject) => {
        const child = spawn('powershell.exe', args)
        child.stdout.on('data', data => console.log(data))
        child.stderr.on('data', data => console.error(data))
        child.on('close', code => {
            if (code === 0) resolve()
            else reject(new Error(`child process exited with code ${code}`))
        })
    })
}

function psCommandBase64(command) {
    return new Promise((resolve, reject) => {
        const child = spawn('powershell.exe', ['-NoLogo', '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', command])
        let stdout = ''
        let stderr = ''
        child.stdout.on('data', data => stdout += data.toString())
        child.stderr.on('data', data => stderr += data.toString())
        child.on('close', code => {
            if (code === 0) resolve(stdout.trim())
            else reject(new Error(`child process exited with code ${code}\n${stderr.trim()}`))
        })
    })
}

async function runScriptWithExtraCommand(fileName, extraCommand) {
    const scriptPath = path.join(__dirname, fileName + '.ps1')
    const scriptContent = fs.readFileSync(scriptPath, 'utf8')
    const modifiedScriptContent = `${scriptContent}\n${extraCommand}`
    const encodedCommand = Buffer.from(modifiedScriptContent, 'utf16le').toString('base64')
    try {
        const result = await psCommandBase64(encodedCommand)
        console.log(result)
    }
    catch (error) { console.error(error) }
}
