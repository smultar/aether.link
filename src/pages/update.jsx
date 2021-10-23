import React, { useState, useEffect } from 'react';

// SCSS
import '../styles/index.scss';

// Global
import config from '../config.json';

const Update = () => {
    
    // States
    const [status, setStatus] = useState('synchronizing');
    const [stage, setStage] = useState(0);
    const [download, setDownload] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [count, setCount] = useState(30);
    const [error, setError] = useState(false);
  
    // Loop checksums
    useEffect(() => {
        if (error) {
            const timer = setInterval(() => {
              setCount(count - 1); setStatus(`Error, retry in ${count}s`);
              setStage(stage + 3.33);
            }, 1000);
      
            return () => clearInterval(timer);
          }
    });

    // Loop on countdown expiration
    useEffect(() => {
        if (error) {
          if (count <= 0) {
            setError(false); setAttempts( attempts + 1); setStatus(`Attempt #${attempts}s`); setCount(30);
            window.link.api.invoke('check-update');
          }
        }
      });

    // Update Events
    useEffect(() => {
        window.link.api.on('check-update', (event, argument) => {
          console.log('Checking for updates.')
          setStatus(argument.status); setStage(20); setError(false);
        });
      
        window.link.api.on('update-available', (event, argument) => {
          console.log('Update found, preparing download.')
          setStatus(argument.status); setStage(0); setError(false);
        });
      
        window.link.api.on('update-progress', (event, argument) => {
          console.log('Downloading Update');
          setDownload(true); setError(false);
          setStatus(argument.status); setStage(argument.progress);
        });
        
        window.link.api.on('update-downloaded', (event, argument) => {
          setStatus('Update Download, preparing install.'); setStage(100); setError(false);
          window.link.api.invoke('install-update');
        });
        
        window.link.api.on('update-unavailable', (event, argument) => {
          console.log('No updates found, loading main.');
          setStatus(argument.status); setStage(100);
    
          setTimeout(() => {
            window.link.api.invoke('open-main');
            window.link.api.invoke('close-update');
          }, 1000);
        });
    
        window.link.api.on('update-ready', (event, argument) => {
          console.log('Installing Update.'); window.link.api.invoke('install-update');
          setStatus(argument.status); setStage(100);
        });
      
        window.link.api.on('update-error', (event, argument) => {
          console.log('Unable to download object, an error occurred. Maybe bad internet?')
          setStatus('Error, retry in 30s'); setStage(0);
          setError(true);
        });
      }, []);

    // Render
    return (
        <div id="page">
          <div id="controls">
            <div id="minimize" onClick={() => { window.link.action.minimize() }}>
                <img src='svg/minimize.svg'></img>
            </div>
            <div id="close" onClick={() => { window.link.action.close() }}>
                <img src='svg/close.svg'></img>
            </div>
          </div>
          <div id="updater">
            <img src="svg/logo-white.svg" draggable={false}></img>
            <p className="up-title">{config.name.display}</p>
            <p className="up-sub">{status}</p>
            <p className="version">{(attempts >= 1) ? attempts : config.version }</p>
          </div>
          <div className="win-btm" style={{width: `${stage}%`}} ></div>
        </div>
      );

}

export default Update;