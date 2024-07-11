const { contextBridge, ipcRenderer,dialog  } = require('electron');
const personDB = require("./Database/PersonManager")

ipcRenderer.setMaxListeners(30);


// contextBridge.exposeInMainWorld("sqlite", {
//   personDB,
// })


contextBridge.exposeInMainWorld('electron', {
  onNavigate: (callback) => {
    const eventHandler = (event, path) => {
      callback(event, path);
    };
    ipcRenderer.on('navigate', eventHandler);

    // return () => {
    //   ipcRenderer.removeAllListeners('navigate')
    // }
  },
  onLocalStorage: (callback) => {
    const eventHandler = (event, path) => {
      callback(event, path);
    };
    ipcRenderer.on('storage', eventHandler);

    // return () => {
    //   ipcRenderer.removeAllListeners('storage')
    // }
  },
  send: (channel, data) => {
    // 메인 프로세스로 메시지 전송
    ipcRenderer.send(channel, data);
  },
  fetchDataFromDB: () => {
    return ipcRenderer.invoke('fetch-data-from-db');
  },
  getPersonDB: () => {
    return ipcRenderer.invoke('fetch-data-from-db');
  },
  dialog: {
    showMessageBox: (options) => dialog.showMessageBoxSync(options),
    showOpenDialog: (options) => dialog.showOpenDialogSync(options),
    showSaveDialog: (options) => dialog.showSaveDialogSync(options),
  },
  onRemoveStr: () => {
    ipcRenderer.removeAllListeners('storage')
  },
  minimize: () => ipcRenderer.send('minimize'),
  maximize: () => ipcRenderer.send('maximize'),
  close: () => ipcRenderer.send('close'),
});

