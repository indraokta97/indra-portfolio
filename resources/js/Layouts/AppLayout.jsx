import React, { useEffect } from 'react';

export default function AppLayout({ children, title, profile }) {
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
                        <button type="button" id="sound-toggle" onClick={() => window.toggleSound && window.toggleSound()} className="font-pixel text-[8px] text-[#105E3D] hover:text-[#B45309] transition-colors cursor-pointer uppercase" aria-label="Toggle sound">
                            🔊 SOUND
                        </button>
                    </div>
                </div>
            </header>

            <main id="main" className="flex-1">
                {children}
            </main>

            {/* Floating contact character */}
            <a href="/#contact" id="contact-character" className="fixed bottom-4 right-4 z-30 group block focus:outline-none focus:ring-2 focus:ring-[#B45309] focus:ring-offset-2 focus:ring-offset-[#101020]">
                <div className="flex flex-col items-center gap-1">
                    <div className="pixel-border bg-[#FFD51A] px-3 py-1.5 font-pixel text-[10px] text-[#101020] uppercase whitespace-nowrap group-hover:bg-white transition-colors">
                        ▶ Contact Me
                    </div>
                    <img src="/images/cm-indra.webp" alt="Say hi" className="h-24 sm:h-32 w-auto" />
                </div>
            </a>
        </div>
    );
}
