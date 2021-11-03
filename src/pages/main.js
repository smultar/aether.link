import React, { useState, useEffect } from 'react';
import { BrowserRouter, HashRouter, Switch, Route, Link } from "react-router-dom";


// Global
import config from '../config.json';

// Component
import Title from '../comp/window/title';
import Dock from '../comp/dock/index';
import DockRender from '../comp/window/main';



const Page = () => {

    const [file, setFile] = useState();

    // Render
    return (
        <div id="main">
            <Title config={config} window={window} />
            <div className='main'>
                <Dock config={config} window={window} />
                <DockRender config={config} window={window} ></DockRender>
            </div>
        </div>
      );

}

export default Page;