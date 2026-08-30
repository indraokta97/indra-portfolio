import React, { useEffect, useState } from 'react';

export default function AppLayout({ children, title, profile }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [atBottom, setAtBottom] = useState(false);

    useEffect(() => {
        // Hash check for welcome vs portfolio view
        const h = window.location.hash;
        if (h && h !== '#welcome') {
            const w = document.getElementById('welcome');
            const p = document.getElementById('portfolio-content');
            const header = document.getElementById('site-header');
            if (w) w.style.display = 'none';
            if (p) p.classList.remove('hidden');
            if (header) header.classList.remove('hidden');
        }
    }, []);

    useEffect(() => {
        const onScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            setAtBottom(scrollTop + clientHeight >= scrollHeight - 80);
        };
        onScroll();
        window.addEventListener('scroll', onScroll);
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col pixel-body">
            <div id="scroll-progress" aria-hidden="true"></div>

            <a className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-[#A9D4F5] text-[#101020] px-4 py-2 font-pixel text-xs uppercase" href="#main">
                Skip to main content
            </a>

            {/* Pixel Top Nav */}
            <header id="site-header" className="site-header sticky top-0 z-40 w-full bg-[#BFE0FF] border-b-[3px] border-black hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
                    <a href="/#welcome" id="brand-link" className="font-pixel text-sm text-[#101020] hover:text-[#B45309] transition-colors flex items-center gap-2">
                        <span>INDRAOKTA97</span>
                    </a>

                    <nav className="hidden md:flex items-center gap-2 text-xs font-pixel" aria-label="Main Navigation">
                        <a className="nav-link menu-hover px-3 py-1.5 text-[#101020] hover:text-[#B45309] transition-colors" data-nav="about" href="/#about">ABOUT</a>
                        <a className="nav-link menu-hover px-3 py-1.5 text-[#101020] hover:text-[#B45309] transition-colors" data-nav="stage-select" href="/#stage-select">PROJECT</a>
                        <a className="nav-link menu-hover px-3 py-1.5 text-[#101020] hover:text-[#B45309] transition-colors" data-nav="contact" href="/#contact">CONTACT</a>
                    </nav>

                    <div className="flex items-center gap-2">
                        <button type="button" id="sound-toggle" onClick={() => window.toggleSound && window.toggleSound()} className="font-pixel text-[8px] text-[#105E3D] hover:text-[#B45309] transition-colors cursor-pointer uppercase hidden sm:inline-block" aria-label="Toggle sound">
                            🔊 SOUND
                        </button>

                        <button type="button" id="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#101020]">
                            <span className={`block w-5 h-[3px] bg-[#101020] transition-transform duration-300 ${menuOpen ? 'translate-y-[8px] rotate-45' : ''}`}></span>
                            <span className={`block w-5 h-[3px] bg-[#101020] transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`block w-5 h-[3px] bg-[#101020] transition-transform duration-300 ${menuOpen ? '-translate-y-[8px] -rotate-45' : ''}`}></span>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-48' : 'max-h-0'}`}>
                    <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 flex flex-col gap-1 font-pixel text-xs" aria-label="Mobile Navigation">
                        <a className="nav-link menu-hover px-3 py-2 text-[#101020] hover:text-[#B45309] hover:bg-[#FFD51A]/30 transition-colors uppercase" data-nav="about" href="/#about" onClick={() => setMenuOpen(false)}>ABOUT</a>
                        <a className="nav-link menu-hover px-3 py-2 text-[#101020] hover:text-[#B45309] hover:bg-[#FFD51A]/30 transition-colors uppercase" data-nav="stage-select" href="/#stage-select" onClick={() => setMenuOpen(false)}>PROJECT</a>
                        <a className="nav-link menu-hover px-3 py-2 text-[#101020] hover:text-[#B45309] hover:bg-[#FFD51A]/30 transition-colors uppercase" data-nav="contact" href="/#contact" onClick={() => setMenuOpen(false)}>CONTACT</a>
                        <button type="button" onClick={() => { window.toggleSound && window.toggleSound(); setMenuOpen(false); }} className="text-left px-3 py-2 text-[#105E3D] hover:text-[#B45309] transition-colors uppercase">🔊 SOUND</button>
                    </nav>
                </div>
            </header>

            <main id="main" className="flex-1">
                {children}
            </main>

            {/* Floating contact character */}
            <a href="/#contact" id="contact-character" className={`fixed bottom-4 right-4 z-30 group block focus:outline-none focus:ring-2 focus:ring-[#B45309] focus:ring-offset-2 focus:ring-offset-[#101020] transition-all duration-300 ${atBottom ? 'opacity-0 translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                <div className="flex flex-col items-center gap-0.5">
                    <div className="pixel-border bg-[#FFD51A] px-1.5 py-0.5 font-pixel text-[7px] text-[#101020] uppercase whitespace-nowrap group-hover:bg-white transition-colors">
                        ▶ Contact Me
                    </div>
                    <video src="/images/cm.webm" alt="Say hi" autoPlay loop muted playsInline className="h-12 sm:h-16 w-auto" style={{ imageRendering: 'pixelated' }} />
                </div>
            </a>
        </div>
    );
}
