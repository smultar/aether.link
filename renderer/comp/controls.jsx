import React from 'react';
import electron, { ipcRenderer } from 'electron';

function Component({ ipc }) {
  return (
      <div id="controls">
        <a id="minimize" href="#" onClick={() => { ipcRenderer.invoke(ipc) }}>
            <img src='/svg/minimize.svg'></img>
        </a>
        <a id="close" href="#" onClick={() => { ipcRenderer.invoke(ipc) }}>
            <img src='/svg/close.svg'></img>
        </a>
    </div>
  );
};

export default Component;
