/* ═══════════════════════════════════════════════════════════════════
   INDRA OKTA — AUDIO ENGINE
   Loaded globally so React components can call window.SFX.* and
   window.toggleSound() without re-creating the AudioContext per page.
   ═══════════════════════════════════════════════════════════════════ */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let audioCtx = null;
let soundEnabled = true;

function getAudioContext() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}

function playTone(freq, duration = 0.1, type = 'square', volume = 0.08) {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
}

function playSweep(startFreq, endFreq, duration = 0.2, type = 'square', volume = 0.08) {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
}

function playArpeggio(notes, noteDuration = 0.06, type = 'square', volume = 0.08) {
    if (!soundEnabled) return;
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, noteDuration, type, volume), i * noteDuration * 1000);
    });
}

const SFX = {
    blip: () => playTone(440, 0.05, 'square', 0.08),
    blipHigh: () => playTone(880, 0.05, 'square', 0.08),
    blipLow: () => playTone(220, 0.05, 'square', 0.08),
    coin: () => { playTone(988, 0.08, 'square', 0.1); setTimeout(() => playTone(1318, 0.12, 'square', 0.1), 80); },
    powerUp: () => playSweep(220, 880, 0.4, 'square', 0.1),
    powerDown: () => playSweep(880, 220, 0.3, 'square', 0.1),
    stageSelect: () => playArpeggio([523, 659, 784, 1047], 0.06, 'square', 0.08),
    jump: () => playSweep(330, 660, 0.12, 'square', 0.1),
    hit: () => playTone(110, 0.15, 'sawtooth', 0.1),
    stageEnter: () => playArpeggio([262, 330, 392, 523, 659, 784, 1047], 0.05, 'square', 0.09),
    copy: () => { playTone(784, 0.06, 'square', 0.1); setTimeout(() => playTone(1047, 0.08, 'square', 0.1), 60); },
    send: () => playArpeggio([523, 659, 784, 1047, 1318], 0.07, 'square', 0.1),
    cursor: () => playTone(660, 0.02, 'square', 0.04),
    menuOpen: () => playArpeggio([523, 659, 784], 0.05, 'square', 0.07),
    menuClose: () => playArpeggio([784, 659, 523], 0.05, 'square', 0.07),
    achievement: () => playArpeggio([523, 659, 784, 1047, 1318, 1568], 0.06, 'square', 0.1),
    bossAppear: () => {
        playTone(110, 0.3, 'sawtooth', 0.15);
        setTimeout(() => playTone(82, 0.3, 'sawtooth', 0.15), 100);
        setTimeout(() => playTone(65, 0.5, 'sawtooth', 0.15), 200);
    },
    bossDefeat: () => playArpeggio([392, 523, 659, 784, 1047, 1318, 1568], 0.08, 'square', 0.12),
    levelUp: () => playArpeggio([523, 659, 784, 1047], 0.1, 'square', 0.1),
    whoosh: () => playSweep(440, 880, 0.15, 'triangle', 0.06),
    error: () => playTone(80, 0.3, 'sawtooth', 0.12),
    boxBreak: () => {
        playTone(150, 0.1, 'sawtooth', 0.12);
        setTimeout(() => playTone(100, 0.15, 'square', 0.1), 50);
        setTimeout(() => playTone(60, 0.2, 'sawtooth', 0.08), 100);
    },
};

function updateSoundButton() {
    const btn = document.getElementById('sound-toggle');
    const text = soundEnabled ? '🔊 SOUND' : '🔇 MUTED';
    if (btn) btn.textContent = text;
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('sound-enabled', soundEnabled.toString());
    updateSoundButton();
    if (soundEnabled) SFX.blip();
}

function initSoundSystem() {
    const initAudio = () => {
        getAudioContext();
        document.removeEventListener('click', initAudio);
        document.removeEventListener('keydown', initAudio);
    };
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });

    const savedPref = localStorage.getItem('sound-enabled');
    if (savedPref !== null) {
        soundEnabled = savedPref === 'true';
    }
    updateSoundButton();
}

window.SFX = SFX;
window.toggleSound = toggleSound;
window.updateSoundButton = updateSoundButton;
window.initSoundSystem = initSoundSystem;
window.REDUCED = REDUCED;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSoundSystem);
} else {
    initSoundSystem();
}
