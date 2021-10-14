import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('update', { width: 320, height: 480, transparent: true, blur: true, frame: false, resizable: false });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`); mainWindow.setSize(320, 480)
    //mainWindow.webContents.openDevTools();

    ipcMain.handle('close-update', async (event) => {
      return mainWindow.close();
    })
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
