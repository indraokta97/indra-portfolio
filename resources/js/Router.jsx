import React, { useState, useEffect } from 'react';
import { Route } from 'wouter';
import Welcome from './Pages/Welcome';
import Stage from './Pages/Stage';
import Project from './Pages/Project';
import Event from './Pages/Event';
import Writing from './Pages/Writing';
import CV from './Pages/CV';

export default function Router() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setReady(true), 50);
        return () => clearTimeout(timer);
    }, []);

    if (!ready) return null;

    return (
        <>
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
        </>
    );
}