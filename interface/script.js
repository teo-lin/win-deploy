// Generate panel1 automatically from json
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
function attachEvents(data) {
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
  function handleModMouseLeave(mod) {
    clearTimeout(mod.hoverTimeout)
  }
  function handleLongHover(mod) {
    const checkbox = mod.querySelector('input[type="checkbox"]')
    const fileName = checkbox.id
    console.log(`FILE NAME: ${fileName}.ps1`)
    const filePath = getFilePath(fileName, data.jsonData, data.modsByTab)
    console.log('FILE PATH: ', filePath)
  }
  const mods = document.querySelectorAll(".mod")
  mods.forEach((mod) => {
    mod.hoverTimeout = null
    mod.longHoverEvent = new Event("longhover")
    mod.addEventListener("mouseenter", () => handleModMouseEnter(mod))
    mod.addEventListener("mouseleave", () => handleModMouseLeave(mod))
    mod.addEventListener("longhover", () => handleLongHover(mod))
  })
}
function getFilePath(fileName, jsonData, modsByTab) {
  console.log('DATA:', fileName, jsonData, typeof jsonData) // PROBLEM !!!!!!!!!!
  console.log('JSON:', JSON.stringify(jsonData))
  for (const tabName in modsByTab) {
    const mods = modsByTab[tabName]
    for (const mod of mods) {
      const checkbox = mod.querySelector('input[type="checkbox"]')
      if (checkbox.id === fileName) {
        const filePath = `${tabName}/${fileName}.ps1`
        return filePath
      }
    }
  }
  throw new Error(`File not found: ${fileName}`)
}

fetch("modules.json")
  .then(jsonFile => jsonFile.json())
  .then(jsonData => generateHtml(jsonData))
  .then(jsonData => attachEvents(jsonData))
  .catch(error => console.log(error))