// Electron
import electron from 'electron';

import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Package from '../../package.json'

// Components
import Controls from '../comp/controls';

function Page() {

  const [status, setStatus] = useState('checking for updates');

  // Render Vs Main
  const ipc = electron.ipcRenderer || false ;
  
  if (ipc) {




    return (
      <div id="page">
        <Controls page={'update'}></Controls>
        <div id="updater">
          <img src="/svg/logo-white.svg" draggable={false}></img>
          <p className="up-title">AETHER LINK</p>
          <p className="up-sub">{status}</p>
          <p className="version">{Package.version}</p>
        </div>
          <div className="win-btm"></div>
          <div className="win-btm"></div>
      </div>
    );


  } else {

    return (
      <div id="page">
        <Controls close={'electron.ipcRenderer.invok'}></Controls>
        <div id="updater">
        </div>
      </div>
    );

  }

};


export default Page;
