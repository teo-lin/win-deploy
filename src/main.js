const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

// function createDriversFolder() {
//   const driversFolderPath = path.join(app.getPath('userData'), 'driversTest')
//   if (!fs.existsSync(driversFolderPath)) fs.mkdirSync(driversFolderPath)
// }

function createDriversFolder() {
  const driversFolderPath = path.join(app.getPath('userData'), 'driversTest')

  // Check if the "driversTest" folder already exists
  if (!fs.existsSync(driversFolderPath)) {
    // Create the "driversTest" folder if it doesn't exist
    fs.mkdirSync(driversFolderPath)

    console.log("The 'driversTest' folder has been created.")
    console.log("Please place your driver files inside this folder for batch installation.")
    console.log('isPackaged:', app.isPackaged)
    console.log('process.execPath:', process.execPath)
    console.log('exePath:', exePath)
    console.log('driversFolderPath:', driversFolderPath)
    const logFilePath = path.join(exePath, 'log.txt')
    fs.writeFileSync(logFilePath, `isPackaged: ${app.isPackaged}\nprocess.execPath: ${process.execPath}\nexePath: ${exePath}\ndriversFolderPath: ${driversFolderPath}`)
  }
}

function createWindow() {
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true, // disable nodeIntegration to improve security
      contextIsolation: false, // enable contextIsolation to run preload script in a separate context
      enableRemoteModule: true
    }
  })

  window.maximize()
  window.loadFile('src/interface/index.html')
}

app.whenReady().then(() => {
  createDriversFolder()
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})