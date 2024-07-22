const {
    app,
    BrowserWindow,
    Tray,
    Menu,
    ipcMain,
    dialog,
    Notification,
    url,
} = require('electron');
const path = require('path');
const Store = require('electron-store');
const icons = [
    path.join(__dirname, '/meer_1.png'),
    path.join(__dirname, '/meer.png'),
];
const Database = require('better-sqlite3');
const fs = require('fs');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const ProgressBar = require('electron-progressbar');
const { setup: setupPushReceiver } = require('electron-push-receiver');

// 초기화 변수
let mainWindow;
let tray;
let intervalId;
let iconIndex = 0;
let db;
let progressBar;

/**
 * 리액트상 자동업데이트 사용 유/무
 */
const store = new Store({
    defaults: {
        autoLaunch: true, // default to true
    },

});


// 자동업데이트 설정
function setupAutoUpdater() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.autoDownload = false;
    autoUpdater.allowPrerelease = true;
    autoUpdater.forceDevUpdateConfig = true;

    autoUpdater.setFeedURL({
        provider: 'github',
        owner: 'Kimminwoo6039',
        repo: 'window-app',
        token: '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',
        private: true,
    });
}

function downloadBar() {
    progressBar = new ProgressBar({
        text: '다운로드중...',
        detail: '다운로드중...',
    });

    progressBar
        .on('completed', () => {
            console.info('Download completed.');
            progressBar.detail = 'Task completed. Exiting...';
        })
        .on('aborted', () => {
            console.info('Download aborted.');
        });
}

// 자동업데이트 이벤트 핸들러
function setupAutoUpdaterEvents() {
    autoUpdater.on('checking-for-update', () => {
        log.info('업데이트 확인 중...');
    });

    autoUpdater.on('update-available', () => {
        log.info('Update available.');
        dialog.showMessageBox({
            type: 'question',
            title: '업데이트',
            message: '새로운 버전이 출시되었습니다. 업데이트 하시겠습니까?',
            buttons: ['네', '아니오'],
        }).then(result => {
            if (result.response === 0) { // 'Update' 클릭 시
                autoUpdater.downloadUpdate().then(downloadBar);
            }
        });
    });

    autoUpdater.on('update-not-available', () => {
        log.info('현재 최신버전입니다.');
    });

    autoUpdater.on('error', (err) => {
        log.info(`에러가 발생하였습니다. 에러내용: ${err}`);
    });

    autoUpdater.on('update-downloaded', () => {
        progressBar.setCompleted();
        const options = {
            type: 'question',
            buttons: ['업데이트', '취소'],
            title: '클라이언트 업데이터',
            message: '업데이트가 있습니다. 프로그램을 업데이트 하시겠습니까?',
        };

        const btnIndex = dialog.showMessageBoxSync(mainWindow, options);
        if (btnIndex === 0) {
            log.info('Update install start and quit');
            autoUpdater.quitAndInstall();
        } else {
            log.info('No update. Exiting.');
            app.quit();
        }
    });
}

// SQLite 데이터베이스 설정
function setupDatabase() {
    const dbPath = path.resolve(app.getAppPath(), 'meercatch.db');
    log.info('DataBase 경로=', dbPath);

    db = new Database(dbPath, { verbose: console.log });
    db.pragma('journal_mode = WAL');

    const tableExists = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='T_HISTORY';`).get();
    if (!tableExists) {
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
                INSERT INTO T_HISTORY (HISTORY_SEQ, EVENT_TYPE, EVENT_IMAGE, EVENT_CODE, EVENT_OBJ, EVENT_VERIFY, REG_DATE, EVENT_SCORE)
                VALUES (0, 0, 'https://blog.kakaocdn.net/dn/0mySg/btqCUccOGVk/nQ68nZiNKoIEGNJkooELF1/img.jpg', '둔부', 'OBJ', 0, datetime('now', 'localtime'), NULL)
            `);
        } catch (e) {
            log.info(e.message);
        }
        log.info('테이블 T_HISTORY가 생성되었습니다.');
    } else {
        log.info('테이블 T_HISTORY가 이미 존재합니다.');
    }
}

// IPC 핸들러 설정
function setupIPCHandlers() {
    ipcMain.handle('fetch-data-from-db', async () => {
        setupDatabase();
        return db.prepare('SELECT * FROM T_HISTORY').all();
    });

    ipcMain.on('update-auto-launch', (event, value) => {
        store.set('autoLaunch', value);
        app.setLoginItemSettings({
            openAtLogin: value,
            openAsHidden: false,
        });
    });

    ipcMain.on('storeFCMToken', (e, token) => {
        store.set('fcm_token', token);
    });

    ipcMain.on('getFCMToken', (e) => {
        e.sender.send('getFCMToken', store.get('fcm_token'));
    });

    ipcMain.on('pushNotification', (e, result) => {
        showNotification(result);
    });

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
            label: '환경설정', click: () => {
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

// 아이콘 애니메이션
function animateIcon() {
    setInterval(() => {
        iconIndex = (iconIndex + 1) % icons.length;
        tray.setImage(icons[iconIndex]);
    }, 500);
}

// 윈도우 토글
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

// 윈도우 생성
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        title: 'MeerCat.ch',
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

    mainWindow.webContents.openDevTools();

    if (!app.requestSingleInstanceLock()) {
        app.quit();
        db.close();
    } else {
        app.on('second-instance', () => {
            if (mainWindow.isMinimized()) {
                mainWindow.show();
            }
            mainWindow.focus();
        });
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow.webContents.send('storage', 'loginStatus');
        mainWindow.webContents.send('navigate', '/pin/check');
    });

    mainWindow.on('maximize', () => {
        mainWindow.unmaximize();
    });

    ['show', 'restore'].forEach(event => {
        mainWindow.on(event, () => console.log('open'));
    });

    ['hide', 'minimize'].forEach(event => {
        mainWindow.on(event, () => {
            console.log('close');
            mainWindow.webContents.send('storage', 'loginStatus');
            mainWindow.webContents.send('navigate', '/pin/check');
        });
    });

    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });

    mainWindow.loadURL(startUrl);
    setupPushReceiver(mainWindow.webContents);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// 알림 표시
function showNotification(result) {
    const notification = new Notification({
        title: result.notification.title,
        body: result.notification.body,
        icon: path.join(__dirname, '/meer.png'),
    });
    notification.show();
}

// 앱 이벤트
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

app.on('ready', async () => {
    app.setAppUserModelId('MeerCat.ch');
    setupAutoUpdater();
    setupAutoUpdaterEvents();
    setupIPCHandlers();
    createWindow();
    createTray();
    try {
        await autoUpdater.checkForUpdatesAndNotify();
    } catch (e) {
        console.error('Error checking for updates:', e);
    }
});
