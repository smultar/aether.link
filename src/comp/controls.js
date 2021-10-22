import React from 'react';
import electron, { ipcRenderer } from 'electron';

function Component({ page }) {
  return (
      <div id="controls">
        <div id="minimize" onClick={() => { console.log('click2'); ipcRenderer.invoke(`mini-${page}`) }}>
            <img src='svg/minimize.svg'></img>
        </div>
        <div id="close" onClick={() => { ipcRenderer.invoke(`close-${page}`) }}>
            <img src='svg/close.svg'></img>
        </div>
      </div>
  );
};

export default Component;
