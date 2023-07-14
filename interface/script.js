// Hijack the console output and redirect it to the UI
function log(message) {
  const consoleElement = document.getElementById('console')
  const p = document.createElement('p')
  p.textContent = message
  consoleElement.appendChild(p)
}
console.log = log

// Generate panel1 automatically from json
function openTab(evt, tabName) {
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
  evt.currentTarget.className += " active"
}
function generateModsList(data) {
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
  data.forEach((checkbox) => {
    const checkboxElement = createCheckboxElement(checkbox)
    checkboxesDiv.appendChild(checkboxElement)
  })
  return checkboxesDiv.querySelectorAll(".mod")
}
function generateHtml(data) {
  const tabContainer = document.getElementById("tab-container")
  const tabContentContainer = document.getElementById("tab-content-container")

  Object.keys(data).forEach((tabName, index) => {
    const tabButton = document.createElement("button")
    tabButton.classList.add("tablinks")
    tabButton.textContent = tabName
    tabButton.onclick = (event) => openTab(event, `tab-${index}`)

    const tabContent = document.createElement("div")
    tabContent.classList.add("tabcontent")
    tabContent.id = `tab-${index}`

    const mods = generateModsList(data[tabName])
    mods.forEach((mod) => tabContent.appendChild(mod))

    tabContainer.appendChild(tabButton)
    tabContentContainer.appendChild(tabContent)
  })
}
function attachEvents() {
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
    console.log("Hello")
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

fetch("modules.json")
  .then(jsonFile => jsonFile.json())
  .then(jsonData => generateHtml(jsonData))
  .then(() => attachEvents())
  .catch(error => console.log(error))