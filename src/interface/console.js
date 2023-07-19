// Hijack the console output and redirect it to the UI
function log(message) {
    const consoleElement = document.getElementById('console')
    const p = document.createElement('p')
    if (message instanceof Error) {
        p.style.color = 'salmon'
        p.innerHTML = message
    }
    else {
        p.innerHTML = message
    }
    consoleElement.appendChild(p)
}

function logBold(message) {
    const consoleElement = document.getElementById('console')
    const p = document.createElement('p')
    p.textContent = message
    p.style.color = 'wheat'
    p.style.fontWeight = 'bold'
    consoleElement.appendChild(p)
}

console.log = log
console.error = log
console.info = log