function runPowerShellFile(fileName, functionName) {
    const scriptPath = path.join(__dirname, '..', 'mods', fileName + '.ps1')
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

    // TESTS run whole script files sequentially
    // runPowerShellFile('test1')
    //     .then(() => runPowerShellFile('test2'))
    //     .then(() => runPowerShellFile('test3', 'testTwo'))

    // TEST run a specific function from a file
    // runModFunction('test3', 'testTwo')
    // runModFunction('test3', 'testOne')