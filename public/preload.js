// Preload action based function, internally for security reasons
const { contextBridge, ipcRenderer } = require('electron');

// After
const { BrowserWindow } = require('@electron/remote');
const { dialog, shell } = require('@electron/remote');

const ADM = require('adm-zip');

/**
 * Change the compression method of all entries
 * @param {AdmZip} zip
 * @param {number} method - Compression method 0 (STORED) or 8 (DEFLATED)
 * @returns {void}
 */

 function setGlobalMethod(zip, method) {
  var entries = zip.getEntries();

  console.log(entries);
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    entry.header.method = method;
    console.log(entry);
  }
}



contextBridge.exposeInMainWorld('link', {
  api: {
    on(channel, func) {
      ipcRenderer.on(channel, (event, argument) => func(event, argument));
    },
    invoke(data) {
      ipcRenderer.invoke(data);
    },
    openExternal(url) {
      shell.openExternal(url);
    }
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
    saveFile: async () => {
      const file = await dialog.showSaveDialog({properties: ['showOverwriteConfirmation', 'createDirectory'], filters: [{ name: 'TTMP', extensions: ['ttmp', 'ttmp2', 'ttmp1'] }]}, (filePaths) => {});

      if (file) return file.filePath;

    },
  },

  internal: {
    unpack: (data) => {
      const zip = new ADM(data);

      const files = zip.getEntries();

      var decompressedData = zip.readAsText(files[0]);
      console.log(decompressedData);
      console.log(JSON.parse(decompressedData));


      return decompressedData;
    },

    export: (origin, file, data) => {
      console.log('Starting export process');
      
      console.log('Loading original file');
      const originZIP = new ADM(origin); 
      const originFiles = originZIP.getEntries();
      const originDecompressedData = originZIP.readFile(originFiles[1]);
      
      console.log('Writing Memory File');
      const zip = new ADM(data); 
      //zip.addFile('TTMPL.mpl', Buffer.from(JSON.stringify(data), "utf8"));
      zip.addFile('TTMPL.mpl', Buffer.alloc(JSON.stringify(data).length, JSON.stringify(data))); var entry = zip.getEntry("TTMPL.mpl"); entry.header.method = 0;
      zip.addFile('TTMPL.mpd', Buffer(originDecompressedData));
      
      console.log('Exporting');
      ///setGlobalMethod(zip, 0);
      zip.writeZip(file);
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