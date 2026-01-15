import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    startDrag: (fileName: any) => ipcRenderer.send('ondragstart', fileName),
    clickButton: (event: Event): void => ipcRenderer.send('clickbutton', event)
})