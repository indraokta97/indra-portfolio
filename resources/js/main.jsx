import React from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from 'wouter';
import AppRouter from './Router';
import '../css/app.css';
import './app.js';
import './gamefeel.js';

const root = createRoot(document.getElementById('app'));
root.render(
    React.createElement(Router, {},
        React.createElement(AppRouter)
    )
);