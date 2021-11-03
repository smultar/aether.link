// Preload action based function, internally for security reasons
const { contextBridge, ipcRenderer } = require('electron');

// After
const { BrowserWindow } = require('@electron/remote');
const { dialog } = require('@electron/remote');

const ADM = require('adm-zip');

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
    fetchFile: async () => {
      const file = await dialog.showOpenDialog({properties: ['openFile'], filters: [{ name: 'TTMP', extensions: ['ttmp', 'ttmp2', 'ttmp1'] }]}, (filePaths) => {});

      if (!file.canceled) { 
          console.log(file);
          console.log(file.filePaths[0]);
          return file.filePaths[0];

      } else {
        
        return null;
      }

    },
  },

  internal: {
    unpack: (data) => {
      const zip = new ADM(data);
      const files = zip.getEntries();
      var decompressedData = zip.readAsText(files[0]);
      //console.log(decompressedData);
      return decompressedData;
    }
  },
  
  query: {
    getWindowSize: () => {
      return BrowserWindow.getFocusedWindow().getSize();
    },
    getWindowPosition: () => {
      return BrowserWindow.getFocusedWindow().getPosition();
    },
    getWindowState: () => {
      return BrowserWindow.getFocusedWindow().isMaximized();
    },
    getWindowTitle: () => { 
      return BrowserWindow.getFocusedWindow().getTitle();
    },  
    getWindowId: () => {  // getWindowId
      return BrowserWindow.getFocusedWindow().id;
    },
    getWindowUrl: () => {  
      return BrowserWindow.getFocusedWindow().getURL();
    },
  }
});