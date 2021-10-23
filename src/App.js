import { BrowserRouter, HashRouter, Switch, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';

// Global
import config from './config';

// Pages
import Update from "./pages/update";
import Main from "./pages/main";

const Handle = () => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Update}/>
          <Route exact path='/main' component={Main}/>
        </Switch>
      </BrowserRouter>
    )
  } else {
    return (
      <HashRouter>
        <Switch>
          <Route exact path='/' component={Update}/>
          <Route exact path='/main' component={Main}/>
        </Switch>
      </HashRouter>
    )
  }
};

export default Handle;
