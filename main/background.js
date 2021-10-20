import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import { autoUpdater } from 'electron-updater';

const isProd = process.env.NODE_ENV === 'production';
app.commandLine.appendSwitch("enable-transparent-visuals");
if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

process.setMaxListeners(15);

(async () => {
  await app.whenReady();

  if (isProd) {
    await update.loadURL('app://./index.html');
  } else {
    const port = process.argv[2];
    //
    //const main = createWindow('main', { width: 670, height: 480, transparent: true, blur: true, frame: false, resizable: false });
    //await main.loadURL(`http://localhost:${port}/`);
    
    
    
    /* #region - Auto Update */

      // Creates Window
      const update = createWindow('update', { width: 320, height: 480, transparent: true, blur: true, frame: false, resizable: false });

      // Loads Destination
      await update.loadURL(`http://localhost:${port}/`); update.setSize(320, 480); update.title = 'Aether Link - Updater';


      // ACTIONS
      
      ipcMain.handle('close-update', async (event) => {
        return update.close();
      });

      ipcMain.handle('mini-update', async (event) => {
        return update.minimize();
      });
      

      // Auto Update
      ipcMain.handle('check-update', async (event) => {
        autoUpdater.checkForUpdates();
      });

      autoUpdater.on('check-update', () => {
        autoUpdater.checkForUpdates();      
      });

      autoUpdater.on('error', (error) => {
        update.webContents.send('update-error', {status: 'error'});
      });

      autoUpdater.on('update-available', (updateInfo) => {
        update.webContents.send('update-available', {status: 'receiving update'});
        //logger.log('Update is available:', updateInfo);
      });

      autoUpdater.on('update-not-available', (updateInfo) => {
        update.webContents.send('update-unavailable', {status: 'no updates available'});
      });

      autoUpdater.on('download-progress', (progressInfo) => {
        update.webContents.send('update-progress', {status: 'downloading update', progress: progressInfo.percent });
      });

      autoUpdater.on('update-downloaded', (updateInfo) => {
        update.webContents.send('update-ready', {status: 'Installing', control: autoUpdater});
        // autoUpdater.quitAndInstall();
      });

      /* Check for updates manually */
      autoUpdater.checkForUpdates();

      /* Check updates every 60 minutes */
      setInterval(() => {
        autoUpdater.checkForUpdates();
      }, 60 * 60 * 1000);
  };

    /* #endregion */

})();

app.on('window-all-closed', () => {
  app.quit();
});
