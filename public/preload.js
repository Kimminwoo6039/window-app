const { contextBridge, ipcRenderer } = require('electron');


// Increase the max listeners limit to avoid warnings
ipcRenderer.setMaxListeners(30);

contextBridge.exposeInMainWorld('electron', {
  isElectron: true, // Indicates that this is an Electron environment

  getFCMToken: (channel, func) => {
    console.log("Fetching FCM Token");
    ipcRenderer.once(channel, func);
    ipcRenderer.send("getFCMToken");
  },

  onNavigate: (callback) => {
    ipcRenderer.on('navigate', (event, path) => {
      callback(event, path);
    });
  },

  onLocalStorage: (callback) => {
    ipcRenderer.on('storage', (event, path) => {
      callback(event, path);
    });
  },

  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },

  fetchDataFromDB: () => ipcRenderer.invoke('fetch-data-from-db'),

  onRemoveStr: () => ipcRenderer.removeAllListeners('storage'),

  minimize: () => ipcRenderer.send('minimize'),
  maximize: () => ipcRenderer.send('maximize'),
  close: () => ipcRenderer.send('close'),
});

// Event listeners for push notifications and service status
ipcRenderer.on('PUSH_RECEIVER:::START_NOTIFICATION_SERVICE', () => {
  console.log('FCM service started');
});

ipcRenderer.on('PUSH_RECEIVER:::NOTIFICATION_SERVICE_STARTED', (_, token) => {
  ipcRenderer.send('storeFCMToken', token);
  console.log("FCM Token stored");
});

ipcRenderer.on('PUSH_RECEIVER:::NOTIFICATION_SERVICE_ERROR', (_, error) => {
  console.log('Notification service error:', error);
});

ipcRenderer.on('PUSH_RECEIVER:::TOKEN_UPDATED', (_, token) => {
  const event = new CustomEvent('fcmTokenUpdated', { detail: token });
  window.dispatchEvent(event);
});

ipcRenderer.on('PUSH_RECEIVER:::NOTIFICATION_RECEIVED', (_, serverNotificationPayload) => {
  console.log("Notification received:", serverNotificationPayload);
  ipcRenderer.send('pushNotification', serverNotificationPayload);
});

// Start the FCM notification service
const senderId = '534635516024';
ipcRenderer.send('PUSH_RECEIVER:::START_NOTIFICATION_SERVICE', senderId);
