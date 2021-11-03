import { BrowserRouter, HashRouter, Switch, Route, Link, useHistory } from "react-router-dom";

import React, { useState, useEffect } from 'react';

// Global
import config from './config';

// Pages
import Update from "./pages/update";
import Main from "./pages/main";
import Crash from "./pages/crash";

const Handle = () => {

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return (
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Update} history={useHistory}/>
            <Route exact path='/main' component={Main} history={useHistory}/>
            <Route exact path='/crash' component={Crash} history={useHistory}/>
          </Switch>
        </BrowserRouter>
    )
  } else {
    return (
        <HashRouter>
          <Switch>
            <Route exact path='/' component={Update} history={useHistory}/>
            <Route exact path='/main' component={Main} history={useHistory}/>
            <Route exact path='/crash' component={Crash} history={useHistory}/>
          </Switch>
        </HashRouter>
    )
  }
};

export default Handle;
