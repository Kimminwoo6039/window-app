const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');
const ipc = ipcMain;
const url = require('url');

let mainWindow;
let tray;

// 타이틀바 이벤트 처리
ipcMain.on('minimize', () => {
  mainWindow.minimize();
});

ipcMain.on('maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.restore();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on('close', () => {
  mainWindow.close();
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    // titleBarStyle:"hidden",
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, '/preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    icon: path.join(__dirname, '/meer.png')
  });



  /*
  * ELECTRON_START_URL을 직접 제공할경우 해당 URL을 로드합니다.
  * 만일 URL을 따로 지정하지 않을경우 (프로덕션빌드) React 앱이
  * 빌드되는 build 폴더의 index.html 파일을 로드합니다.
  * */
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  createTray();
});

function createTray() {
  tray = new Tray(__dirname + '/meer.png');
  const contextMenu = Menu.buildFromTemplate([
    { label: '홈', click: () => {
        console.log('Navigating to Home');
        mainWindow.webContents.send('navigate', '/');
      }},
    { label: '뉴', click: () => {
        console.log('Navigating to New');
        mainWindow.webContents.send('navigate', '/new');
      }},
    { label: 'Go to Edit', click: () => {
        console.log('Navigating to Edit');
        mainWindow.webContents.send('navigate', '/edit/1');
      }},
    { label: 'Quit', click: () => app.quit() }
  ]);

  tray.setToolTip('Electron Tray App');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    console.log('Tray icon clicked');
    mainWindow.webContents.send('navigate', '/');
    toggleWindow()
  });
}

function toggleWindow() {
  if (mainWindow) {
    // 창이 이미 열려 있는 경우, 창을 포커스
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  } else {
    // 창이 없는 경우, 창을 새로 생성
    createWindow();
  }
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

