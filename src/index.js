//librerías recomendadas con bootstrap para react
import "bootstrap/dist/css/bootstrap.min.css";
import $ from 'jquery';
import Popper from 'popper.js'
import "bootstrap/dist/js/bootstrap.bundle";
//PURO CSS RICO RICO RICO
import { MantineProvider } from '@mantine/core';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Router from './components/Router';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <Router />
  </MantineProvider>
);

reportWebVitals();
