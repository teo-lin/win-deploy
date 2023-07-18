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
    const checkbox = mod.querySelector('input[type="checkbox"]')
    const modRoot = path.join(path.dirname(__dirname))
    const modType = checkbox.dataset.tabName
    const modName = checkbox.id
    // console.log(`RUNNING: ${modType}.${modName}.${functionName}`)
    logBold(`RUNNING: ${modType}.${modName}.${functionName}`)

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

function openTab(eventObject, tabName) {
    var i, tabcontent, tablinks

    tabcontent = document.getElementsByClassName("tabcontent")
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none"
    }

    tablinks = document.getElementsByClassName("tablinks")
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "")
    }

    document.getElementById(tabName).style.display = "block"
    eventObject.currentTarget.className += " active"
}

// Generate panel1 automatically from json
function generateHtml(jsonData) {
    const tabContainer = document.getElementById("tab-container")
    const tabContentContainer = document.getElementById("tab-content-container")
    const modsByTab = {}

    Object.keys(jsonData).forEach((tabName, index) => {
        const tabButton = document.createElement("button")
        tabButton.classList.add("tablinks")
        tabButton.textContent = tabName
        tabButton.onclick = (event) => openTab(event, `tab-${index}`)

        const tabContent = document.createElement("div")
        tabContent.classList.add("tabcontent")
        tabContent.id = `tab-${index}`

        const mods = addModsList(jsonData[tabName], tabName)
        mods.forEach(mod => tabContent.appendChild(mod))
        tabContainer.appendChild(tabButton)
        tabContentContainer.appendChild(tabContent)
        modsByTab[tabName] = mods
    })

    return {
        jsonData: jsonData,
        modsByTab: modsByTab,
    }
}

function addModsList(jsonData, tabName) {
    const checkboxesDiv = document.createElement("div")
    jsonData.forEach((checkbox) => {
        const checkboxElement = addModElement(checkbox, tabName)
        checkboxesDiv.appendChild(checkboxElement)
    })
    return checkboxesDiv.querySelectorAll(".mod")
}

function addModElement(checkbox, tabName) {
    const modElement = document.createElement("div")
    modElement.classList.add("mod")
    modElement.innerHTML = `
      <input type="checkbox" id="${checkbox.file}" data-tab-name="${tabName}">
      <label for="${checkbox.id}">${checkbox.info}</label>
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
        output.textContent = mod.textContent
        mod.hoverTimeout = setTimeout(() => {
            mod.dispatchEvent(mod.longHoverEvent)
        }, 1000)
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