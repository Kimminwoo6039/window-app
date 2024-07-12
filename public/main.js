const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  ipcMain,
  dialog,
  Notification, screen, desktopCapturer,
} = require('electron');
const path = require('path');
const url = require('url');
let mainWindow;
let tray;
let intervalId;
const Store = require('electron-store');
let iconIndex = 0;
const icons = [
  path.join(__dirname, '/meer_1.png'),
  path.join(__dirname, '/meer.png'),
];
const Database  = require('better-sqlite3');
const asar = require('asar');

let db;
  console.log("ready")
const buildPath = path.join(app.getAppPath(), 'build');
const asarPath = path.join(app.getAppPath(), 'resources', 'app.asar');
console.log('1',path.join(__dirname, 'build'))
console.log('2',asarPath)
asar.createPackageWithOptions(buildPath, asarPath, {});
  // // SQLite 데이터베이스 파일 경로
  // const dbPath = path.resolve(app.getPath('userData'), '/../../meercatch.db');
  //
const dbPath = path.resolve(app.getAppPath(), 'meercatch.db') ?? 'meercatch.db'
console.log(dbPath)
    db = new Database('meercatch.db', { verbose: console.log });
  db.pragma("journal_mode = WAL");
  console.log("ok")

// IPC to fetch data from the database
ipcMain.handle('fetch-data-from-db', async (event) => {
  return new Promise((resolve, reject) => {
    resolve(
       db.prepare('select * from T_HISTORY').all()
    )
  });
});

// 데이터베이스 파일 경로 설정

// SQLite3 데이터베이스 연결
// db = new Database('meercatch.db');
// db.pragma("journal_mode = WAL");

// IPC를 통해 React로 데이터 전송하기
// ipcMain.handle('fetch-data-from-db', (event) => {
//   return db.prepare('SELECT * FROM T_HISTORY').all();
// });

const store = new Store({
  defaults: {
    autoLaunch: true, // default to true
  },

});

const onUpdateAutoLaunch = (value) => {
  store.set('autoLaunch', value);
  app.setLoginItemSettings({
    openAtLogin: value,
    openAsHidden: false,
  });
};


ipcMain.on('update-auto-launch', (event, value) => {
  onUpdateAutoLaunch(value);
});

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
  mainWindow.hide();
});




function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    title: "MeerCat.ch",
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, '/preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    icon: path.join(__dirname, '/meer.png')
  });

  mainWindow.webContents.openDevTools()

  if (!app.requestSingleInstanceLock()) {
    app.quit(); // 두 번째 인스턴스가 실행되려고 하면 애플리케이션 종료
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) {
          mainWindow.show();
        }
        mainWindow.focus();
      }
      mainWindow.show();
      mainWindow.focus();
    });
  }
  // 메인 창이 화면에 표시될 준비가 되었을 때
  mainWindow.once('ready-to-show', () => {
    mainWindow.webContents.send('storage', 'loginStatus');
    mainWindow.webContents.send('navigate', '/pin/check');
    if (mainWindow.isVisible()) {
      console.log(1)
    }
  });

  // Prevent maximize on double-clicking the title bar
  mainWindow.on('maximize', () => {
    mainWindow.unmaximize();
  });

  // 팝업이 올라왔을때
  ['show', 'restore'].forEach(
      event => mainWindow.on(event, () => {
        console.log("open")
      }));

  // 팝업이 내려갔을때
  ['hide', 'minimize'].forEach(
      event => mainWindow.on(event, () => {
        console.log('close')
        mainWindow.webContents.send('storage', 'loginStatus');
        mainWindow.webContents.send('navigate', '/pin/check');
      }));

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

function startServiceLogic() {
  console.log('Starting service logic when mainWindow is shown...');
  intervalId = setInterval(async () => {
    console.log('Fetching data...');
  }, 5000);
}

function stopServiceLogic() {
  console.log('Stopping service logic when mainWindow is hidden...');
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

// 트레이 생성
function createTray() {
  tray = new Tray(path.join(__dirname, '/meer.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '미어캐치 열기', click: () => {
        mainWindow.webContents.send('navigate', '/pin/check');
        toggleWindow();
      }
    },
    {
      label: '환결성정', click: () => {
        mainWindow.webContents.send('navigate', '/pin/check');
        toggleWindow();
      }
    },
    {
      label: '계정정보', click: () => {
        mainWindow.webContents.send('navigate', '/pin/check');
        toggleWindow();
      }
    },
    {
      label: '종료', click: () => {
        mainWindow.webContents.send('storage', 'loginStatus');
        app.quit();
      }
    }
  ]);

  tray.setToolTip('MeerCat.ch');
  tray.setContextMenu(contextMenu);
  animateIcon();
  tray.on('double-click', () => {
    mainWindow.webContents.send('navigate', '/pin/check');
    toggleWindow();
  });
}

function animateIcon() {
  setInterval(() => {
    iconIndex = (iconIndex + 1) % icons.length;
    tray.setImage(icons[iconIndex]);
  }, 500);
}

// 현재 중복된 화면 안생기게 하는 로직
function toggleWindow() {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.show();
    mainWindow.focus();
  } else {
    createWindow();
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (serverProcess) {
      serverProcess.kill();
    }
    app.quit()
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

function allMiniSize() {
  BrowserWindow.getAllWindows().forEach(win => {
    win.minimize();
  });
}

function allQuit() {
  BrowserWindow.getAllWindows().forEach(win => {
    win.close();
  });
}

function showNotification() {
  const notification = new Notification({
    title: 'MeerCat.ch',
    body: '유해 콘텐츠가 탐지 되었습니다.',
    icon: path.join(__dirname, '/meer.png')
  });

  notification.show();
}


app.on('ready', () => {
  app.setAppUserModelId("MeerCat.ch");
  createWindow();
  createTray();
});

// 시스템 종료 또는 재시작 시 이벤트 처리
app.on('before-quit', (event) => {
  mainWindow.webContents.send('storage', 'loginStatus');
  console.log('App is about to quit');
  // 필요한 정리 작업을 수행합니다.
});

// 시스템 재시작 시 실행할 작업 정의
app.on('will-restart', () => {
  // 시스템 재시작 시 수행할 작업을 여기에 작성
  mainWindow.webContents.send('storage', 'loginStatus');
  console.log('애플리케이션이 재시작됩니다...');
  // 필요한 작업을 수행할 수 있습니다.
  if (serverProcess) {
    serverProcess.kill();
  }
});