//= Functions & Modules
// Core web
//import getScreenSize from "core_web/utils/getScreenSize";
// Packages
import { render } from 'react-dom';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

//= React components
// Own
import App from './App';

//window.g_screenSize = getScreenSize();

render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('main')
);
