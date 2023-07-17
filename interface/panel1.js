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

        const mods = generateModsList(jsonData[tabName])
        mods.forEach((mod) => tabContent.appendChild(mod))

        tabContainer.appendChild(tabButton)
        tabContentContainer.appendChild(tabContent)

        modsByTab[tabName] = mods
    })

    return {
        jsonData: jsonData,
        modsByTab: modsByTab,
    }
}

function generateModsList(jsonData) {
    function createCheckboxElement(checkbox) {
        const checkboxElement = document.createElement("div")
        checkboxElement.classList.add("mod")
        checkboxElement.innerHTML = `
      <input type="checkbox" id="${checkbox.file}">
      <label for="${checkbox.id}">${checkbox.info}</label>
    `
        return checkboxElement
    }

    const checkboxesDiv = document.createElement("div")
    jsonData.forEach((checkbox) => {
        const checkboxElement = createCheckboxElement(checkbox)
        checkboxesDiv.appendChild(checkboxElement)
    })
    return checkboxesDiv.querySelectorAll(".mod")
}

function attachEvents() {
    const mods = document.querySelectorAll(".mod")
    mods.forEach((mod) => {
        mod.hoverTimeout = null
        mod.longHoverEvent = new Event("longhover")
        mod.addEventListener("mouseenter", () => handleModMouseEnter(mod))
        mod.addEventListener("mouseleave", () => clearTimeout(mod.hoverTimeout))
        mod.addEventListener("longhover", () => handleLongHover(mod))
    })
}

function handleModMouseEnter(mod) {
    console.log("hovering...")
    const audio = new Audio("hover.mp3")
    audio.currentTime = 0
    audio.play()
    const output = document.querySelector("#output")
    output.textContent = mod.textContent
    mod.hoverTimeout = setTimeout(() => {
        mod.dispatchEvent(mod.longHoverEvent)
    }, 1000)
}

function getModName(mod) {
    // Get the filename of that mod
    const fileName = mod.querySelector('input[type="checkbox"]').id
    console.log(`FILE NAME: ${fileName}.ps1`)
    return fileName
}

function handleLongHover(mod) {
    const fileName = getModName(mod)

    // TESTS run whole script files sequentially
    runPowerShellFile('test1')
        .then(() => runPowerShellFile('test2'))
        .then(() => runPowerShellFile('test3', 'testTwo'))

    // TEST run a specific function from a file
    runPowerShellScriptWithExtraCommand('test3', 'testTwo')
    runPowerShellScriptWithExtraCommand('test3', 'testOne')

    // Get Status

}

fetch("modules.json")
    .then(jsonFile => jsonFile.json())
    .then(jsonData => generateHtml(jsonData))
    .then(() => attachEvents())
    .catch(error => console.log(error))