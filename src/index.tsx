import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { DAppProvider } from '@usedapp/core';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { DAPP_CONFIG } from './config/dapp';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Router>
    <DAppProvider config={DAPP_CONFIG}>
      <App />
    </DAppProvider>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
