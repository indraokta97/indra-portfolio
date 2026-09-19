const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const COUNTER_KEY = 'portfolio:visitors';

async function redis(cmd, ...args) {
    const res = await fetch(`${UPSTASH_URL}/${cmd}/${args.join('/')}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    const data = await res.json();
    return data.result;
}

export default async function handler(req, res) {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
        return res.status(500).json({ error: 'UPSTASH env vars not set' });
    }

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    try {
        if (req.method === 'GET') {
            const count = await redis('get', COUNTER_KEY);
            return res.status(200).json({ count: Math.max(0, parseInt(count || '0', 10)) });
        }

        if (req.method === 'POST') {
            let decrement = false;

            const ct = req.headers['content-type'] || '';

            if (ct.includes('application/json')) {
                decrement = req.body?.decrement === true || req.body?.decrement === 'true';
            } else if (ct.includes('multipart/form-data')) {
                const chunks = [];
                for await (const chunk of req) chunks.push(chunk);
                const body = Buffer.concat(chunks).toString();
                const m = body.match(/decrement.*?(true|1)/i);
                decrement = !!m;
            } else if (ct.includes('application/x-www-form-urlencoded')) {
                const chunks = [];
                for await (const chunk of req) chunks.push(chunk);
                const body = Buffer.concat(chunks).toString();
                decrement = body.includes('decrement=true') || body.includes('decrement=1');
            }

            let count;
            if (decrement) {
                count = await redis('decr', COUNTER_KEY);
                if (parseInt(count, 10) < 0) {
                    await redis('set', COUNTER_KEY, '0');
                    count = '0';
                }
            } else {
                count = await redis('incr', COUNTER_KEY);
            }
            return res.status(200).json({ count: parseInt(count, 10) });
        }

        res.setHeader('Allow', 'GET, POST');
        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        return res.status(500).json({ error: 'Redis operation failed: ' + err.message });
    }
}
