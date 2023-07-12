const mods = document.querySelectorAll('.mod');
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