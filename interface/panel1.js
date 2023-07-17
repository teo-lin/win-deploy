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

        const mods = generateModsList(jsonData[tabName], tabName)
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

function generateModsList(jsonData, tabName) {
    function createCheckboxElement(checkbox, tabName) {
        const checkboxElement = document.createElement("div")
        checkboxElement.classList.add("mod")
        checkboxElement.innerHTML = `
      <input type="checkbox" id="${checkbox.file}" data-tab-name="${tabName}">
      <label for="${checkbox.id}">${checkbox.info}</label>
    `
        return checkboxElement
    }

    const checkboxesDiv = document.createElement("div")
    jsonData.forEach((checkbox) => {
        const checkboxElement = createCheckboxElement(checkbox, tabName)
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

function handleLongHover(mod) {
    // Get mod info
    const checkbox = mod.querySelector('input[type="checkbox"]')
    const modType = checkbox.dataset.tabName
    const modName = checkbox.id
    const modRoot = path.join(path.dirname(__dirname), 'modules', modType)

    // execute the Status Function on longHover tho get the current status
    runModFunction(modRoot, modType, modName, 'Status')
        .then(response => {
            const output = document.querySelector("#output")
            output.innerHTML += '<br><br>' + response
        })
        .catch(error => console.log(error))

    // TESTS run whole script files sequentially
    // runPowerShellFile('test1')
    //     .then(() => runPowerShellFile('test2'))
    //     .then(() => runPowerShellFile('test3', 'testTwo'))

    // TEST run a specific function from a file
    // runModFunction('test3', 'testTwo')
    // runModFunction('test3', 'testOne')
}

fetch("modules.json")
    .then(jsonFile => jsonFile.json())
    .then(jsonData => generateHtml(jsonData))
    .then(() => attachEvents())
    .catch(error => console.log(error))