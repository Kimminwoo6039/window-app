const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const ipc = ipcMain;
const {Menu, Tray} = require('electron'); // 트레이

// 트레이 아이콘 생성 함수
let tray;
let mainWindow;

app.on('ready', () => {
  createTray();
  createWindow();
});


function createTray() {
  tray = new Tray(__dirname + '/meer.png');
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '미어캐치 열기', type: 'normal', click: () => {
        toggleWindow()
        mainWindow.webContents.send('navigate', '/new')
      }
    },  //checked는 기본선택입니다.
    {
      label: '환경설정', type: 'normal', click: () => {
        toggleWindow()
      }
    },
    {
      label: '계정정보', type: 'normal', click: () => {
        toggleWindow()
      }
    }
  ]);

  tray.setToolTip('Electron Tray App');
  tray.setContextMenu(contextMenu);
  tray.on('click',toggleWindow);
  tray.on('click', () => mainWindow.webContents.send('navigate', '/new'));
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



function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    // titleBarStyle:"hidden",
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'meer.png')
  });

  ipc.on('minimizeApp', () => {
    mainWindow.minimize()
  })

  ipc.on('maximizeApp', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  })

  ipc.on('closeApp', () => {
    mainWindow.hide();
  })

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