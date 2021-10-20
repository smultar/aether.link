// Electron
import electron from 'electron';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Package from '../../package.json'

// Components
import Controls from '../comp/controls';

function Page() {

  const [status, setStatus] = useState('checking for updates');
  const [stage, setStage] = useState(0);
  const [download, setDownload] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [count, setCount] = useState(30);
  const [error, setError] = useState(false);

  // Render Vs Main
  const ipc = electron.ipcRenderer || false ;

  
  if (ipc) {

    useEffect(() => {
      if (error) {
        const timer = setInterval(() => {
          setCount(count - 1);
          setStatus(`Error, retry in ${count}s`);
          setStage(stage + 3.33);
        }, 1000);

        return () => clearInterval(timer);

      }
    });

    useEffect(() => {
      if (error) {
        if (count <= 0) {
          setError(false); setAttempts( attempts + 1); setStatus(`Attempt #${attempts}s`); setCount(30);
          ipc.invoke('check-update');
        }

      }
    });

    ipc.on('check-update', (event, argument) => {
      setStatus(argument.status); setStage(20);
    });

    ipc.on('update-available', (event, argument) => {
      setStatus(argument.status); setStage(0);
    });

    ipc.on('update-progress', (event, argument) => {
      setStatus(argument.status); setStage(argument.progress);
    });
    
    ipc.on('update-downloaded', (event, argument) => {
      setStatus(argument.status); setStage(100);
      argument.control.quitAndInstall();
    });
    
    ipc.on('update-unavailable', (event, argument) => {
      setStatus(argument.status); setStage(100);
    });

    ipc.on('update-error', (event, argument) => {
      setStatus('Error, retry in 30s'); setStage(0);
      setError(true);
    });



    return (
      <div id="page">
        <Controls page={'update'}></Controls>
        <div id="updater">
          <img src="/svg/logo-white.svg" draggable={false}></img>
          <p className="up-title">AETHER LINK</p>
          <p className="up-sub">{status}</p>
          <p className="version">{(attempts >= 1) ? attempts : Package.version}</p>
        </div>
          <div className="win-btm" style={{width: `${stage}%`}} ></div>
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
