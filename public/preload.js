// Preload action based function, internally for security reasons
const { contextBridge, ipcRenderer, remote } = require('electron');

contextBridge.exposeInMainWorld('link', {
  api: {
    on(channel, func) {
      ipcRenderer.on(channel, (event, argument) => func(event, argument));
    },
    invoke(data) {
      ipcRenderer.invoke(data);
    },
  },

  actions: {
    minimize() {
      remote.BrowserWindow.getFocusedWindow().minimize();
    },
    maximize() {
      remote.BrowserWindow.getFocusedWindow().maximize();
    },
    close() {
      remote.BrowserWindow.getFocusedWindow().close();
    },
  }
});