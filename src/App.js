import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import './styles/index.scss';

//const electron = window.require('electron');

function App() {

  const [status, setStatus] = useState('synchronizing');
  const [stage, setStage] = useState(0);
  const [download, setDownload] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [count, setCount] = useState(30);
  const [error, setError] = useState(false);

  const ipc = window.electron.update;
  
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

  useEffect(() => {
    ipc.on('check-update', (event, argument) => {
      console.log('Checking for updates.')
      setStatus(argument.status); setStage(20); setError(false);
    });
  
    ipc.on('update-available', (event, argument) => {
      console.log('Update found, preparing download.')
      setStatus(argument.status); setStage(0); setError(false);
    });
  
    ipc.on('update-progress', (event, argument) => {
      console.log('Downloading Update');
      setDownload(true); setError(false);
      setStatus(argument.status); setStage(argument.progress);
    });
    
    ipc.on('update-downloaded', (event, argument) => {
      setStatus('Update Download, preparing install.'); setStage(100); setError(false);
      ipc.invoke('install-update');
    });
    
    ipc.on('update-unavailable', (event, argument) => {
      console.log('No updates found, loading main.')
      setStatus(argument.status); setStage(100);
    });

    ipc.on('update-ready', (event, argument) => {
      console.log('Installing Update.'); ipc.invoke('install-update');
      setStatus(argument.status); setStage(100);
    });
  
    ipc.on('update-error', (event, argument) => {
      console.log('Unable to download object, an error occurred. Maybe bad internet?')
      setStatus('Error, retry in 30s'); setStage(0);
      setError(true);
    });
  }, [])


  return (
    <div id="page">
      <div id="controls">
        <div id="minimize" onClick={() => {ipc.invoke(`mini-update`) }}>
            <img src='svg/minimize.svg'></img>
        </div>
        <div id="close" onClick={() => { ipc.invoke(`close-update`) }}>
            <img src='svg/close.svg'></img>
        </div>
      </div>
      <div id="updater">
        <img src="svg/logo-white.svg" draggable={false}></img>
        <p className="up-title">AETHER LINK</p>
        <p className="up-sub">{status}</p>
        <p className="version">{(attempts >= 1) ? attempts : '0.1.3' }</p>
      </div>
      <div className="win-btm" style={{width: `${stage}%`}} ></div>
    </div>
  );
}

export default App;
