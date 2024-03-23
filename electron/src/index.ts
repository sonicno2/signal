import { app, BrowserWindow, Menu, shell } from "electron"
import path from "path"
import { Ipc } from "./ipc"
import { registerIpcMain } from "./ipcMain"
import { menuTemplate } from "./menu"

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 960,
    height: 720,
    title: `signal v${app.getVersion()}`,
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 10, y: 17 },
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, "..", "dist_preload", "preload.js"),
    },
  })

  // and load the index.html of the app.
  if (!app.isPackaged) {
    mainWindow.loadURL("http://localhost:3000/edit")
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, "../build/index.html"))
  }

  const ipc = new Ipc(mainWindow)

  const menu = Menu.buildFromTemplate(
    menuTemplate({
      onClickNew: () => ipc.send("onNewFile"),
      onClickOpen: async () => ipc.send("onOpenFile"),
      onClickSave: () => ipc.send("onSaveFile"),
      onClickSaveAs: () => ipc.send("onSaveFileAs"),
      onClickExportWav: () => ipc.send("onExportWav"),
      onClickUndo: () => ipc.send("onUndo"),
      onClickRedo: () => ipc.send("onRedo"),
      onClickCut: () => ipc.send("onCut"),
      onClickCopy: () => ipc.send("onCopy"),
      onClickPaste: () => ipc.send("onPaste"),
      onClickSetting: () => ipc.send("onOpenSetting"),
      onClickHelp: () => ipc.send("onOpenHelp"),
    }),
  )
  Menu.setApplicationMenu(menu)

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http")) {
      shell.openExternal(url)
    }
    return { action: "deny" }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

registerIpcMain()