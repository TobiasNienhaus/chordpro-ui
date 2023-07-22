import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  pickFile: async (options): Promise<string> => ipcRenderer.invoke('filepick', options),
  pickNewFile: async (options): Promise<string> => ipcRenderer.invoke('newfilepick', options),
  checkChordPro: async (): Promise<string> => ipcRenderer.invoke('checkchordpro'),
  createTemp: async (options, input): Promise<string> =>
    ipcRenderer.invoke('createtemp', options, input),
  exportFinal: async (options, input, output): Promise<string> =>
    ipcRenderer.invoke('exportfinal', options, input, output),
  openFile: async (filename): Promise<void> => ipcRenderer.invoke('openfile', filename),
  clearCache: async (): Promise<void> => ipcRenderer.invoke('clearcache')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
