const { contextBridge, ipcRenderer  } = require('electron');

ipcRenderer.setMaxListeners(30);


// contextBridge.exposeInMainWorld("sqlite", {
//   personDB,
// })


contextBridge.exposeInMainWorld('electron', {
  isElectron: true, // if window.electron exists, it's electron, but lets include this as well
  getFCMToken: (channel, func) => {
    console.log("시작")
    ipcRenderer.once(channel, func);
    ipcRenderer.send("getFCMToken");
  },
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

// Listen for service successfully started
ipcRenderer.on('PUSH_RECEIVER:::START_NOTIFICATION_SERVICE', (_, token) => {console.log('FCM service started')})
// Start the service
ipcRenderer.on("PUSH_RECEIVER:::NOTIFICATION_SERVICE_STARTED", (_, token) => ipcRenderer.send('storeFCMToken', token),console.log("dma"))
// Handle notification errors
ipcRenderer.on("PUSH_RECEIVER:::NOTIFICATION_SERVICE_ERROR", (_, error) => {console.log(error)})
// Store the new token
ipcRenderer.on("PUSH_RECEIVER:::TOKEN_UPDATED", (_, token) => {
  const event = new CustomEvent('fcmTokenUpdated', {
    payload: token
  });
  window.dispatchEvent(event);
})
// Display notification
ipcRenderer.on('PUSH_RECEIVER:::NOTIFICATION_RECEIVED', (_, serverNotificationPayload) => {console.log("ㅈㅈㅈ",serverNotificationPayload),ipcRenderer.send('pushNotification',serverNotificationPayload)});

// FCM sender ID from FCM console
const senderId = '534635516024'
ipcRenderer.send('PUSH_RECEIVER:::START_NOTIFICATION_SERVICE', senderId)
