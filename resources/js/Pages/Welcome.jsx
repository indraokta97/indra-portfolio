import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'wouter';
import AppLayout from '../Layouts/AppLayout';
import VisitorCounter from '../Components/VisitorCounter';
import { site } from '../data/site';

export default function Welcome() {
    const p = site.profile;
    const projects = site.projects;
    const events = site.events;
    const writings = site.writings;

    const hobbyBlurb = "Outside of that, when I'm really, really bored, I usually draw, play PES (I'm actually pretty damn good at it), teach Quran recitation, or tutor if anyone needs a teacher (I'm available).";
    const hobbyChips = [
        ['✏️', 'Drawing'],
        ['⚽', 'PES'],
        ['🎓', 'Tutoring'],
    ];
    const hobbyPhotos = [
        { src: '/images/hobbies/draw1.jpeg', label: 'Drawing' },
        { src: '/images/hobbies/draw2.jpeg', label: 'Drawing' },
        { src: '/images/hobbies/draw3.jpeg', label: 'Drawing' },
        { src: '/images/hobbies/bigwin.png', label: 'PES — Big Win' },
        { src: '/images/hobbies/bigwin2.webp', label: 'PES — Big Win' },
    ];
    const [hobbyIndex, setHobbyIndex] = useState(0);
    const [viewIndex, setViewIndex] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const dragRef = useRef(null);
    const movedRef = useRef(false);
    const hobbyClicksRef = useRef(new Map());
    const lastHobbyClickRef = useRef(0);
    const HobbyDragThreshold = 60;
    const onHobbyStart = (e) => {
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        dragRef.current = { startX: x, offset: 0 };
        movedRef.current = false;
        setDragging(true);
    };
    const onHobbyMove = (e) => {
        if (!dragRef.current) return;
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const off = x - dragRef.current.startX;
        dragRef.current.offset = off;
        if (Math.abs(off) > 5) movedRef.current = true;
        setDragOffset(off);
    };
    const onHobbyEnd = () => {
        if (dragRef.current) {
            const off = dragRef.current.offset;
            if (off < -HobbyDragThreshold) {
                setHobbyIndex((i) => (i + 1) % hobbyPhotos.length);
            } else if (off > HobbyDragThreshold) {
                setHobbyIndex((i) => (i - 1 + hobbyPhotos.length) % hobbyPhotos.length);
            }
        }
        dragRef.current = null;
        setDragOffset(0);
        setDragging(false);
    };
    const onHobbyPhotoClick = () => {
        if (movedRef.current) return;
        const now = Date.now();
        const rapid = now - lastHobbyClickRef.current < 600;
        lastHobbyClickRef.current = now;
        const src = hobbyPhotos[hobbyIndex].src;
        if (rapid) {
            const n = (hobbyClicksRef.current.get(src) || 0) + 1;
            if (n >= 5) {
                hobbyClicksRef.current.set(src, 0);
                explodeHobbyPhoto('hobby-frame');
                return;
            }
            hobbyClicksRef.current.set(src, n);
            return;
        }
        hobbyClicksRef.current.set(src, 0);
        setViewIndex(hobbyIndex);
    };

    const onViewPhotoClick = () => {
        const src = hobbyPhotos[viewIndex].src;
        const n = (hobbyClicksRef.current.get(src) || 0) + 1;
        if (n >= 5) {
            hobbyClicksRef.current.set(src, 0);
            explodeHobbyPhoto('hobby-frame-view');
            return;
        }
        hobbyClicksRef.current.set(src, n);
    };

    const explodeHobbyPhoto = (frameId) => {
        if (window.SFX) {
            if (window.SFX.hit) window.SFX.hit();
            if (window.SFX.boxBreak) window.SFX.boxBreak();
        }
        if (window.rumble) window.rumble(70);
        ['portfolio-content', 'hobby-lightbox'].forEach((id) => {
            const el = document.getElementById(id);
            if (el && !el.classList.contains('screen-shake')) {
                el.classList.add('screen-shake');
                setTimeout(() => el.classList.remove('screen-shake'), 600);
            }
        });
        const frame = document.getElementById(frameId);
        if (!frame) return;
        const rect = frame.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const colors = ['#FFD51A', '#F05A6E', '#36CFDD', '#FFFFFF', '#73DC57'];
        for (let i = 0; i < 15; i++) {
            const pt = document.createElement('div');
            pt.className = 'hobby-burst';
            pt.style.left = cx + 'px';
            pt.style.top = cy + 'px';
            pt.style.background = colors[i % colors.length];
            pt.style.setProperty('--tx', (Math.random() * 170 - 85) + 'px');
            pt.style.setProperty('--ty', (Math.random() * 170 - 85) + 'px');
            pt.style.setProperty('--tr', (Math.random() * 540 - 270) + 'deg');
            frame.appendChild(pt);
        }
        const boom = document.createElement('div');
        boom.className = 'hobby-boom-label';
        boom.textContent = 'BOOM!';
        boom.style.setProperty('--bx', (Math.random() * 20 - 10) + 'px');
        frame.appendChild(boom);
        const photo = frame.querySelector('[data-hobby-photo]');
        if (photo) photo.classList.add('hobby-explode');
        setTimeout(() => {
            frame.querySelectorAll('.hobby-burst, .hobby-boom-label').forEach((n) => n.remove());
            if (photo) photo.classList.remove('hobby-explode');
        }, 1000);
    };

    useEffect(() => {
        if (viewIndex === null) return;
        const onKey = (e) => {
            if (e.key === 'Escape') {
                setViewIndex(null);
            } else if (e.key === 'ArrowRight') {
                setViewIndex((i) => (i + 1) % hobbyPhotos.length);
            } else if (e.key === 'ArrowLeft') {
                setViewIndex((i) => (i - 1 + hobbyPhotos.length) % hobbyPhotos.length);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewIndex === null]);

    useEffect(() => {
        const showLoadingScreen = (duration = 1400) => {
            let screen = document.getElementById('loading-screen');
            if (!screen) {
                screen = document.createElement('div');
                screen.id = 'loading-screen';
                screen.className = 'loading-screen';
                screen.innerHTML = `
                    <div class="loading-inner">
                        <video class="loading-logo" src="/images/cm.webm" alt="CM-Indra" autoPlay loop muted playsInline></video>
                        <div class="loading-right">
                            <div class="loading-title">INDRAOKTA97</div>
                            <div class="loading-bar">
                                <div class="loading-bar-fill" id="loading-bar-fill"></div>
                            </div>
                            <div class="loading-status" id="loading-status">▶ LOADING...</div>
                        </div>
                    </div>
                `;
                document.body.appendChild(screen);
            }
            const fill = document.getElementById('loading-bar-fill');
            fill.style.width = '0%';
            requestAnimationFrame(() => { fill.style.width = '100%'; });
            clearTimeout(screen._loadingT);
            screen._loadingT = setTimeout(() => {
                screen.classList.add('fade-out');
                setTimeout(() => { screen.classList.add('hidden'); }, 450);
            }, duration);
        };

        const welcome = document.getElementById('welcome');
        const portfolio = document.getElementById('portfolio-content');
        const enterBtn = document.getElementById('enter-portfolio');
        const backBtn = document.getElementById('back-to-welcome');
        const contactChar = document.getElementById('contact-character');

        if (contactChar) contactChar.classList.add('hidden');

        if (window.location.hash && window.location.hash !== '#welcome') {
            if (welcome) welcome.classList.add('hidden');
            if (portfolio) portfolio.classList.remove('hidden');
            const header = document.getElementById('site-header');
            if (header) header.classList.remove('hidden');
            if (contactChar) contactChar.classList.remove('hidden');
            setTimeout(() => {
                const target = document.querySelector(window.location.hash);
                if (target) target.scrollIntoView({ behavior: 'auto' });
            }, 100);
        }

        const handleEnter = () => {
            if (window.SFX && window.SFX.powerUp) window.SFX.powerUp();
            const header = document.getElementById('site-header');
            if (header) header.classList.remove('hidden');
            if (contactChar) contactChar.classList.remove('hidden');

            if (welcome && portfolio) {
                welcome.style.visibility = 'hidden';
                showLoadingScreen(1400);
                setTimeout(() => {
                    welcome.style.transition = 'opacity 0.3s ease-out';
                    welcome.style.opacity = '0';
                    setTimeout(() => {
                        welcome.classList.add('hidden');
                        welcome.style.opacity = '';
                        portfolio.classList.remove('hidden');
                        portfolio.style.opacity = '0';
                        portfolio.style.transition = 'opacity 0.4s ease-out';
                        window.scrollTo({ top: 0, behavior: 'auto' });
                        requestAnimationFrame(() => {
                            portfolio.style.opacity = '1';
                            setTimeout(() => {
                                portfolio.style.opacity = '';
                                portfolio.style.transition = '';
                            }, 400);
                        });
                    }, 300);
                }, 1400);
            }
        };

        if (enterBtn) {
            enterBtn.addEventListener('click', handleEnter);
        }

        const backToWelcome = () => {
            if (contactChar) contactChar.classList.add('hidden');
            if (welcome && portfolio) {
                portfolio.style.transition = 'opacity 0.3s ease-out';
                portfolio.style.opacity = '0';
                setTimeout(() => {
                    portfolio.classList.add('hidden');
                    portfolio.style.opacity = '';
                    welcome.classList.remove('hidden');
                    welcome.style.display = '';
                    welcome.style.opacity = '0';
                    welcome.style.transition = 'opacity 0.4s ease-out';
                    welcome.style.visibility = '';
                    window.scrollTo({ top: 0, behavior: 'auto' });
                    requestAnimationFrame(() => {
                        welcome.style.opacity = '1';
                        setTimeout(() => {
                            welcome.style.opacity = '';
                            welcome.style.transition = '';
                            const header = document.getElementById('site-header');
                            if (header) header.classList.add('hidden');
                        }, 400);
                    });
                }, 300);
            }
        };

        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.SFX && window.SFX.powerDown) window.SFX.powerDown();
                backToWelcome();
            });
        }

        const brandLink = document.getElementById('brand-link');
        if (brandLink) {
            brandLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.SFX && window.SFX.powerDown) window.SFX.powerDown();
                backToWelcome();
            });
        }

        const heroBackBtn = document.getElementById('back-to-welcome-hero');
        if (heroBackBtn) {
            heroBackBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.SFX && window.SFX.powerDown) window.SFX.powerDown();
                backToWelcome();
            });
        }

        const heroChar = document.getElementById('hero-char-wrap');
        if (heroChar) {
            heroChar.addEventListener('click', () => {
                if (window.SFX && window.SFX.jump) window.SFX.jump();
                heroChar.style.transform = 'translateY(-40px)';
                setTimeout(() => {
                    heroChar.style.transform = 'translateY(0)';
                }, 300);
                window.location.href = '/#welcome';
            });
        }

        const swapOnHover = (img, animate = false) => {
            if (!img || img.dataset.swapReady) return;
            const parent = img.parentElement;
            if (!parent) return;
            img.dataset.swapReady = '1';
            const hover = '/images/indra-peci.webp';
            const overlay = img.cloneNode(false);
            overlay.removeAttribute('id');
            overlay.removeAttribute('class');
            overlay.setAttribute('aria-hidden', 'true');
            overlay.className = 'w-full h-full object-contain' + (animate ? ' idle-blink idle-float' : '');
            Object.assign(overlay.style, {
                position: 'absolute',
                inset: '0',
                zIndex: '1',
                opacity: '0',
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none',
                imageRendering: 'pixelated',
            });
            overlay.src = hover;
            parent.appendChild(overlay);
            const enter = () => { overlay.style.opacity = '1'; };
            const leave = () => { overlay.style.opacity = '0'; };
            img.addEventListener('mouseenter', enter);
            img.addEventListener('mouseleave', leave);
        };
        ['#welcome-character-img', '#hero-char-wrap img'].forEach((sel) => {
            const el = document.querySelector(sel);
            if (el) swapOnHover(el, sel.includes('hero-char-wrap'));
        });

        const character = document.getElementById('hero-character');
        const boxes = document.querySelectorAll('.stage-box');
        let isAnimating = false;

        if (character && boxes.length) {
            const positionCharAtBox = (box) => {
                const boxRect = box.getBoundingClientRect();
                const charRect = character.getBoundingClientRect();
                const wrapperRect = character.parentElement.getBoundingClientRect();
                const offset = boxRect.left + boxRect.width / 2 - wrapperRect.left - charRect.width / 2;
                character.style.position = 'relative';
                character.style.transition = 'none';
                character.style.left = offset + 'px';
            };

            requestAnimationFrame(() => {
                positionCharAtBox(boxes[0]);
            });

            window.addEventListener('resize', function () {
                if (!isAnimating) positionCharAtBox(boxes[0]);
            });

            boxes.forEach((box) => {
                box.addEventListener('click', (e) => {
                    const href = box.getAttribute('href');
                    if (href && href.startsWith('#')) return;

                    if (isAnimating) return;
                    isAnimating = true;
                    e.preventDefault();

                    const wrapperRect = character.parentElement.getBoundingClientRect();
                    const boxRect = box.getBoundingClientRect();
                    const targetX = boxRect.left + boxRect.width / 2 - wrapperRect.left - character.offsetWidth / 2;
                    const charRect = character.getBoundingClientRect();
                    const currentX = charRect.left - wrapperRect.left;
                    const walkDistance = targetX - currentX;
                    const walkDuration = Math.max(0.25, Math.abs(walkDistance) / 300);

                    character.style.transition = `left ${walkDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
                    character.style.left = targetX + 'px';

                    setTimeout(() => {
                        if (window.SFX && window.SFX.jump) window.SFX.jump();
                        character.style.transition = 'bottom 0.2s cubic-bezier(0.28, 0.84, 0.42, 1)';
                        character.style.bottom = '50px';

                        setTimeout(() => {
                            if (window.SFX && window.SFX.boxBreak) window.SFX.boxBreak();
                            if (window.rumble) window.rumble(60);
                            box.classList.add('box-broken');
                            const stageSec = document.getElementById('stage-select');
                            if (stageSec && !stageSec.classList.contains('screen-shake')) {
                                stageSec.classList.add('screen-shake');
                                setTimeout(() => stageSec.classList.remove('screen-shake'), 600);
                            }
                            character.style.transition = 'bottom 0.15s cubic-bezier(0.55, 0.085, 0.68, 0.53)';
                            character.style.bottom = '0px';

                            setTimeout(() => {
                                isAnimating = false;
                                window.location.href = href;
                            }, 200);
                        }, 200);
                    }, walkDuration * 1000);
                });
            });

            const handlePageShow = () => {
                isAnimating = false;
                boxes.forEach((box) => box.classList.remove('box-broken'));
                character.style.bottom = '0px';
                requestAnimationFrame(() => positionCharAtBox(boxes[0]));
            };
            window.addEventListener('pageshow', handlePageShow);
        }

        const welcomeChar = document.getElementById('welcome-character');
        const welcomeImg = document.getElementById('welcome-character-img');
        const welcomeSpeech = document.getElementById('welcome-speech');

        if (welcomeChar && welcomeImg && welcome) {
            const greetings = ['Hi!', 'Hallo!', "Assalamu'alaikum!"];
            let greetIdx = 0;
            let pos = { x: 0, y: 0 };
            const keys = {};
            const speed = 4;

            const handleKeyDown = (e) => {
                if (!welcome || welcome.classList.contains('hidden')) return;
                const k = e.key.toLowerCase();
                if (['w', 'arrowup', 's', 'arrowdown', 'a', 'arrowleft', 'd', 'arrowright'].includes(k)) {
                    keys[k] = true;
                    e.preventDefault();
                }
            };

            const handleKeyUp = (e) => {
                keys[e.key.toLowerCase()] = false;
            };

            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);

            let animId;
            const moveLoop = () => {
                const isVisible = welcome && !welcome.classList.contains('hidden');
                if (isVisible) {
                    let dx = 0, dy = 0;
                    if (keys['w'] || keys['arrowup']) dy -= speed;
                    if (keys['s'] || keys['arrowdown']) dy += speed;
                    if (keys['a'] || keys['arrowleft']) dx -= speed;
                    if (keys['d'] || keys['arrowright']) dx += speed;

                    if (dx !== 0 || dy !== 0) {
                        const wrap = welcome.querySelector('.relative.z-10');
                        const maxX = wrap ? wrap.offsetWidth / 2 - 60 : 200;
                        const maxY = wrap ? wrap.offsetHeight / 2 - 60 : 200;
                        pos.x = Math.max(-maxX, Math.min(maxX, pos.x + dx));
                        pos.y = Math.max(-maxY, Math.min(maxY, pos.y + dy));
                        welcomeChar.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
                    }
                    animId = requestAnimationFrame(moveLoop);
                } else {
                    animId = setTimeout(() => moveLoop(), 500);
                }
            };
            moveLoop();

            const handleCharClick = (e) => {
                e.stopPropagation();
                if (window.SFX && window.SFX.blip) window.SFX.blip();
                greetIdx = (greetIdx + 1) % greetings.length;
                if (welcomeSpeech) {
                    welcomeSpeech.textContent = '▶ ' + greetings[greetIdx];
                    welcomeSpeech.style.opacity = '1';
                }

                welcomeChar.style.transform = `translate(${pos.x}px, ${pos.y - 15}px) scale(1.1)`;
                setTimeout(() => {
                    welcomeChar.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
                }, 250);

                clearTimeout(welcomeChar._speechTimer);
                welcomeChar._speechTimer = setTimeout(() => {
                    if (welcomeSpeech) welcomeSpeech.style.opacity = '0';
                }, 2000);
            };

            welcomeChar.addEventListener('click', handleCharClick);

            const handleScroll = () => {
                if (window.scrollY > 400) {
                    document.querySelectorAll('[data-back-to-top]').forEach(b => b.removeAttribute('hidden'));
                } else {
                    document.querySelectorAll('[data-back-to-top]').forEach(b => b.setAttribute('hidden', ''));
                }
            };
            window.addEventListener('scroll', handleScroll, { passive: true });

            const scrollProgress = document.getElementById('scroll-progress');
            const handleScrollProgress = () => {
                if (scrollProgress) {
                    const scrollTop = window.scrollY;
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                    scrollProgress.style.width = progress + '%';
                }
            };
            window.addEventListener('scroll', handleScrollProgress, { passive: true });

            const el = document.getElementById('hero-role');
            let roleInterval;
            let roleTimeout;
            if (el) {
                const roleList = p.roles || ['Web Developer', 'Event Enthusiast', 'Copywriter', 'Nuclear Engineer'];
                let idx = 0;

                const typeRole = (text, callback) => {
                    let i = 0;
                    el.textContent = '';
                    el.style.borderRight = '2px solid #FFD51A';
                    roleInterval = setInterval(() => {
                        el.textContent = text.substring(0, i + 1);
                        i++;
                        if (i >= text.length) {
                            clearInterval(roleInterval);
                            setTimeout(callback, 1500);
                        }
                    }, 70);
                };

                const eraseRole = (text, callback) => {
                    let i = text.length;
                    roleInterval = setInterval(() => {
                        el.textContent = text.substring(0, i - 1);
                        i--;
                        if (i <= 0) {
                            clearInterval(roleInterval);
                            el.style.borderRight = 'none';
                            setTimeout(callback, 300);
                        }
                    }, 40);
                };

                const loop = () => {
                    const role = roleList[idx];
                    typeRole(role, () => {
                        eraseRole(role, () => {
                            idx = (idx + 1) % roleList.length;
                            loop();
                        });
                    });
                };

                loop();
            }

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                document.removeEventListener('keyup', handleKeyUp);
                cancelAnimationFrame(animId);
                clearTimeout(animId);
                clearInterval(roleInterval);
                clearTimeout(roleTimeout);
                window.removeEventListener('scroll', handleScroll);
                window.removeEventListener('scroll', handleScrollProgress);
            };
        }
    }, []);

    const projectsCount = projects.length;
    const eventsCount = events.length;
    const writingsCount = writings.length;

    return (
        <AppLayout title="Indra Okta" profile={p}>
            <section
                id="welcome"
                className="welcome-screen min-h-screen flex items-center justify-center relative overflow-hidden"
            >
                <img
                    src="/images/bg.webp"
                    alt=""
                    className="welcome-bg-img"
                    aria-hidden="true"
                />

                <div className="relative z-10 w-full max-w-2xl mx-auto px-5 sm:px-8 text-center">
                    <div className="mb-8 sm:mb-10 flex justify-center">
                        <div
                            id="welcome-character"
                            className="w-48 h-48 sm:w-64 sm:h-64 cursor-pointer relative select-none"
                            style={{ transition: 'transform 0.08s ease-out' }}
                        >
                            <img
                                src="/images/indra-almet.webp"
                                alt="Indra greeting"
                                id="welcome-character-img"
                                className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(255,214,10,0.3)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                                style={{ imageRendering: 'pixelated' }}
                            />

                            <div
                                id="welcome-speech"
                                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#FFD51A] border-3 border-[#101020] px-3 py-1.5 font-pixel text-[10px] text-[#101020] uppercase whitespace-nowrap pointer-events-none"
                                style={{ boxShadow: '3px 3px 0 #101020', opacity: 0, transition: 'opacity 0.15s ease-out' }}
                            >
                                ▶ Hi!
                            </div>
                        </div>
                    </div>

                    <h1
                        className="font-pixel text-3xl sm:text-4xl lg:text-5xl text-white uppercase leading-tight mb-4 drop-shadow-[0_2px_16px_rgba(0,0,0,1),0_4px_32px_rgba(0,0,0,0.6),2px_2px_0_#101020] slide-in-up"
                    >
                        Hi! I'm{' '}
                        <span className="text-[#FFD51A]">Indra Okta</span>
                    </h1>

                    <p
                        className="font-retro text-xl sm:text-2xl text-white/90 leading-relaxed mb-10 max-w-xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,1),0_4px_24px_rgba(0,0,0,0.5),1px_1px_0_#101020] slide-in-up"
                        style={{ animationDelay: '0.3s' }}
                    >
                        I Build Things.
                        <br className="hidden sm:inline" />{' '}
                        Sometimes They Work.
                    </p>

                    <p
                        className="font-retro text-lg sm:text-xl text-white/90 leading-relaxed mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] slide-in-up"
                        style={{ animationDelay: '0.4s' }}
                    >
                        ▶ WASD or Arrow Keys to Move ▶
                    </p>

                    <div
                        className="slide-in-up"
                        style={{ animationDelay: '0.5s' }}
                    >
                        <button
                            type="button"
                            id="enter-portfolio"
                            className="btn-pixel text-sm sm:text-base px-8 sm:px-10 py-4 sm:py-5 power-glow cursor-pointer"
                        >
                            ▶ Press Start to Continue
                        </button>

                        <div
                            className="font-pixel text-[9px] sm:text-[10px] text-white/70 mt-4 uppercase cursor-blink tracking-wider"
                        >
                            ▶ Click to begin your quest
                        </div>
                    </div>

                    <button
                        type="button"
                        id="sound-toggle-welcome"
                        onClick={() => window.toggleSound && window.toggleSound()}
                        className="absolute top-4 right-4 font-pixel text-[9px] text-white/90 hover:text-[#FFD51A] transition-colors cursor-pointer uppercase tracking-wider z-20"
                        style={{ textShadow: '1px 1px 0 #101020, 2px 2px 0 #101020' }}
                        aria-label="Toggle sound"
                    >
                        🔊 Sound
                    </button>
                </div>
            </section>

            <div id="portfolio-content" className="hidden">

                <section className="hero-section bg-sky-texture relative overflow-hidden pb-6" id="about">

                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10">

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                            <div className="md:col-span-2 flex justify-center mt-8 sm:mt-0">
                                <div className="text-center">
                                    <div id="hero-char-wrap" className="w-40 h-40 sm:w-64 sm:h-64 bounce boss-intro mx-auto relative cursor-pointer mt-6 sm:mt-0" style={{ transition: 'transform 0.3s cubic-bezier(0.28, 0.84, 0.42, 1)' }}>
                                        <img src="/images/indra-almet.webp" alt="Indra" className="w-full h-full object-contain idle-blink idle-float" style={{ imageRendering: 'pixelated' }} />
                                        <div id="hero-speech" className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 bg-[#FFD51A] border-3 border-[#101020] px-2.5 py-1 sm:px-3 sm:py-1.5 font-pixel text-[8px] sm:text-[9px] text-[#101020] uppercase whitespace-nowrap pointer-events-none" style={{ boxShadow: '3px 3px 0 #101020', opacity: 1 }}>
                                            ▶ Assalamu'alaikum!
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center gap-3 mt-3">
                                        <div className="w-8 h-8 flex items-center justify-center bg-[#101020] border-2 border-[#101020] opacity-50 cursor-not-allowed" title="GitHub">
                                            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                        </div>
                                        <div className="w-8 h-8 flex items-center justify-center bg-[#101020] border-2 border-[#101020] opacity-50 cursor-not-allowed" title="LinkedIn">
                                            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                        </div>
                                        <a href={`mailto:${p.email || ''}`} className="w-8 h-8 flex items-center justify-center bg-[#101020] border-2 border-[#101020] hover:bg-[#EA4335] hover:border-[#EA4335] transition-colors" title="Email">
                                            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" /></svg>
                                        </a>
                                        <a href={p.phone_wa || '#'} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-[#101020] border-2 border-[#101020] hover:bg-[#25D366] hover:border-[#25D366] transition-colors" title="WhatsApp">
                                            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                        </a>
                                    </div>
                                    <div className="mt-4 h-8 flex items-center justify-center overflow-hidden">
                                        <span id="hero-role" className="font-pixel text-sm sm:text-base text-[#FFD51A] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"></span>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-3 space-y-6">
                                <div className="panel-yellow inline-block">
                                    <h2 className="font-pixel text-xl sm:text-3xl lg:text-4xl text-[#101020] leading-[1.4] uppercase text-glow">
                                        About Me
                                    </h2>
                                </div>

                                <div className="panel-pixel bg-[#FFFFFF]/95">
                                    <div className="font-pixel text-[10px] text-[#105E3D] mb-2 uppercase">▶ INTRO</div>
                                    <p className="font-retro text-base sm:text-xl text-[#101020] leading-relaxed">
                                        Nuclear Engineering graduate from{' '}
                                        <span className="text-[#B45309]">Universitas Gadjah Mada.</span>{' '}
                                        Trained to do nuclear things, but somehow I ended up
                                        building websites, organizing events, and writing random stuff.
                                    </p>

                                    <p className="font-retro text-base sm:text-xl text-[#101020] leading-relaxed mt-3">
                                        <span className="text-[#105E3D]">
                                            Nuclear by degree, web by hobby, event by passion,
                                            and writer by 'gabut'. Powered by caffeine and AI wkwk.
                                        </span>{' '}
                                        <span className="text-[#B45309]">
                                            More intro? Loading... AI is still generating it.
                                        </span>
                                    </p>
                                </div>

                                <div>
                                    <div className="font-pixel text-[9px] text-[#105E3D] mb-3 uppercase">▶ TECH STACK</div>
                                    <div className="space-y-2 overflow-hidden">
                                        {[
                                            {
                                                dir: 'tech-marquee-right',
                                                items: [
                                                    ['https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', 'HTML'],
                                                    ['https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', 'CSS'],
                                                    ['https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', 'JavaScript'],
                                                    ['https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', 'TypeScript'],
                                                    ['https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', 'React'],
                                                    ['/images/inertia-logo.svg', 'Inertia'],
                                                    ['https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', 'Tailwind CSS'],
                                                    ['https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg', 'Vite'],
                                                ],
                                            },
                                            {
                                                dir: 'tech-marquee-left',
                                                items: [
                                                    ['https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg', 'PHP'],
                                                    ['https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg', 'Laravel'],
                                                    ['https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', 'MySQL'],
                                                    ['https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', 'PostgreSQL'],
                                                    ['https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg', 'SQLite'],
                                                    ['https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg', 'WordPress'],
                                                    ['https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', 'C++'],
                                                    ['/images/projects/topas-ion.jpg', 'TOPAS'],
                                                    ['/images/projects/geant4-technologie.jpg', 'Geant4'],
                                                ],
                                            },
                                            {
                                                dir: 'tech-marquee-right',
                                                items: [
                                                    ['https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', 'Git'],
                                                    ['https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', 'GitHub'],
                                                    ['https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', 'Docker'],
                                                    ['https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg', 'Vercel'],
                                                    ['https://railway.com/brand/logo-dark.png', 'Railway'],
                                                ],
                                            },
                                        ].map((row, i) => {
                                            const doubled = [...row.items, ...row.items];
                                            return (
                                                <div key={i} className={`tech-marquee ${row.dir}`}>
                                                    <div className="tech-track">
                                                        {doubled.map(([icon, label, glyph], j) => (
                                                            <div key={j} className="tech-item">
                                                                {icon ? (
                                                                    <img loading="lazy" decoding="async" src={icon} alt={label} className="tech-icon" />
                                                                ) : (
                                                                    <span className="tech-icon tech-glyph" aria-hidden="true">{glyph || '✦'}</span>
                                                                )}
                                                                <span>{label}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-sky-texture py-6 sm:py-8" id="stage-select">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-6">
                            <div className="font-pixel text-[10px] text-[#B45309] mb-2 uppercase cursor-blink">▶ SELECT YOUR STAGE ▶</div>
                            <h2 className="font-pixel text-lg sm:text-2xl text-[#101020] uppercase">Choose Your Quest</h2>
                            <p className="font-retro text-sm sm:text-lg text-[#3A4657] mt-2">Some things i've worked on</p>
                        </div>

                        <div id="stage-boxes" className="grid grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto mb-4">
                            <a href="/stage/1" data-box="box-1" className="stage-box pixel-card text-center p-4 sm:p-5 focus:outline-none focus:ring-2 focus:ring-[#6B7280] block" style={{ animationDelay: '0s' }}>
                                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto flex items-center justify-center bg-[#9CA3AF] border-3 border-[#101020] font-display text-2xl sm:text-3xl mb-2 text-[#101020]">
                                    ⚡
                                </div>
                                <div className="font-pixel text-[10px] text-[#6B7280] uppercase mb-1">▶ STAGE 1</div>
                                <h3 className="font-display text-base sm:text-lg text-[#101020] uppercase">Code</h3>
                                <p className="font-retro text-sm text-[#3A4657]">{projectsCount} builds</p>
                            </a>

                            <a href="/stage/2" data-box="box-2" className="stage-box pixel-card text-center p-4 sm:p-5 focus:outline-none focus:ring-2 focus:ring-[#F05A6E] block" style={{ animationDelay: '0.1s' }}>
                                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto flex items-center justify-center bg-[#F05A6E] border-3 border-[#101020] font-display text-2xl sm:text-3xl mb-2 text-white">
                                    ⚔
                                </div>
                                <div className="font-pixel text-[10px] text-[#BE123C] uppercase mb-1">▶ STAGE 2</div>
                                <h3 className="font-display text-base sm:text-lg text-[#101020] uppercase">Events</h3>
                                <p className="font-retro text-sm text-[#3A4657]">{eventsCount} programs</p>
                            </a>

                            <a href="/stage/3" data-box="box-3" className="stage-box pixel-card text-center p-4 sm:p-5 focus:outline-none focus:ring-2 focus:ring-[#36CFDD] block" style={{ animationDelay: '0.2s' }}>
                                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto flex items-center justify-center bg-[#36CFDD] border-3 border-[#101020] font-display text-2xl sm:text-3xl mb-2">
                                    ✎
                                </div>
                                <div className="font-pixel text-[10px] text-[#0E7490] uppercase mb-1">▶ STAGE 3</div>
                                <h3 className="font-display text-base sm:text-lg text-[#101020] uppercase">Words</h3>
                                <p className="font-retro text-sm text-[#3A4657]">{writingsCount} essays</p>
                            </a>
                        </div>

                        <div className="flex justify-start">
                            <div id="hero-character" className="relative" style={{ width: '96px', height: '96px' }}>
                                <video
                                    src="/images/indra-lari.webm"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    preload="auto"
                                    disablePictureInPicture
                                    className="w-full h-full object-contain"
                                    style={{ imageRendering: 'pixelated' }}
                                    id="hero-character-img"
                                    aria-hidden="true"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-sky-texture py-4 sm:py-5" id="hobbies">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="font-pixel text-[7px] text-[#B45309]">▶ HOBBIES</span>
                            <div className="flex-1 h-px bg-[#F05A6E]"></div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 lg:gap-4 items-start">
                            <div className="lg:col-span-4">
                                <h2 className="font-pixel text-[13px] sm:text-base text-[#101020] mb-1 uppercase">
                                    When I'm Bored
                                </h2>
                                <p className="font-retro text-[11px] sm:text-xs text-[#3A4657] leading-relaxed">
                                    {hobbyBlurb}
                                </p>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {hobbyChips.map(([icon, label]) => (
                                        <span key={label} className="inline-flex items-center gap-1 font-pixel text-[7px] uppercase px-1.5 py-0.5 bg-[#FFFFFF] border-2 border-[#101020] text-[#101020] shadow-[2px_2px_0_#101020]">
                                            <span>{icon}</span>{label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <div
                                    className="pixel-card relative overflow-hidden select-none"
                                    style={{ cursor: dragging ? 'grabbing' : 'grab', touchAction: 'none' }}
                                    onMouseDown={onHobbyStart}
                                    onMouseMove={onHobbyMove}
                                    onMouseUp={onHobbyEnd}
                                    onMouseLeave={onHobbyEnd}
                                    onTouchStart={onHobbyStart}
                                    onTouchMove={onHobbyMove}
                                    onTouchEnd={onHobbyEnd}
                                >
                                    <div className="relative w-full h-32 sm:h-40 overflow-hidden">
                                        <div
                                            className="flex h-full"
                                            style={{
                                                transform: `translateX(calc(${-hobbyIndex * 100}% + ${dragOffset}px))`,
                                                transition: dragging ? 'none' : 'transform 0.3s cubic-bezier(0.25,0.8,0.25,1)',
                                            }}
                                        >
                                            {hobbyPhotos.map((hp) => (
                                                <div key={hp.src} id="hobby-frame" className="relative w-full h-full shrink-0 flex items-center justify-center" onClick={onHobbyPhotoClick} style={{ cursor: 'pointer' }}>
                                                    <img src={hp.src} alt="" aria-hidden="true" draggable="false" className="absolute inset-0 w-full h-full object-cover scale-110 blur-lg brightness-75" />
                                                    <img src={hp.src} alt={hp.label} data-hobby-photo draggable="false" className="relative max-w-full max-h-full object-contain" style={{ imageRendering: 'auto' }} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="absolute top-1 left-1 font-pixel text-[6px] px-1 py-0.5 bg-[#FFD51A] text-[#101020] border-2 border-[#101020] uppercase shadow-[2px_2px_0_#101020]">
                                        {dragging ? 'holding...' : '✋ drag'}
                                    </div>
                                    <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-0.5">
                                        {hobbyPhotos.map((hp, i) => (
                                            <button
                                                key={hp.src}
                                                type="button"
                                                onClick={() => setHobbyIndex(i)}
                                                aria-label={hp.label}
                                                className={`w-1.5 h-1.5 border-2 border-[#101020] ${i === hobbyIndex ? 'bg-[#F05A6E]' : 'bg-[#FFFFFF] hover:bg-[#FFD51A]'}`}
                                            ></button>
                                        ))}
                                    </div>
                                </div>
                                <p className="font-pixel text-[6px] text-[#55607A] uppercase mt-1.5 text-center">
                                        {hobbyPhotos[hobbyIndex].label} · click to enlarge
                                    </p>
                            </div>
                        </div>
                    </div>
                </section>

                {viewIndex !== null && (
                    <div
                        id="hobby-lightbox"
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#101020]/90 p-4 sm:p-8"
                        onClick={() => setViewIndex(null)}
                    >
                        <div
                            className="relative max-w-3xl w-full"
                            onClick={(e) => e.stopPropagation()}
                            role="dialog"
                            aria-modal="true"
                            aria-label={hobbyPhotos[viewIndex].label}
                        >
                            <div className="pixel-card overflow-hidden">
                                <div id="hobby-frame-view" className="relative w-full h-[55vh] sm:h-[70vh] flex items-center justify-center bg-[#0A0A20]">
                                    <img
                                        src={hobbyPhotos[viewIndex].src}
                                        alt={hobbyPhotos[viewIndex].label}
                                        data-hobby-photo
                                        draggable="false"
                                        onClick={onViewPhotoClick}
                                        className="max-w-full max-h-full object-contain"
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setViewIndex(null)}
                                aria-label="Tutup"
                                className="absolute -top-3 -right-3 w-9 h-9 bg-[#F05A6E] text-[#FFFFFF] border-[3px] border-[#101020] shadow-[2px_2px_0_#101020] font-pixel text-sm flex items-center justify-center hover:bg-[#FFD51A] hover:text-[#101020]"
                            >✕</button>
                            <button
                                type="button"
                                onClick={() => setViewIndex((i) => (i - 1 + hobbyPhotos.length) % hobbyPhotos.length)}
                                aria-label="Sebelumnya"
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#FFFFFF] text-[#101020] border-[3px] border-[#101020] shadow-[2px_2px_0_#101020] font-pixel text-sm flex items-center justify-center hover:bg-[#FFD51A]"
                            >◀</button>
                            <button
                                type="button"
                                onClick={() => setViewIndex((i) => (i + 1) % hobbyPhotos.length)}
                                aria-label="Berikutnya"
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#FFFFFF] text-[#101020] border-[3px] border-[#101020] shadow-[2px_2px_0_#101020] font-pixel text-sm flex items-center justify-center hover:bg-[#FFD51A]"
                            >▶</button>
                            <div className="flex justify-center gap-0.5 mt-3">
                                {hobbyPhotos.map((hp, i) => (
                                    <button
                                        key={hp.src}
                                        type="button"
                                        onClick={() => setViewIndex(i)}
                                        aria-label={hp.label}
                                        className={`w-1.5 h-1.5 border-2 border-[#FFFFFF] ${i === viewIndex ? 'bg-[#F05A6E]' : 'bg-[#FFFFFF]/40 hover:bg-[#FFD51A]'}`}
                                    ></button>
                                ))}
                            </div>
                            <p className="font-pixel text-[7px] text-[#FFFFFF] uppercase mt-1.5 text-center">{hobbyPhotos[viewIndex].label}</p>
                        </div>
                    </div>
                )}

                <section className="bg-sky-texture py-8 sm:py-10" id="contact">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="font-pixel text-[10px] text-[#B45309]">▶ CONTACT</span>
                            <div className="flex-1 h-1 bg-[#FFD51A]"></div>
                        </div>

                        <h2 className="font-pixel text-xl sm:text-3xl text-[#101020] mb-3 uppercase">
                            Get In Touch
                        </h2>
                        <p className="font-retro text-base sm:text-lg text-[#3A4657] mb-8">
                            You can find me on
                        </p>

                        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-stretch">
                            <a href={`mailto:${p.email || ''}`} className="panel-pixel flex flex-col items-center justify-center text-center gap-2 p-3 sm:p-5 hover:bg-[#FFD51A]/20 transition-colors group min-h-full">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#EA4335] border-2 border-[#101020] shrink-0">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-white" viewBox="0 0 24 24"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" /></svg>
                                </div>
                                <div className="font-pixel text-[7px] sm:text-[9px] text-[#105E3D] uppercase">▶ Email</div>
                                <div className="font-retro text-xs sm:text-lg text-[#101020] group-hover:text-[#B45309] break-all leading-snug">{p.email}</div>
                            </a>

                            <a href={p.phone_wa || '#'} target="_blank" rel="noopener noreferrer" className="panel-pixel flex flex-col items-center justify-center text-center gap-2 p-3 sm:p-5 hover:bg-[#FFD51A]/20 transition-colors group min-h-full">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#25D366] border-2 border-[#101020] shrink-0">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                </div>
                                <div className="font-pixel text-[7px] sm:text-[9px] text-[#105E3D] uppercase">▶ WhatsApp</div>
                                <div className="font-retro text-xs sm:text-lg text-[#101020] group-hover:text-[#B45309] break-all leading-snug">{p.phone}</div>
                            </a>

                            <a href="https://instagram.com/indraokta97" target="_blank" rel="noopener noreferrer" className="panel-pixel flex flex-col items-center justify-center text-center gap-2 p-3 sm:p-5 hover:bg-[#FFD51A]/20 transition-colors group min-h-full">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#E4405F] border-2 border-[#101020] shrink-0">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                </div>
                                <div className="font-pixel text-[7px] sm:text-[9px] text-[#105E3D] uppercase">▶ Instagram</div>
                                <div className="font-retro text-xs sm:text-lg text-[#101020] group-hover:text-[#B45309] break-all leading-snug">@indraokta97</div>
                            </a>
                        </div>
                    </div>
                </section>

                <footer className="bg-[#BFE0FF] border-t-[3px] border-[#105E3D] py-8">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
                        <div className="font-pixel text-[10px] text-[#105E3D] uppercase cursor-blink">
                            ▶ THANKS FOR BEING HERE! ▶
                        </div>
                        <VisitorCounter />
                    </div>
                </footer>
            </div>
        </AppLayout>
    );
}
