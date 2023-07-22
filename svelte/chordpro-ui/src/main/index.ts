import { app, shell, BrowserWindow, dialog, ipcMain, protocol } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { spawn } from 'child_process'
import { cleanRawInput } from '../shared/command'
import { v4 as uuidv4 } from 'uuid'
import * as fs from 'fs'

const basePath = path.join(app.getPath('temp'), 'tnie', 'chordpro-ui')
const getTmpFile = (): string => path.join(basePath, `${uuidv4()}.pdf`)

fs.mkdir(basePath, { recursive: true }, console.error)

const exportFile = async (opts, input, output): Promise<string> => {
  const cmd = [...opts, `--output=${output}`, `${input}`]
  const child = spawn('chordpro', cmd)

  let data = ''
  for await (const chunk of child.stdout) data += chunk

  let error = ''
  for await (const chunk of child.stderr) error += chunk

  const exitCode = await new Promise((resolve) => child.on('close', resolve))

  if (data.length > 0) console.log('ChordPro stdout', data)
  if (error.length > 0) console.log('ChrodPro stderr', error)
  console.log('ChordPro Exit', exitCode)

  return output
}

function createWindow(): void {
  // Create the browser window.

  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...{ icon },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  ipcMain.handle('filepick', async (_, options) => {
    return await dialog.showOpenDialog(options)
  })

  ipcMain.handle('newfilepick', async (_, options) => {
    return await dialog.showSaveDialog(options)
  })

  ipcMain.handle('createtemp', async (_, options, inputFile: string): Promise<string> => {
    const opts = cleanRawInput(options, undefined)
    const tmp = getTmpFile()

    return exportFile(opts, inputFile, tmp)
  })

  ipcMain.handle(
    'exportfinal',
    async (_, options, inputFile: string, outputFile: string): Promise<string> =>
      exportFile(cleanRawInput(options, outputFile), inputFile, outputFile)
  )

  ipcMain.handle('openfile', async (_, filename: string): Promise<void> => {
    console.log('OUTER', filename)
    if (filename.endsWith('.pdf')) {
      console.log('INNER', filename)
      spawn('cmd', ['/c', 'start', '""', filename], { detached: true })
    }
  })

  ipcMain.handle('clearcache', async (): Promise<void> => {
    fs.rm(basePath, { recursive: true }, (error) => {
      if (error == null) fs.mkdir(basePath, { recursive: true }, console.error)
      else console.log(error)
    })
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.tnie')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = decodeURI(request.url.replace('file:///', ''))
    callback(pathname)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  fs.rm(basePath, { recursive: true }, (error) => {
    if (error == null) fs.mkdir(basePath, { recursive: true }, console.error)
    else console.log(error)
  })
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
