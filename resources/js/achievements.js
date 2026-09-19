/* ═══════════════════════════════════════════════════════════════════
   ACHIEVEMENT ENGINE — toast + SFX + confetti, unlocked once via localStorage
   ═══════════════════════════════════════════════════════════════════ */

(function () {
    if (window.__achievementInit) return;
    window.__achievementInit = true;

    const KEY = 'indra-achievements';

    const ACHIEVEMENTS = {
        'stage-1': { icon: '⚡', name: 'STAGE 1 UNLOCKED!', desc: 'Enter the world of Code.' },
        'stage-2': { icon: '⚔', name: 'STAGE 2 UNLOCKED!', desc: 'Suit up for Events.' },
        'stage-3': { icon: '✎', name: 'STAGE 3 UNLOCKED!', desc: 'Sharpen your Words.' },
    };

    function getUnlocked() {
        try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
    }

    function saveUnlocked(map) {
        try { localStorage.setItem(KEY, JSON.stringify(map)); } catch (e) {}
    }

    window.isAchievementUnlocked = function (id) {
        return !!getUnlocked()[id];
    };

    window.unlockAchievement = function (id) {
        const def = ACHIEVEMENTS[id];
        if (!def) return false;
        const unlocked = getUnlocked();
        if (unlocked[id]) return false;
        unlocked[id] = 1;
        saveUnlocked(unlocked);

        if (window.SFX && window.SFX.achievement) window.SFX.achievement();
        spawnToast(def.icon, def.name, def.desc);
        spawnConfetti();
        return true;
    };

    function spawnToast(icon, name, desc) {
        const prev = document.getElementById('achievement-toast');
        if (prev) prev.remove();

        const toast = document.createElement('div');
        toast.id = 'achievement-toast';
        toast.className = 'achievement-toast';
        toast.setAttribute('role', 'status');
        toast.innerHTML =
            '<div class="ach-header"><span class="ach-icon">' + icon + '</span>ACHIEVEMENT UNLOCKED</div>' +
            '<div class="ach-name">' + name + '</div>' +
            '<div class="ach-desc">' + desc + '</div>';
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 450);
        }, 3400);
    }

    function spawnConfetti() {
        const COLORS = ['#FFD51A', '#F05A6E', '#36CFDD', '#73DC57', '#FFFFFF', '#027AE9'];
        for (let i = 0; i < 18; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = (Math.random() * 100) + 'vw';
            piece.style.background = COLORS[(Math.random() * COLORS.length) | 0];
            piece.style.animationDuration = (2 + Math.random() * 2) + 's';
            piece.style.animationDelay = (Math.random() * 0.5) + 's';
            piece.style.width = (5 + Math.random() * 5) + 'px';
            piece.style.height = piece.style.width;
            document.body.appendChild(piece);
            setTimeout(() => piece.remove(), 5000);
        }
    }
})();