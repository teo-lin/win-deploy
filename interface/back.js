const { spawn } = require('child_process')
const path = require('path')

function psRun(fileName, functionName) {
    const scriptPath = path.join(__dirname, fileName, '.ps1')
    console.log('PATH:', scriptPath)
    let args = ['-ExecutionPolicy', 'Bypass', '-File', scriptPath]
    if (functionName) args.push(['-Function', functionName])
    console.log('ARGS:', args)
    const options = {
        cwd: __dirname,
        env: process.env
    }

    return new Promise((resolve, reject) => {
        const child = spawn('powershell.exe', args, options)

        child.stdout.on('data', data => console.log(`stdout: ${data}`))
        child.stderr.on('data', data => console.error(`stderr: ${data}`))
        child.on('close', code => {
            console.log(`child process exited with code ${code}`)
            if (code === 0) resolve()
            else reject(new Error(`child process exited with code ${code}`))
        })
    })
}

function psCommand(command) {
    return new Promise((resolve, reject) => {
        scriptsPathawn('powershell.exe ' + command, (err, stdout, stderr) => {
            if (err) {
                reject(err)
                return
            }
            resolve(stdout)
        })
    })
}