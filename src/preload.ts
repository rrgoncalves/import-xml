import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  selectDirectory: async (): Promise<string> => {
    return await ipcRenderer.invoke('select-directory');
  },
  closeWindow: () => ipcRenderer.send('close-window'),
  saveFormData: (data: any) => ipcRenderer.send('save-form-data', data),
  loadFormData: () => ipcRenderer.invoke('load-form-data')
});
