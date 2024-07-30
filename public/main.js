const {
    app,
    BrowserWindow,
    Tray,
    Menu,
    ipcMain,
    dialog,
    shell,
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
const {setup: setupPushReceiver} = require('electron-push-receiver');
const icons = [
    path.join(__dirname, '/meer_1.png'),
    path.join(__dirname, '/meer.png'),
];
const admin = require('firebase-admin'); // Firebase Admin SDK
const { promisify } = require('util');
const readdir = promisify(fs.readdir);

const net = require('net');
let client;
// ######
const PIPE_NAME = '\\\\.\\pipe\\kwspipe';




// 클라이언트 연결 및 자동 재연결 설정
function createPipeClient() {
    client = net.connect(PIPE_NAME, () => {
        console.log('Connected to pipe server.');
        client.write('Hello from Electron!');
    });

    client.on('data', (data) => {
        console.log('Received from server:', data.toString());
    });

    client.on('end', () => {
        // console.log('Disconnected from server.');
        reconnect(); // 연결이 끊어지면 자동으로 재연결 시도
    });

    client.on('error', (err) => {
        // console.error('Error:', err);
        reconnect(); // 오류 발생 시 자동으로 재연결 시도
    });
}

// 클라이언트 재연결 함수
function reconnect() {
    // console.log('Reconnecting to pipe server...');
    setTimeout(() => {
        createPipeClient();
    }, 1000); // 1초 후에 재연결 시도
}

// 주기적
function startServiceLogic() {
    console.log('connected to service logic');
    intervalId = setInterval(async () => {
        createPipeClient()
    }, 1000);
}

// ######

// 초기화
let mainWindow;
let tray;
let intervalId;
let iconIndex = 0;
let db;




// Initialize Firebase Admin SDK
const serviceAccount = require(path.join(__dirname, '/meer-856f7-ed67da0eef70.json'));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
const messaging = admin.messaging();

/**
 * 자동업데이트
 */

// 로그 초기화
log.transports.file.level = 'info';
// 자동업데이트 로그 설정
autoUpdater.logger = log;
// 자동업데이트 자동다운로드 false
autoUpdater.autoDownload = false

// 개발 환경에서도 업데이트를 확인하도록 설정
autoUpdater.autoDownload = false;
autoUpdater.allowPrerelease = true;
autoUpdater.forceDevUpdateConfig = true;

// 자동업데이트 연결할 repository
autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'Kimminwoo6039',
    repo: 'window-app',
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

    // dummy
    const insertStatements = [
        `INSERT INTO T_HISTORY (HISTORY_SEQ, EVENT_TYPE, EVENT_IMAGE, EVENT_CODE, EVENT_OBJ, EVENT_VERIFY, REG_DATE, EVENT_SCORE) VALUES (0, 0, 'https://blog.kakaocdn.net/dn/0mySg/btqCUccOGVk/nQ68nZiNKoIEGNJkooELF1/img.jpg', '2 2 3 3', 'OBJ', 0, datetime('now', 'localtime'), NULL)`,
        `INSERT INTO T_HISTORY (HISTORY_SEQ, EVENT_TYPE, EVENT_IMAGE, EVENT_CODE, EVENT_OBJ, EVENT_VERIFY, REG_DATE, EVENT_SCORE) VALUES (1, 0, 'https://image.utoimage.com/preview/cp872722/2022/12/202212008462_500.jpg', '3 4 ', 'OBJ', 0, datetime('now', 'localtime'), NULL)`,
        `INSERT INTO T_HISTORY (HISTORY_SEQ, EVENT_TYPE, EVENT_IMAGE, EVENT_CODE, EVENT_OBJ, EVENT_VERIFY, REG_DATE, EVENT_SCORE) VALUES (2, 0, 'https://helpx.adobe.com/content/dam/help/en/photoshop/using/quick-actions/remove-background-before-qa1.png', '2', 'OBJ', 0, datetime('now', 'localtime'), NULL)`,
        `INSERT INTO T_HISTORY (HISTORY_SEQ, EVENT_TYPE, EVENT_IMAGE, EVENT_CODE, EVENT_OBJ, EVENT_VERIFY, REG_DATE, EVENT_SCORE) VALUES (3, 0, 'https://www.urbanbrush.net/web/wp-content/uploads/edd/2023/02/urban-20230228144115810458.jpg', '3', 'OBJ', 0, datetime('now', 'localtime'), NULL)`,
        `INSERT INTO T_HISTORY (HISTORY_SEQ, EVENT_TYPE, EVENT_IMAGE, EVENT_CODE, EVENT_OBJ, EVENT_VERIFY, REG_DATE, EVENT_SCORE) VALUES (4, 0, 'https://demo.ycart.kr/shopboth_farm_max5_001/data/editor/1612/cd2f39a0598c81712450b871c218164f_1482469221_493.jpg', '4', 'OBJ', 0, datetime('now', 'localtime'), NULL)`,
        `INSERT INTO T_HISTORY (HISTORY_SEQ, EVENT_TYPE, EVENT_IMAGE, EVENT_CODE, EVENT_OBJ, EVENT_VERIFY, REG_DATE, EVENT_SCORE) VALUES (5, 0, 'https://www.urbanbrush.net/web/wp-content/uploads/edd/2023/02/urban-20230228092421948485.jpg', '4 4', 'OBJ', 0, datetime('now', 'localtime'), NULL)`,
        `INSERT INTO T_HISTORY (HISTORY_SEQ, EVENT_TYPE, EVENT_IMAGE, EVENT_CODE, EVENT_OBJ, EVENT_VERIFY, REG_DATE, EVENT_SCORE) VALUES (6, 0, 'https://image.utoimage.com/preview/cp872722/2024/07/202407002202_500.jpg', '2 3 4', 'OBJ', 0, datetime('now', 'localtime'), NULL)`,
        `INSERT INTO T_HISTORY (HISTORY_SEQ, EVENT_TYPE, EVENT_IMAGE, EVENT_CODE, EVENT_OBJ, EVENT_VERIFY, REG_DATE, EVENT_SCORE) VALUES (7, 0, 'https://www.utoimage.com/data/main/all/20240718100556_160626448766986a7455ce6.jpg', '4 4 ', 'OBJ', 0, datetime('now', 'localtime'), NULL)`
    ];

    try {
        // const dbPath = path.resolve(app.getAppPath(), 'meercatch.db')
        const dbPath = path.join('D:', '/meercatch.db');
        log.info('DataBase 경로=', dbPath)
        //db.pragma("journal_mode = WAL");
        log.info('db', db)

        db = new Database(dbPath, {verbose: console.log});

// 테이블 존재 여부 확인

        const tableExists = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='T_HISTORY';`).get();
        log.info('테이블여부 확인', tableExists);


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
                for (const stmt of insertStatements) {
                    db.exec(stmt);
                }
                //         db.exec(`
                // INSERT INTO T_HISTORY (HISTORY_SEQ, EVENT_TYPE, EVENT_IMAGE, EVENT_CODE, EVENT_OBJ, EVENT_VERIFY, REG_DATE, EVENT_SCORE) VALUES(0, 0, 'https://blog.kakaocdn.net/dn/0mySg/btqCUccOGVk/nQ68nZiNKoIEGNJkooELF1/img.jpg', '둔부', 'OBJ', 0, datetime('now', 'localtime'), NULL),
                // INSERT INTO T_HISTORY (HISTORY_SEQ, EVENT_TYPE, EVENT_IMAGE, EVENT_CODE, EVENT_OBJ, EVENT_VERIFY, REG_DATE, EVENT_SCORE) VALUES(1, 0, 'https://blog.kakaocdn.net/dn/0mySg/btqCUccOGVk/nQ68nZiNKoIEGNJkooELF1/img.jpg', '둔부', 'OBJ', 0, datetime('now', 'localtime'), NULL),
                // INSERT INTO T_HISTORY (HISTORY_SEQ, EVENT_TYPE, EVENT_IMAGE, EVENT_CODE, EVENT_OBJ, EVENT_VERIFY, REG_DATE, EVENT_SCORE) VALUES(2, 0, 'https://blog.kakaocdn.net/dn/0mySg/btqCUccOGVk/nQ68nZiNKoIEGNJkooELF1/img.jpg', '둔부', 'OBJ', 0, datetime('now', 'localtime'), NULL),
                // INSERT INTO T_HISTORY (HISTORY_SEQ, EVENT_TYPE, EVENT_IMAGE, EVENT_CODE, EVENT_OBJ, EVENT_VERIFY, REG_DATE, EVENT_SCORE) VALUES(3, 0, 'https://blog.kakaocdn.net/dn/0mySg/btqCUccOGVk/nQ68nZiNKoIEGNJkooELF1/img.jpg', '둔부', 'OBJ', 0, datetime('now', 'localtime'), NULL),
                // INSERT INTO T_HISTORY (HISTORY_SEQ, EVENT_TYPE, EVENT_IMAGE, EVENT_CODE, EVENT_OBJ, EVENT_VERIFY, REG_DATE, EVENT_SCORE) VALUES(4, 0, 'https://blog.kakaocdn.net/dn/0mySg/btqCUccOGVk/nQ68nZiNKoIEGNJkooELF1/img.jpg', '둔부', 'OBJ', 0, datetime('now', 'localtime'), NULL),
                // INSERT INTO T_HISTORY (HISTORY_SEQ, EVENT_TYPE, EVENT_IMAGE, EVENT_CODE, EVENT_OBJ, EVENT_VERIFY, REG_DATE, EVENT_SCORE) VALUES(5, 0, 'https://blog.kakaocdn.net/dn/0mySg/btqCUccOGVk/nQ68nZiNKoIEGNJkooELF1/img.jpg', '둔부', 'OBJ', 0, datetime('now', 'localtime'), NULL),
                // INSERT INTO T_HISTORY (HISTORY_SEQ, EVENT_TYPE, EVENT_IMAGE, EVENT_CODE, EVENT_OBJ, EVENT_VERIFY, REG_DATE, EVENT_SCORE) VALUES(6, 0, 'https://blog.kakaocdn.net/dn/0mySg/btqCUccOGVk/nQ68nZiNKoIEGNJkooELF1/img.jpg', '둔부', 'OBJ', 0, datetime('now', 'localtime'), NULL),
                // INSERT INTO T_HISTORY (HISTORY_SEQ, EVENT_TYPE, EVENT_IMAGE, EVENT_CODE, EVENT_OBJ, EVENT_VERIFY, REG_DATE, EVENT_SCORE) VALUES(7, 0, 'https://blog.kakaocdn.net/dn/0mySg/btqCUccOGVk/nQ68nZiNKoIEGNJkooELF1/img.jpg', '둔부', 'OBJ', 0, datetime('now', 'localtime'), NULL)
                // `);
            } catch (e) {
                log.info(e.message)
            }


            log.info('테이블 T_HISTORY가 생성되었습니다.')
        }
    } catch (e) {
        log.error(e);
    }
}


// Handle the IPC request from renderer process
// ipcMain.handle('fetch-data-from-db', async (event, search, page) => {
//     try {
//         const pageSize = 20; // Number of items per page
//         const offset = (page - 1) * pageSize;
//         const query = `
//             SELECT * FROM T_HISTORY
//             WHERE EVENT_CODE LIKE ?
//             LIMIT ? OFFSET ?
//         `;
//         const results = await db.prepare(query, [`%${search}%`, pageSize, offset]).all();
//         console.log(results)
//         // Ensure the data is serializable
//         return results
//     } catch (error) {
//         console.error('Error fetching data from database:', error);
//         throw error; // Propagate the error
//     }
// });


ipcMain.handle('fetch-data-from-db', async (event, search, page) => {
    return new Promise((resolve, reject) => {
        const pageSize = 10 // Number of items per page
        const offset = (page - 1) * pageSize;
        const query = `
            SELECT * FROM T_HISTORY 
            WHERE EVENT_CODE LIKE ? 
            LIMIT ? OFFSET ?
        `;

        try {
            // Note: `db.prepare().all()` is used here for `better-sqlite3`
            const results = db.prepare(query).all([`%${search}%`, pageSize, offset]);
            resolve(results);
        } catch (err) {
            reject(err);
        }
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
            webSecurity: false,
        },
        // This is important for accessing file URLs
        autoHideMenuBar: true,
        icon: path.join(__dirname, '/meer.png')
    });


    // mainWindow.webContents.openDevTools()

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
            mainWindow.webContents.send('storage', 'loginStatus');
            mainWindow.webContents.send('navigate', '/pin/check');
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
            console.log('Sending message to server:', 'openenenenenenenen!!');
            client.write('openenenenenenenen!!')
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

    dbConnection()

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
                mainWindow.webContents.send('storage', 'loginStatus');
                mainWindow.webContents.send('navigate', '/pin/check');
                toggleWindow();
            }
        },
        {
            label: '환결성정', click: () => {
                mainWindow.webContents.send('storage', 'loginStatus');
                mainWindow.webContents.send('navigate', '/pin/check');
                toggleWindow();
            }
        },
        {
            label: '계정정보', click: () => {
                mainWindow.webContents.send('storage', 'loginStatus');
                mainWindow.webContents.send('navigate', '/pin/check');
                toggleWindow();
            }
        },
        {
            label: '종료', click: () => {
                mainWindow.webContents.send('storage', 'loginStatus');
                mainWindow.webContents.send('navigate', '/pin/check');
                client.end();
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
const { exec } = require('child_process');
const os = require('os');
ipcMain.handle('open-image', async (event, imagePath) => {
    try {
        await shell.openPath(imagePath)
    } catch (error) {
        console.error('Error opening image:', error);
    }
});

ipcMain.handle('get-images-from-folder', async () => {
    const folderPath = 'D:/images'; // External drive path

    try {
        const files = await readdir(folderPath);
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));
        return imageFiles.map(file => `file://${path.join(folderPath, file)}`);
    } catch (error) {
        console.error('Error reading folder:', error);
        return [];
    }
});


// 앱이 준비상태가 되었을때
app.on('ready', async () => {
    //startServiceLogic()
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
        await messaging.subscribeToTopic(store.get('fcm_token'), "allusers");
    });
    console.log(store.get('fcm_token'))
    createPipeClient();
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
