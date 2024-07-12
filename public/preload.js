const { contextBridge, ipcRenderer  } = require('electron');

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
  onRemoveStr: () => {
    ipcRenderer.removeAllListeners('storage')
  },
  minimize: () => ipcRenderer.send('minimize'),
  maximize: () => ipcRenderer.send('maximize'),
  close: () => ipcRenderer.send('close'),
});

