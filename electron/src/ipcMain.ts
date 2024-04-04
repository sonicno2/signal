import { IpcMainInvokeEvent, app, dialog, ipcMain } from "electron"
import { readFile, readdir, writeFile } from "fs/promises"
import { join } from "path"
import { getArgument } from "./arguments"

const api = {
  showOpenDialog: async () => {
    const fileObj = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "MIDI File", extensions: ["mid", "midi"] }],
    })
    if (fileObj.canceled) {
      return null
    }
    const path = fileObj.filePaths[0]
    const content = await readFile(path)
    return { path, content: content.buffer }
  },
  showOpenDirectoryDialog: async () => {
    const fileObj = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    })
    if (fileObj.canceled) {
      return null
    }
    const path = fileObj.filePaths[0]
    return path
  },
  saveFile: async (_e: IpcMainInvokeEvent, path: string, data: ArrayBuffer) => {
    await writeFile(path, Buffer.from(data))
  },
  readFile: async (_e: IpcMainInvokeEvent, path: string) => {
    const content = await readFile(path)
    return content.buffer
  },
  searchSoundFonts: async (_e: IpcMainInvokeEvent, path: string) => {
    const files = await readdir(path, { withFileTypes: true })
    return files
      .filter((f) => f.isFile() && f.name.endsWith(".sf2"))
      .map((f) => join(f.path, f.name))
  },
  showSaveDialog: async () => {
    const fileObj = await dialog.showSaveDialog({
      filters: [{ name: "MIDI File", extensions: ["mid", "midi"] }],
    })
    if (fileObj.canceled) {
      return null
    }
    const path = fileObj.filePath
    if (!path) {
      return null
    }
    return { path }
  },
  addRecentDocument: (_e: IpcMainInvokeEvent, path: string) => {
    app.addRecentDocument(path)
  },
  getArgument: async () => getArgument(),
}

export type IpcMainAPI = typeof api

export const registerIpcMain = () => {
  Object.entries(api).forEach(([name, func]) => {
    ipcMain.handle(name, func)
  })
}
