// eslint-disable-next-line import/no-extraneous-dependencies
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  selectDirectory: async (): Promise<string> => {
    return ipcRenderer.invoke('select-directory');
  },
  closeWindow: () => ipcRenderer.send('close-window'),
  saveFormData: (data: unknown) => ipcRenderer.send('save-form-data', data),
  loadFormData: () => ipcRenderer.invoke('load-form-data'),
});
