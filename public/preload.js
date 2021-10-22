const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  update: {
    on(channel, func) {
      ipcRenderer.on(channel, (event, argument) => func(event, argument));
    },
    invoke(data) {
      ipcRenderer.invoke(data);
    }
  }
});