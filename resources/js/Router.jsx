import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'wouter';
import Welcome from './Pages/Welcome';
import Stage from './Pages/Stage';
import Project from './Pages/Project';
import Event from './Pages/Event';
import Writing from './Pages/Writing';
import CV from './Pages/CV';
import NotFound from './Pages/NotFound';

export default function Router() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const boot = document.getElementById('boot-screen');
        if (!boot) return;
        const fill = document.getElementById('boot-loading-fill');
        const status = document.getElementById('boot-status');
        const path = window.location.pathname;
        const isRoot = path === '/';
        const isStage = /^\/stage\/\d+\/?$/.test(path);
        const isDetail = /^\/(work|programs|writing)\/.+/.test(path);
        const fromDetail = /\/(work|programs|writing)\//.test(document.referrer);

        const killBoot = (fast) => {
            if (boot.dataset.bootDone) return;
            boot.dataset.bootDone = '1';
            if (fast) { boot.remove(); return; }
            boot.classList.add('boot-fade');
            setTimeout(() => boot.remove(), 450);
        };

        const finishBoot = () => {
            if (status) status.textContent = '▶ READY';
            killBoot(false);
        };

        if (isRoot) {
            requestAnimationFrame(() => {
                setTimeout(() => { if (fill) fill.style.width = '100%'; }, 250);
            });
            const logo = boot.querySelector('img');
            const loaded = () => !logo || (logo.complete && logo.naturalWidth > 0);
            const timer = setTimeout(() => {
                const poll = setInterval(() => {
                    if (loaded()) { clearInterval(poll); finishBoot(); }
                }, 120);
                setTimeout(() => { clearInterval(poll); finishBoot(); }, 4200);
            }, 2300);
            return () => clearTimeout(timer);
        }

        if (isStage && !fromDetail) {
            requestAnimationFrame(() => {
                setTimeout(() => { if (fill) fill.style.width = '100%'; }, 150);
            });
            const timer = setTimeout(() => finishBoot(), 2300);
            return () => clearTimeout(timer);
        }

        killBoot(true);
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setReady(true), 50);
        return () => clearTimeout(t);
    }, []);

    if (!ready) return null;

    return (
        <Switch>
            <Route path="/">
                <Welcome />
            </Route>
            <Route path="/stage/:stageNumber">
                {(params) => <Stage stageNumber={parseInt(params.stageNumber)} />}
            </Route>
            <Route path="/work/:slug">
                {(params) => <Project slug={params.slug} />}
            </Route>
            <Route path="/programs/:slug">
                {(params) => <Event slug={params.slug} />}
            </Route>
            <Route path="/writing/:slug">
                {(params) => <Writing slug={params.slug} />}
            </Route>
            <Route path="/cv">
                <CV />
            </Route>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    );
}