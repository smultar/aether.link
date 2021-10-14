// Electron
import electron from 'electron';

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Package from '../../package.json'

// Components
import Controls from '../comp/controls';

function Page() {

  //const ipcRenderer = electron.ipcRenderer;

  // Render Vs Main
  const ipc = electron.ipcRenderer || false ;
  
  if (ipc) {

    return (
      <div id="page">
        <Controls ipc={'close-update'}></Controls>
        <div id="updater">
          <img src="/svg/ttmp-white.svg" draggable={false}></img>
          <p className="up-title">TTMP TWEAKER</p>
          <p className="up-sub">CHECKING FOR UPDATES</p>
          <p className="version">{Package.version}</p>
        </div>
          <div className="win-btm"></div>
      </div>
    );


  } else {

    return (
      <div id="page">
        <Controls close={'electron.ipcRenderer.invok'}></Controls>
        <div id="updater">
          <p>loading</p>
        </div>
      </div>
    );

  }

};


export default Page;
