// Module to control the application lifecycle and the native browser window.
const { app, BrowserWindow, protocol, ipcMain } = require("electron");
const Glasstron = require('glasstron');
const path = require("path");
const url = require("url");

const { autoUpdater } = require('electron-updater');

// Create the native browser window.
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // Set the path of an additional "preload" script that can be used to
    // communicate between node-land and browser-land.
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // In production, set the initial browser path to the local bundle generated
  // by the Create React App build process.
  // In development, set it to localhost to allow live/hot-reloading.
  const appURL = app.isPackaged ? url.format({ pathname: path.join(__dirname, "index.html"), protocol: "file:", slashes: true, }) : "http://localhost:3000";
  mainWindow.loadURL(appURL);

  // Automatically open Chrome's DevTools in development mode.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}

function updateWindow() {

    const updateWindow = new Glasstron.BrowserWindow({
        icon: './src/icons/icon.ico',
        blurType: 'blurbehind',
        width: 320, height: 480, transparent: true, blur: true, frame: false, resizable: false,

        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });
    
    updateWindow.title = 'Aether Link - Updater';

    const appURL = app.isPackaged ? url.format({ pathname: path.join(__dirname, "index.html"), protocol: "file:", slashes: true, }) : "http://localhost:3000";
    
    updateWindow.loadURL(appURL);


    if (!app.isPackaged) {
      //updateWindow.webContents.openDevTools();
    }

    // Auto Update
    ipcMain.handle('check-update', async (event) => {
      autoUpdater.checkForUpdates();
    });

    ipcMain.handle('install-update', async (event) => {
      autoUpdater.quitAndInstall();
    });

    autoUpdater.on('checking-for-update', () => {
        updateWindow.webContents.send('check-update', {status: 'checking for updates'});
    });

    autoUpdater.on('error', (error) => {
        updateWindow.webContents.send('update-error', {status: 'error', error: error });
    });

    autoUpdater.on('update-available', (updateInfo) => {
      updateWindow.webContents.send('update-available', {status: 'receiving update'});
    });

    autoUpdater.on('update-not-available', (updateInfo) => {
      updateWindow.webContents.send('update-unavailable', {status: 'no updates available'});

    });

    autoUpdater.on('download-progress', (progressInfo) => {
      updateWindow.webContents.send('update-progress', {status: 'downloading update', progress: progressInfo.percent });
    });

    autoUpdater.on('update-downloaded', (updateInfo) => {
      updateWindow.webContents.send('update-ready', {status: 'Installing'});
    });

    /* Check for updates manually */
    

    updateWindow.on('ready-to-show', () => {
      autoUpdater.checkForUpdates();
    });

    ipcMain.handle('close-update', async (event) => {
      return updateWindow.close();
    });

    ipcMain.handle('mini-update', async (event) => {
      return updateWindow.minimize();
    });
}

function mainWindow() {

    const mainWindow = new Glasstron.BrowserWindow({
        icon: './src/icons/icon.ico',
        blurType: 'blurbehind',
        width: 1150, height: 620, transparent: true, blur: true, frame: false, resizable: false,

        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });
    
    mainWindow.title = 'Aether Link';
    const appURL = app.isPackaged ? url.format({ pathname: path.join(__dirname, "index.html#main"), protocol: "file:", slashes: true, }) : "http://localhost:3000/main";
    mainWindow.loadURL(appURL);


    if (!app.isPackaged) {
      //mainWindow.webContents.openDevTools();
    }

    // Auto Update
    ipcMain.handle('check-update', async (event) => {
      autoUpdater.checkForUpdates();
    });

    ipcMain.handle('install-update', async (event) => {
      autoUpdater.quitAndInstall();
    });

    autoUpdater.on('checking-for-update', () => {
        mainWindow.webContents.send('check-update', {status: 'checking for updates'});
    });

    autoUpdater.on('error', (error) => {
        mainWindow.webContents.send('update-error', {status: 'error', error: error });
    });

    autoUpdater.on('update-available', (updateInfo) => {
      mainWindow.webContents.send('update-available', {status: 'receiving update'});
    });

    autoUpdater.on('update-not-available', (updateInfo) => {
      mainWindow.webContents.send('update-unavailable', {status: 'no updates available'});
    });

    autoUpdater.on('download-progress', (progressInfo) => {
      mainWindow.webContents.send('update-progress', {status: 'downloading update', progress: progressInfo.percent });
      console.log(progressInfo);
    });

    autoUpdater.on('update-downloaded', (updateInfo) => {
      console.log(updateInfo);
      mainWindow.webContents.send('update-ready', {status: 'Installing'});
    });

    /* Check for updates manually */
    

    mainWindow.on('ready-to-show', () => {
      autoUpdater.checkForUpdates();
    });

    ipcMain.handle('close-update', async (event) => {
      return mainWindow.close();
    });

    ipcMain.handle('mini-update', async (event) => {
      return mainWindow.minimize();
    });
    
}

/* Check updates every 60 minutes */
setInterval(() => {
    autoUpdater.checkForUpdates();
}, 60 * 60 * 1000);

// Auto Update
ipcMain.handle('open-main', async (event) => {
  mainWindow();
});

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    }
  );
}

// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  updateWindow(); setupLocalFilesNormalizerProxy();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }

  });
});

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
const allowedNavigationDestinations = "https://my-electron-app.com";
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
      event.preventDefault();
    }
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

