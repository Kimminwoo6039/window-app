const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  ipcMain,
  Notification, screen, desktopCapturer,
} = require(
    'electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const os = require('os');
const sharp = require('sharp');
let mainWindow;
let tray;
let intervalId;

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
    // titleBarStyle:"hidden",
    frame: false,
    resizable:false,
    webPreferences: {
      preload: path.join(__dirname, '/preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    icon: path.join(__dirname, '/meer.png')
  });

  if (!app.requestSingleInstanceLock()) {
    app.quit(); // 두 번째 인스턴스가 실행되려고 하면 애플리케이션 종료
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      // 이미 실행 중인 인스턴스가 있을 때 실행되는 코드
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.show();
        mainWindow.focus();
      }
      mainWindow.show();
      mainWindow.focus();
    });
  }

  // 메인 창이 화면에 표시될 준비가 되었을 때
  mainWindow.once('ready-to-show', () => {
    // mainWindow가 show() 상태일 때만 실행
    if (mainWindow.isVisible()) {
      // startServiceLogic()
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
        // startServiceLogic()
        console.log("open")
      }));

  // 팝업이 내려갔을때

  ['hide', 'minimize'].forEach(
      event => mainWindow.on(event, () => {
        // stopServiceLogic()
        console.log('close')
        mainWindow.webContents.send('storage', 'loginStatus');
        mainWindow.webContents.send('navigate', '/pin/check');
      }));

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

  // 브라우저 페이지 열기
  mainWindow.loadURL(startUrl);

  // 브라우저 닫기
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

}

function startServiceLogic() {
  // 여기에 실행하려는 서비스 로직을 구현
  console.log('Starting service logic when mainWindow is shown...');
  // 예: 주기적으로 데이터를 가져오는 타이머 설정
  intervalId = setInterval(async () => {
    console.log('Fetching data...');

  }, 5000);
}

function stopServiceLogic() {
  // 여기에 서비스 로직을 중지하는 로직을 구현
  console.log('Stopping service logic when mainWindow is hidden...');
  // 타이머 정지
  if (intervalId) {
    console.log('dd')
    clearInterval(intervalId);
    intervalId = null;
  }
}

// 트레이 생성
function createTray() {
  tray = new Tray(__dirname + '/meer.png');
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '미어캐치 열기', click: () => {
        mainWindow.webContents.send('navigate', '/pin/check');
        toggleWindow()
      }
    },
    {
      label: '환결성정', click: () => {
        mainWindow.webContents.send('navigate', '/pin/check');
        toggleWindow()
      }
    },
    {
      label: '계정정보', click: () => {
        mainWindow.webContents.send('navigate', '/pin/check');
        toggleWindow()
      }
    },
    {
      label: '종료', click: () => {
        app.quit()
      }
    },
    // { label: 'Quit', click: () => app.quit() }
  ]);

  tray.setToolTip('MeerCat.ch');
  tray.setContextMenu(contextMenu);
  ['double-click'].forEach(
      event => tray.on(event, () => {
        mainWindow.webContents.send('navigate', '/pin/check');
        toggleWindow()
      }));
}

// 현재 중복된 화면 안생기게 하는 로직
function toggleWindow() {
  if (mainWindow) {
    // 창이 이미 열려 있는 경우, 창을 포커스
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
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

// 전체 화면 최소화
function allMiniSize() {
  // IPC 이벤트 수신: 모든 창 최소화 요청
  BrowserWindow.getAllWindows().forEach(win => {
    win.minimize();
  });
}

// 전체 화면 취소
function allQuit() {
  // IPC 이벤트 수신: 모든 프로그램 종료 요청
  BrowserWindow.getAllWindows().forEach(win => {
    win.close();
  });
}

// 알림 메시지
function showNotification() {
  const notification = new Notification({
    subtitle: "ddd",
    title: 'MeerCat.ch',
    body: '유해 콘텐츠가 탐지 되었습니다.',
    icon: path.join(__dirname, '/meer.png')
  });

  notification.show();
}

app.on('ready', () => {
  app.setAppUserModelId("MeerCat.ch")
  createWindow();
  createTray();
});

// setTimeout(showNotification, 3000)
// setTimeout(allMiniSize , 6000)