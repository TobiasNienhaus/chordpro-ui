import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      pickFile(options): Promise<string>,
      pickNewFile(options): Promise<string>,
      checkChordPro(): Promise<string>,
      openFile(filename: string): Promise<void>,
      createTemp(options, input): Promise<string>,
      exportFinal(options, input, output): Promise<string>,
      clearCache(): Promise<void>
    }
  }
}
