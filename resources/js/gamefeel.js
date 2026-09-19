/* ═══════════════════════════════════════════════════════════════════
   GAME-FEEL — hover sounds, click sounds, XP popups
   Lightweight global delegates that run alongside the React tree.
   ═══════════════════════════════════════════════════════════════════ */

(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.__gamefeelInit) return;
    window.__gamefeelInit = true;

    const SFX = () => (window.SFX || null);

    /* --- 1. HOVER SOUND on first visit per element --- */
    const HOVER_SELECTOR = 'a[href], button, [role="button"], .btn-pixel, .pixel-card, .nav-link, .stage-box, .badge-pixel';
    let hoverThrottle = false;
    document.addEventListener('mouseover', (e) => {
        const el = e.target.closest(HOVER_SELECTOR);
        if (!el || el.dataset.gfHovered) return;
        el.dataset.gfHovered = '1';
        if (hoverThrottle) return;
        const s = SFX(); if (!s) return;
        hoverThrottle = true;
        s.cursor();
        setTimeout(() => { hoverThrottle = false; }, 80);
    });
    document.addEventListener('mouseout', (e) => {
        const el = e.target.closest(HOVER_SELECTOR);
        if (el) el.dataset.gfHovered = '';
    });

    /* --- 2. CLICK SOUND + XP popups on .stage-box --- */
    document.addEventListener('click', (e) => {
        const s = SFX(); if (!s) return;

        const stageBox = e.target.closest('.stage-box');
        if (stageBox) {
            s.stageSelect();
            spawnXP(stageBox);
            if (window.rumble) window.rumble(25);
            return;
        }

        const submitBtn = e.target.closest('button[type="submit"]');
        if (submitBtn) { s.send(); return; }

        const copyBtn = e.target.closest('[data-copy]');
        if (copyBtn) { s.copy(); return; }

        const link = e.target.closest('a[href]');
        if (link) {
            const href = link.getAttribute('href') || '';
            if (link.target === '_blank' ||
                (/^https?:\/\//.test(href) && !href.includes(window.location.host))) {
                s.powerUp(); return;
            }
            if (href.startsWith('mailto:') || href.startsWith('tel:')) { s.copy(); return; }
            s.blip(); return;
        }

        const btn = e.target.closest('button');
        if (btn) s.blipHigh();
    });

    /* --- 3. XP POPUP on .stage-box hover --- */
    function spawnXP(box) {
        if (box.dataset.gfXpCooldown === '1') return;
        box.dataset.gfXpCooldown = '1';
        setTimeout(() => { delete box.dataset.gfXpCooldown; }, 350);

        const xp = document.createElement('span');
        xp.className = 'xp-popup';
        const msgs = ['+10 XP', '+25 XP', '+50 XP', '+100 XP', 'READY!', 'GO!', '▶ START'];
        xp.textContent = msgs[Math.floor(Math.random() * msgs.length)];
        xp.style.left = (15 + Math.random() * 70) + '%';
        xp.style.top = (10 + Math.random() * 30) + '%';
        if (getComputedStyle(box).position === 'static') {
            box.style.position = 'relative';
        }
        box.appendChild(xp);
        xp.addEventListener('animationend', () => xp.remove(), { once: true });
    }
    document.addEventListener('mouseover', (e) => {
        const box = e.target.closest('.stage-box');
        if (box) spawnXP(box);
    });

    /* --- 4. PIXEL CURSOR TRAIL --- */
    (function initCursorTrail() {
        const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (REDUCED) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'cursor-trail';
        canvas.setAttribute('aria-hidden', 'true');
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const COLORS = ['#FFD51A', '#F05A6E', '#36CFDD', '#FFFFFF'];
        let parts = [];
        let rafId = null;
        let running = false;
        let lastX = null;
        let lastY = null;
        const MAX = 140;

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function spawn(x, y) {
            const life = 26 + Math.random() * 24;
            const size = 2 + Math.random() * 3;
            parts.push({
                x, y,
                vx: (Math.random() - 0.5) * 1.7,
                vy: -0.5 - Math.random() * 1.3,
                size,
                life,
                maxLife: life,
                color: COLORS[(Math.random() * COLORS.length) | 0],
            });
            if (parts.length > MAX) parts.splice(0, parts.length - MAX);
        }

        function tick() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = parts.length - 1; i >= 0; i--) {
                const p = parts[i];
                p.life -= 1;
                if (p.life <= 0) { parts.splice(i, 1); continue; }
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.06;
                const a = Math.max(0, p.life / p.maxLife);
                const s = p.size * a + 1;
                ctx.globalAlpha = a;
                ctx.fillStyle = p.color;
                ctx.fillRect(Math.round(p.x - s / 2), Math.round(p.y - s / 2), Math.round(s), Math.round(s));
            }
            ctx.globalAlpha = 1;
            if (parts.length) {
                rafId = requestAnimationFrame(tick);
            } else {
                running = false;
                rafId = null;
            }
        }

        function onPointerMove(e) {
            if (e.pointerType === 'touch') return;
            const x = e.clientX;
            const y = e.clientY;
            const moved = lastX === null || Math.hypot(x - lastX, y - lastY) > 8;
            if (!moved) return;
            lastX = x;
            lastY = y;
            spawn(x, y + 5);
            spawn(x + 2, y + 6);
            if (!running) {
                running = true;
                rafId = requestAnimationFrame(tick);
            }
        }

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        document.addEventListener('mouseleave', () => { lastX = null; lastY = null; });
    })();

    /* --- 5. RETRO PIXEL CURSOR --- */
    (function initPixelCursor() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        const HOT = 'a, button, .stage-box, [role="button"], input, select, textarea, label, summary, [data-copy], .nav-link, .tech-item';
        const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const el = document.createElement('div');
        el.id = 'pixel-cursor';
        el.innerHTML = '<div id="pixel-cursor-sprite"></div>';
        el.classList.add('hide');
        document.body.appendChild(el);

        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        let tx = x;
        let ty = y;
        let raf = null;

        function place() {
            el.style.transform = 'translate3d(' + Math.round(x) + 'px,' + Math.round(y) + 'px,0)';
        }

        function loop() {
            x += (tx - x) * 0.4;
            y += (ty - y) * 0.4;
            if (Math.abs(tx - x) < 0.5 && Math.abs(ty - y) < 0.5) {
                x = tx; y = ty; raf = null; place(); return;
            }
            place();
            raf = requestAnimationFrame(loop);
        }

        function move(cx, cy) {
            tx = cx; ty = cy;
            el.classList.remove('hide');
            if (REDUCED) { x = tx; y = ty; place(); return; }
            if (!raf) raf = requestAnimationFrame(loop);
        }

        window.addEventListener('pointermove', (e) => {
            if (e.pointerType === 'touch') return;
            move(e.clientX, e.clientY);
        }, { passive: true });

        document.addEventListener('pointerover', (e) => {
            el.classList.toggle('go', !!(e.target && e.target.closest && e.target.closest(HOT)));
        });
        document.addEventListener('pointerout', (e) => {
            const rel = e.relatedTarget;
            if (!rel || !rel.closest || !rel.closest(HOT)) el.classList.remove('go');
        });

        window.addEventListener('pointerleave', () => el.classList.add('hide'));
        document.addEventListener('pointerenter', () => el.classList.remove('hide'));

        place();
    })();
})();
