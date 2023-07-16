const { app, BrowserWindow } = require('electron')

function createWindow() {
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true, // disable nodeIntegration to improve security
      contextIsolation: false, // enable contextIsolation to run preload script in a separate context
      enableRemoteModule: true
    }
  })

  window.maximize()
  window.loadFile('interface/index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})