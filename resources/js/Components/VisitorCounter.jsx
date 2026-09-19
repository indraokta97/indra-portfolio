import { useState, useEffect } from 'react';

export default function VisitorCounter() {
    const [count, setCount] = useState(null);

    useEffect(() => {
        const SEEN_KEY = 'indra-portfolio-seen';
        const isFirstVisit = !sessionStorage.getItem(SEEN_KEY);

        const fetchCount = (method, body) => {
            const opts = { method };
            if (body) {
                opts.body = body;
            }
            fetch('/api/counter?_=' + Date.now(), opts)
                .then(r => r.json())
                .then(d => {
                    if (d.count != null) {
                        setCount(d.count);
                        if (isFirstVisit) sessionStorage.setItem(SEEN_KEY, '1');
                    }
                })
                .catch(() => {});
        };

        fetchCount(isFirstVisit ? 'POST' : 'GET');

        const interval = setInterval(() => fetchCount('GET'), 30000);

        const handleLeave = () => {
            const blob = new Blob(['decrement=true'], { type: 'application/x-www-form-urlencoded' });
            navigator.sendBeacon('/api/counter', blob);
        };
        window.addEventListener('beforeunload', handleLeave);

        return () => {
            clearInterval(interval);
            window.removeEventListener('beforeunload', handleLeave);
        };
    }, []);

    if (count === null) return null;

    return (
        <div className="flex items-center justify-center gap-2 font-pixel text-[8px] text-[#3A4657] uppercase">
            <span>👁</span>
            <span>{count.toLocaleString()} visitors</span>
        </div>
    );
}
