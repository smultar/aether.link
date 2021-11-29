// Preload action based function, internally for security reasons
const { contextBridge, ipcRenderer } = require('electron');

// After
const { BrowserWindow } = require('@electron/remote');
const { dialog, shell } = require('@electron/remote');

const fs = require('fs');
const ADM = require('adm-zip');
const archiver = require('archiver');

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
      const file = await dialog.showSaveDialog({properties: ['showOverwriteConfirmation', 'createDirectory'], filters: [{ name: 'TTMP', extensions: ['ttmp2'] }]}, (filePaths) => {});

      if (file) return file.filePath;

    },
  },

  internal: {
    unpack: (data) => {
      
      const zip = new ADM(data);
      const files = zip.getEntries();

      let decompressedData = zip.readAsText(files[0]);

      if (data.endsWith('.ttmp2')) {
        // Standard TTMP2
        return decompressedData;

      } else if (data.endsWith('.ttmp1') || data.endsWith('.ttmp')) {
        // Partial Compatibility Support

        // Convert to TTMP2
        console.log(decompressedData);
        let correctedData = decompressedData.replace(/[}](?=}*[^/}])/g, "},");

        let damagedArray = correctedData.split("},"); 


          let repairedData = damagedArray.map((item, index) => { 

            if (index === damagedArray.length - 1) return;

            let correctedItem = item.concat('}');
            return JSON.parse(correctedItem);

          });

          repairedData.pop(); // Removed Last Item

          
          // Add missing data
          let formatData = {
            Author: `null`,
            Description: `null`,
            MinimumFrameworkVersion: "1.3.0.0",
            ModPackPages: null,
            Name: `null`,
            SimpleModsList: repairedData,
            TTMPVersion: "1.3s",
            Url: "",
            Version: "1.0.0",
          }

          formatData.Unstable = true;
  
          return JSON.stringify(formatData);
          

        
      }




    },

    preview: (data) => {
      const zip = new ADM(data);
      const files = zip.getEntries();
      var decompressedData = zip.readAsText(files[0]);

      return JSON.parse(decompressedData);
    },

    export: (origin, file, data) => {
      console.log('Starting export process');
      
      const output = fs.createWriteStream(file);
      const archive = archiver('zip', { store: true, zlib: { level: 0 }});

      archive.pipe(output);

      console.log('Loading original file');
      const originZIP = new ADM(origin); 
      const originFiles = originZIP.getEntries();
      const originDecompressedData = originZIP.readFile(originFiles[1]);

      console.log(data)

      archive.append(JSON.stringify(data) , { name: 'TTMPL.mpl' })
      archive.append(originDecompressedData, { name: 'TTMPL.mpd' })

      console.log('Writing Memory File');
      archive.finalize();
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