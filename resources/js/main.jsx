import React from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from 'wouter';
import AppRouter from './Router';
import '../css/app.css';
import './app.js';
import './gamefeel.js';
import './achievements.js';

window.addEventListener('contextmenu', (e) => e.preventDefault());

window.addEventListener('keydown', (e) => {
    if (
        e.key === 'F12' ||
        e.key === 'F11' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's'))
    ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
});

const fontsCss = document.getElementById('fonts-css');
if (fontsCss) fontsCss.media = 'all';

const root = createRoot(document.getElementById('app'));
root.render(
    React.createElement(Router, {},
        React.createElement(AppRouter)
    )
);