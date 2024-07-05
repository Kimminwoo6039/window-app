const { contextBridge, ipcRenderer,dialog  } = require('electron');


ipcRenderer.setMaxListeners(5);

contextBridge.exposeInMainWorld('electron', {
  onNavigate: (callback) => {
    const eventHandler = (event, path) => {
      callback(event, path);
    };
    ipcRenderer.on('navigate', eventHandler);

    return () => {
      ipcRenderer.removeAllListeners('navigate')
    }
  },
  onLocalStorage: (callback) => {
    const eventHandler = (event, path) => {
      callback(event, path);
    };
    ipcRenderer.on('storage', eventHandler);
    return () => {
      ipcRenderer.removeAllListeners('storage')
    }
  },
  dialog: {
    showMessageBox: (options) => dialog.showMessageBoxSync(options),
    showOpenDialog: (options) => dialog.showOpenDialogSync(options),
    showSaveDialog: (options) => dialog.showSaveDialogSync(options),
  },
  remove: () => {
    ipcRenderer.removeAllListeners('storage')
    ipcRenderer.removeAllListeners('navigate')
  },
  minimize: () => ipcRenderer.send('minimize'),
  maximize: () => ipcRenderer.send('maximize'),
  close: () => ipcRenderer.send('close'),
});

