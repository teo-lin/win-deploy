function openTab(evt, tabName) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}







// ------- FUNCTION DEFINITIONS ---------
function log(message) {
  const consoleElement = document.getElementById('console')
  const p = document.createElement('p')
  p.textContent = message
  consoleElement.appendChild(p)
}
function getJsonData(response) {
  return response.json()
}
function createCheckboxElement(checkbox) {
  const checkboxElement = document.createElement('div')
  checkboxElement.classList.add('mod')
  checkboxElement.innerHTML = `
    <input type="checkbox" id="${checkbox.file}">
    <label for="${checkbox.id}">${checkbox.info}</label>
  `
  return checkboxElement
}
function handleModMouseEnter(mod) {
  console.log('hovering...')
  const audio = new Audio('hover.mp3')
  audio.currentTime = 0
  audio.play()
  const output = document.querySelector('#output')
  output.textContent = mod.textContent
  mod.hoverTimeout = setTimeout(() => { mod.dispatchEvent(mod.longHoverEvent) }, 1000)
}
function handleModMouseLeave(mod) {
  clearTimeout(mod.hoverTimeout)
}
function handleLongHover(mod) {
  console.log('Hello')
}
function attachEvents() {
  const mods = document.querySelectorAll('.mod')
  mods.forEach(mod => {
    mod.hoverTimeout = null
    mod.longHoverEvent = new Event('longhover')
    mod.addEventListener('mouseenter', () => handleModMouseEnter(mod))
    mod.addEventListener('mouseleave', () => handleModMouseLeave(mod))
    mod.addEventListener('longhover', () => handleLongHover(mod))
  })
}
function generateModsList(data) {
  const checkboxesDiv = document.getElementById('checkboxes')
  data.forEach(checkbox => {
    const checkboxElement = createCheckboxElement(checkbox)
    checkboxesDiv.appendChild(checkboxElement)
  })
  return checkboxesDiv.querySelectorAll('.mod')
}

// ----------- EXECUTE ------------
// Redirect console output to the UI
console.log = log
// Generate mods list and attach events
fetch('mods.json')
  .then(getJsonData)
  .then(generateModsList)
  .then(attachEvents)