import { app, BrowserWindow, ipcMain, shell } from 'electron'
import log from 'electron-log'
import { release } from 'node:os'
import { join } from 'node:path'
import * as db from './app/db'
import { update } from './update'

// require('update-electron-app')()

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

log.transports.file.fileName = 'main.log'
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
log.transports.file.maxSize = 1048576

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.

let mainWindow: BrowserWindow | null = null
const indexHtml = join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
const preload = join(__dirname, 'preload.js')
console.log('indexHtml', indexHtml)
console.log('preload', preload)

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    frame: false,
    icon: join(__dirname,'./public/icon.png'),
    // remove the default titlebar
    titleBarStyle: 'hidden',
    // expose window controls in Windows/Linux
    titleBarOverlay: {
      symbolColor: '#fff',
      color: '#262626',
      height: 35
    },
    webPreferences: {
      preload,
    },
  })

  mainWindow.once('ready-to-show', () => {
    // mainWindow?.maximize()
    mainWindow?.show()
  })

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.on('closed', () => {
    log.info('fuck here closed')
    mainWindow = null
  })

  // Apply electron-updater
  update(mainWindow)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    log.info('All windows closed and quit succeeded')
    app.quit()
  }
})

app.on('second-instance', () => {
  if (mainWindow) {
    // Focus on the main window if the user tried to open another
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.handle('getFileList', () => db.getFileList())
ipcMain.handle('saveFileList', (_event, list) => db.saveFileList(list))
ipcMain.handle('saveFileContent', (_event, filename, content) => db.saveFileContent(filename, content))
ipcMain.handle('getFileContent', (_event, filename) => db.getFileContent(filename))

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
  })
  
  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})