import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import { autoUpdater } from 'electron-updater';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

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
      await update.loadURL(`http://localhost:${port}/`); update.setSize(320, 480); update.title = 'TTMP - Updater';


      // ACTIONS
      
      ipcMain.handle('close-update', async (event) => {
        return update.close();
      });

      ipcMain.handle('mini-update', async (event) => {
        return update.minimize();
      });
      
      ipcMain.handle('mini-update', async (event) => {
        return update.minimize();
      });


      // Auto Update
      autoUpdater.on('checking-for-update', function () {
        
      });

      // render recieve 
      ipcRenderer.on('asynchronous-reply', (event, arg) => {
        console.log("Hiii",arg) // prints "Hiii pong"
      })

    /* #endregion */




  }


  

















})();

app.on('window-all-closed', () => {
  app.quit();
});
