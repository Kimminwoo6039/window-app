const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electron', {
  onNavigate: (callback) => {
    console.log('Listening for navigate events in preload');
    ipcRenderer.on('navigate', (event, path) => {
      console.log('Received navigate event:', path);
      callback(event, path);
    });
  },
  minimize: () => ipcRenderer.send('minimize'),
  maximize: () => ipcRenderer.send('maximize'),
  close: () => ipcRenderer.send('close')
});




