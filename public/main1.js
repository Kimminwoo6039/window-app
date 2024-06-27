const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const ipc = ipcMain;
const {Menu, Tray} = require('electron'); // 트레이

let count = Number(0)
// 트레이 아이콘 생성 함수
let tray;

function createWindow() {

  if (count === 0) {
    TrayIconMenu()
    count++;
  }

  /*
  * 넓이 1920에 높이 1080의 FHD 풀스크린 앱을 실행시킵니다.
  * */
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    // titleBarStyle:"hidden",
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'meer.png')
  });

  ipc.on('minimizeApp', () => {
    win.minimize()
  })

  ipc.on('maximizeApp', () => {
    if (win.isMaximized()) {
      win.restore();
    } else {
      win.maximize();
    }
  })

  ipc.on('closeApp', () => {
    win.hide();
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

  /*
  * startUrl에 배정되는 url을 맨 위에서 생성한 BrowserWindow에서 실행시킵니다.
  * */


  win.loadURL(startUrl);

}

function TrayIconMenu() {
  tray = new Tray(__dirname + '/meer.png');
  const myMenu = Menu.buildFromTemplate([
    {
      label: '미어캐치 열기', type: 'normal', click: () => {
        createWindow()
      }
    },  //checked는 기본선택입니다.
    {
      label: '환경설정', type: 'normal', click: () => {
        console.log('2번클릭!')
      }
    },
    {
      label: '계정정보', type: 'normal', click: () => {
        console.log('3번클릭!')
      }
    }
  ])
  tray.setToolTip('트레이 아이콘!')
  tray.setContextMenu(myMenu);

  ['double-click', 'click', 'right-click',].forEach(
      event => tray.on(event, () => {
        if (event === "double-click") {

        }
      }));
}

app.whenReady().then(() => {
  createWindow();
});
// app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})