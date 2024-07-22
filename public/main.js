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
const Store = require('electron-store');
const Database = require('better-sqlite3');
const fs = require('fs');
const log = require('electron-log');
const {autoUpdater} = require('electron-updater')
const ProgressBar = require('electron-progressbar');
const { setup: setupPushReceiver } = require('electron-push-receiver');
const icons = [
    path.join(__dirname, '/meer_1.png'),
    path.join(__dirname, '/meer.png'),
];

// 초기화
let mainWindow;
let tray;
let intervalId;
let iconIndex = 0;
let db;


/**
 * 자동업데이트
 */

// 로그 초기화
log.transports.file.level = 'info';
// 자동업데이트 로그 설정
autoUpdater.logger = log;
// 자동업데이트 자동다운로드 false
autoUpdater.autoDownload=false

// 개발 환경에서도 업데이트를 확인하도록 설정
autoUpdater.autoDownload = false;
autoUpdater.allowPrerelease = true;
autoUpdater.forceDevUpdateConfig = true;

// 자동업데이트 연결할 repository
autoUpdater.setFeedURL({
    provider : 'github',
    owner : 'Kimminwoo6039',
    repo : 'window-app',
    token: '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',
    private: true,
    //  private: false, // 공개 저장소인 경우 false로 설정
})


// 다운로드 UI 표시
function downloadBar() {
    progressBar = new ProgressBar({
        text: '다운로드중...',
        detail: '다운로드중...',
    });

    progressBar
        .on('completed', function () {
            console.info(`completed...`);
            progressBar.detail = 'Task completed. Exiting...';
        })
        .on('aborted', function () {
            console.info(`aborted...`);
        });
}

// 최선 업데이트 있는지 확인.
autoUpdater.on('checking-for-update', () => {
    log.info('업데이트 확인 중...');
});

// 업데이트 할게 있을시
autoUpdater.on('update-available', (info) => {
    log.info('Update available.');
    dialog.showMessageBox({
        type: 'question',
        title: '업데이트',
        message: '새로운 버전이 출시되었습니다. 업데이트 하시겠습니까?',
        buttons: ['네', '아니오'],
    }).then(result => {
        if (result.response === 0) { // 'Update' 클릭 시
            autoUpdater.downloadUpdate().then(
                downloadBar()
            )
        }
    });

});

// 업데이트 최신
autoUpdater.on('update-not-available', (info) => {
    log.info('현재 최신버전입니다.');
});

// 업데이트 에러
autoUpdater.on('error', (err) => {
    log.info('에러가 발생하였습니다. 에러내용 : ' + err);
});


// 업데이트 다운로드가 끝난 경우
autoUpdater.on("update-downloaded", (info) => {
    progressBar.setCompleted()

    const options = {
        type: "question",
        buttons: ["업데이트", "취소"],
        title: "클라이언트 업데이터",
        message: "업데이트가 있습니다. 프로그램을 업데이트 하시겠습니까?",
    };

    let btnIndex = dialog.showMessageBoxSync(mainWindow, options);
    if (btnIndex === 0) {
        log.info("update install start and quit");
        autoUpdater.quitAndInstall();
    } else {
        log.info("no update. exit ");
        app.quit();
    }
});


/**
 * better-sqlite3 DB 연결 설정
 */

function dbConnection() {

    const dbPath = path.resolve(app.getAppPath(), 'meercatch.db')

    log.info('DataBase 경로=',dbPath)
    db = new Database('meercatch.db', {verbose: console.log});
    db.pragma("journal_mode = WAL");

// 테이블 존재 여부 확인
    const tableExists = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='T_HISTORY';`).get();

    if (tableExists) {
        log.info('테이블 T_HISTORY가 이미 존재합니다.')
    } else {
        // 테이블 생성 쿼리 실행
        db.exec(`
  CREATE TABLE "T_HISTORY" (
    "HISTORY_SEQ" INTEGER NOT NULL,
    "EVENT_TYPE" INTEGER NOT NULL,
    "EVENT_IMAGE" UNKNOWN NOT NULL,
    "EVENT_CODE" VARCHAR(2048) NULL,
    "EVENT_OBJ" VARCHAR(2048) NULL,
    "EVENT_VERIFY" TINYINT NOT NULL,
    "REG_DATE" DATETIME NULL,
    "EVENT_SCORE" VARCHAR(2048) NULL,
    PRIMARY KEY ("HISTORY_SEQ")
  )
`);

        try {
            db.exec(`
        INSERT INTO T_HISTORY (HISTORY_SEQ, EVENT_TYPE, EVENT_IMAGE, EVENT_CODE, EVENT_OBJ, EVENT_VERIFY, REG_DATE, EVENT_SCORE) VALUES(0, 0, 'https://blog.kakaocdn.net/dn/0mySg/btqCUccOGVk/nQ68nZiNKoIEGNJkooELF1/img.jpg', '둔부', 'OBJ', 0, datetime('now', 'localtime'), NULL)
        `);
        } catch (e) {
            log.info(e.message)
        }


        log.info('테이블 T_HISTORY가 생성되었습니다.')
    }
}


// IPC to fetch data from the database
ipcMain.handle('fetch-data-from-db', async (event) => {
    dbConnection()
    return new Promise((resolve, reject) => {
        resolve(
            db.prepare('select * from T_HISTORY').all()
        )
    });
});


/**
 * 리액트상 자동업데이트 사용 유/무
 */
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


/**
 * 타이틀바 이벤트
 */
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


/**
 * window 생성창
 */

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

    //mainWindow.webContents.openDevTools()

    if (!app.requestSingleInstanceLock()) {
        app.quit(); // 두 번째 인스턴스가 실행되려고 하면 애플리케이션 종료
        db.close()
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

    // 최대화 못하게 막기
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

    // Setup push receiver
    setupPushReceiver(mainWindow.webContents);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });


}

/**
 * 트레이 생성
 */

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

// 아이콘 깜박거리기
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
        app.quit()
    }
});



app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// 앱이 준비상태가 되었을때
app.on('ready', async () => {
    app.setAppUserModelId("MeerCat.ch");
    createWindow();
    createTray();
    try {
        await autoUpdater.checkForUpdatesAndNotify();
    } catch (e) {
        console.log('error')
    }
    ipcMain.on("storeFCMToken", (e, token) => {
        store.set('fcm_token', token);
    });

    ipcMain.on("getFCMToken", async (e) => {
        e.sender.send('getFCMToken', store.get('fcm_token'));
    });
});

ipcMain.on("pushNotification", (e, result) => {
    showNotification(result)
});

function showNotification(result) {
    const notification = new Notification({
        title: result.notification.title,
        body: result.notification.body,
        icon: path.join(__dirname, '/meer.png'),
    });

    notification.show();
}
