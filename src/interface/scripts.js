const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

function runPowerShellBase64EncodedCommand(command) {
    let args = ['-NoLogo', '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', command]
    return new Promise((resolve, reject) => {
        const child = spawn('powershell.exe', args, { shell: true, elevated: true })
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
    const modRoot = path.join(path.dirname(__dirname))
    const modType = mod.dataset.type
    const modName = mod.dataset.file
    logBold(`RUNNING: ${modType}.${modName}.${functionName}`)

    return new Promise((resolve, reject) => {
        const modPath = path.join(__dirname, '..', 'mods', modType, modName + '.ps1')
        const modText = fs.readFileSync(modPath, 'utf8')
        const modCode = `${modText}\n${functionName} ${modRoot}`
        const command = Buffer.from(modCode, 'utf16le').toString('base64')

        runPowerShellBase64EncodedCommand(command)
            .then(result => {
                const output = document.querySelector("#output")
                output.innerHTML += `<br>CURRENTLY RUNNING : <span style="color: hotpink; font-weight: bold;">${modType}.${modName}.${functionName}</span><br>`
                result = result.replace(/\n|\r\n?/g, '<br>')
                output.innerHTML += `<span style="color: lightgreen;">${result}</span>`
                console.log(result)
                resolve(result)
            })
            .catch(error => {
                console.error(error)
                reject(error)
            })
    })
}

function openTab(eventObject, typeName) {
    var i, tabcontent, tablinks

    tabcontent = document.getElementsByClassName("tabcontent")
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none"
    }

    tablinks = document.getElementsByClassName("tablinks")
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "")
    }

    document.getElementById(typeName).style.display = "block"
    eventObject.currentTarget.className += " active"
}

// Generate panel1 automatically from json
function generateHtml(jsonData) {
    const typeContainer = document.getElementById("type-container")
    const typeContentContainer = document.getElementById("type-content-container")
    const modsByType = {}

    Object.entries(jsonData).forEach(([type, mods]) => {
        const typeButton = addTabButton(type)
        const typeContent = addTabContent(type)
        const modElements = mods.map(mod => addModElement(mod))
        typeContent.append(...modElements)
        typeContainer.appendChild(typeButton)
        typeContentContainer.appendChild(typeContent)
        modsByType[type] = modElements
    })

    return { jsonData, modsByType }
}

function addTabButton(type) {
    const typeButton = document.createElement("button")
    typeButton.classList.add("tablinks")
    typeButton.textContent = type
    typeButton.onclick = (event) => openTab(event, `tab-${type}`)
    return typeButton
}

function addTabContent(type) {
    const typeContent = document.createElement("div")
    typeContent.classList.add("tabcontent")
    typeContent.id = `tab-${type}`
    return typeContent
}

function addModElement(mod) {
    const { file, type, name, info, sets } = mod
    const modElement = document.createElement("div")
    modElement.classList.add("mod")
    modElement.dataset.file = file
    modElement.dataset.type = type
    modElement.dataset.name = name
    modElement.dataset.info = info
    modElement.dataset.sets = sets
    modElement.innerHTML = `
    <input type="checkbox" id="${file}" data-tab-name="${type}">
    <label for="${file}">${name}</label>
    <button class="modbutton do-button">Do</button>
    <button class="modbutton undo-button">Undo</button>`
    return modElement
}

function attachEvents() {
    function handleModMouseEnter(mod) {
        const audio = new Audio("hover.mp3")
        audio.currentTime = 0
        audio.play()
        const output = document.querySelector("#output")
        const info = mod.dataset.info.replace(/\n/g, '<br>')
        output.innerHTML = `${info}<br>`
        mod.hoverTimeout = setTimeout(() => { mod.dispatchEvent(mod.longHoverEvent) }, 1000)
    }

    const mods = document.querySelectorAll(".mod")
    mods.forEach((mod) => {
        // Add long hover action
        mod.hoverTimeout = null
        mod.longHoverEvent = new Event("longhover")
        mod.addEventListener("mouseenter", () => handleModMouseEnter(mod))
        mod.addEventListener("mouseleave", () => clearTimeout(mod.hoverTimeout))
        mod.addEventListener("longhover", () => runModFunction(mod, 'Status'))

        // Add Do/Undo buttons
        mod.querySelector('.do-button').addEventListener("click", () => runModFunction(mod, 'Apply'))
        mod.querySelector('.undo-button').addEventListener("click", () => runModFunction(mod, 'Undo'))
    })
}

fetch("mods.json")
    .then(jsonFile => jsonFile.json())
    .then(jsonData => generateHtml(jsonData))
    .then(() => attachEvents())
    .catch(error => console.log(error))