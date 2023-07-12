// Get the console element
const consoleElement = document.getElementById('console');

// Override the default console log function to print to consoleElement
function log(message) {
  const p = document.createElement('p');
  p.textContent = message;
  // p.style.margin = '0';
  // p.style.padding = '0';
  consoleElement.appendChild(p);
}
// Redirect console output to the log
console.log = log;

const mods = document.querySelectorAll('.mod');
const audio = new Audio('hover.mp3');

// Load the checkboxes from the JSON file
fetch('mods.json')
  .then(response => response.json())
  .then(data => {
    const checkboxesDiv = document.getElementById('checkboxes');
    data.forEach(checkbox => {
      // Create the checkbox element and set its attributes
      const checkboxElement = document.createElement('div');
      checkboxElement.classList.add('mod');
      checkboxElement.innerHTML = `
          <input type="checkbox" id="${checkbox.id}">
          <label for="${checkbox.id}">${checkbox.description}</label>
        `;

      checkboxesDiv.appendChild(checkboxElement);
    });

    // Return the .mod elements
    return checkboxesDiv.querySelectorAll('.mod');
  })
  .then(mods => {
    const audio = new Audio('hover.mp3');

    mods.forEach(mod => {
      mod.addEventListener('mouseenter', () => {
        console.log('hovering');
        audio.currentTime = 0;
        audio.play();
        const output = document.querySelector('#output');
        output.textContent = mod.textContent;
      });
    });
  });