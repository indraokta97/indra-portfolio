const ALLOWED = new Set(['masjidkampus.ugm.ac.id', 'js.ugm.ac.id']);
const MAX_REDIRECTS = 4;

const PROXY_CSP =
    "default-src 'self' https://masjidkampus.ugm.ac.id https://js.ugm.ac.id; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://ajax.googleapis.com https://masjidkampus.ugm.ac.id https://js.ugm.ac.id https://www.googletagmanager.com https://www.google-analytics.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://masjidkampus.ugm.ac.id https://js.ugm.ac.id; " +
    "font-src 'self' data: https://fonts.gstatic.com https://masjidkampus.ugm.ac.id https://js.ugm.ac.id; " +
    "img-src 'self' data: https://secure.gravatar.com https://masjidkampus.ugm.ac.id https://js.ugm.ac.id; " +
    "media-src 'self' blob: https://masjidkampus.ugm.ac.id https://js.ugm.ac.id; " +
    "connect-src 'self' https://masjidkampus.ugm.ac.id https://js.ugm.ac.id https://www.google-analytics.com https://www.googletagmanager.com; " +
    "object-src 'none'; " +
    "base-uri 'self' https://masjidkampus.ugm.ac.id https://js.ugm.ac.id; " +
    "form-action 'self' https://masjidkampus.ugm.ac.id https://js.ugm.ac.id; " +
    "frame-ancestors 'self'";

function isAllowed(raw) {
    let p;
    try {
        p = new URL(raw);
    } catch {
        return false;
    }
    return (p.protocol === 'https:' || p.protocol === 'http:') && ALLOWED.has(p.hostname);
}

export default async function handler(req, res) {
    const target = req.query.url;
    if (!target || typeof target !== 'string') {
        res.status(400).send('Missing ?url= parameter');
        return;
    }

    if (!isAllowed(target)) {
        res.status(403).send('Domain not allowed');
        return;
    }

    let current = target;
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
        let r;
        try {
            r = await fetch(current, {
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'accept-language': 'en,id;q=0.9',
                },
                redirect: 'manual',
                signal: AbortSignal.timeout(12000),
            });
        } catch (err) {
            res.status(502).send('Failed to load the page. The origin server may be unreachable — use the OPEN button to visit it directly.');
            return;
        }

        if (r.status >= 300 && r.status < 400) {
            const loc = r.headers.get('location');
            if (!loc) {
                res.status(502).send('Redirect without a target location.');
                return;
            }
            const next = new URL(loc, current).toString();
            if (!isAllowed(next)) {
                res.status(403).send('Domain not allowed');
                return;
            }
            current = next;
            continue;
        }

        let body = await r.text();
        const isHtml = (r.headers.get('content-type') || '').toLowerCase().includes('html');

        if (isHtml) {
            const esc = new URL(current).host.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            body = body.replace(new RegExp('https?:\\/\\/' + esc, 'g'), 'https://' + new URL(current).host);
            if (/<head/i.test(body)) {
                body = body.replace(/<head([^>]*)>/i, `<head$1><base href="https://${new URL(current).host}/" />`);
            }
        }

        res.status(r.status);
        res.setHeader('Content-Type', isHtml ? 'text/html; charset=utf-8' : (r.headers.get('content-type') || 'text/html; charset=utf-8'));
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('X-Robots-Tag', 'noindex');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        if (isHtml) {
            res.setHeader('Content-Security-Policy', PROXY_CSP);
        }
        res.send(isHtml ? body : JSON.stringify({ ok: true }));
        return;
    }

    res.status(502).send('Too many redirects.');
}