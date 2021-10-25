// Preload action based function, internally for security reasons
const { contextBridge, ipcRenderer } = require('electron');

// After
const { BrowserWindow } = require('@electron/remote');


contextBridge.exposeInMainWorld('link', {
  api: {
    on(channel, func) {
      ipcRenderer.on(channel, (event, argument) => func(event, argument));
    },
    invoke(data) {
      ipcRenderer.invoke(data);
    },
  },

  action: {
    minimize: () => {
      BrowserWindow.getFocusedWindow().minimize();
    },
    maximize: () =>{
      BrowserWindow.getFocusedWindow().maximize();
    },
    close: () => {
      BrowserWindow.getFocusedWindow().close();
    },
  }
});