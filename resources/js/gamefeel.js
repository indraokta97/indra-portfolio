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
})();
