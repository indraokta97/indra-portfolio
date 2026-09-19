import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { site } from '../data/site';

const SECTIONS = [
    { label: 'HOME', hint: '/', route: '/', keywords: 'home beranda utama' },
    { label: 'ABOUT', hint: '#about', hash: 'about', keywords: 'about tentang' },
    { label: 'PROJECTS', hint: '/stage/1', route: '/stage/1', keywords: 'project stage 1 code' },
    { label: 'EVENTS', hint: '/stage/2', route: '/stage/2', keywords: 'event stage 2 kegiatan' },
    { label: 'WRITINGS', hint: '/stage/3', route: '/stage/3', keywords: 'writing stage 3 tulisan' },
    { label: 'CV', hint: '/cv', route: '/cv', keywords: 'curriculum vitae resume' },
    { label: 'CONTACT', hint: '#contact', hash: 'contact', keywords: 'contact kontak email' },
];

export default function CommandPalette() {
    const [, setLocation] = useLocation();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const items = useMemo(() => {
        const q = query.trim().toLowerCase();
        const base = [
            { group: 'NAVIGASI', items: SECTIONS },
            {
                group: 'PROJECTS',
                items: site.projects.filter(p => p.published).slice(0, 6).map(p => ({
                    label: p.title, hint: `/work/${p.slug}`, route: `/work/${p.slug}`, keywords: p.tags || p.category || '',
                })),
            },
            {
                group: 'WRITINGS',
                items: site.writings.slice(0, 4).map(w => ({
                    label: w.title, hint: `/writing/${w.slug}`, route: `/writing/${w.slug}`, keywords: w.description || '',
                })),
            },
        ].flatMap(g => g.items.map(i => ({ ...i, group: g.group })));
        if (!q) return base;
        return base.filter(i => (i.label + ' ' + (i.keywords || '') + ' ' + i.hint).toLowerCase().includes(q));
    }, [query]);

    useEffect(() => { setActive(0); }, [query]);

    useEffect(() => {
        window.openCommandPalette = () => { setQuery(''); setActive(0); setOpen(true); };
        return () => { delete window.openCommandPalette; };
    }, []);

    useEffect(() => {
        if (open && inputRef.current) inputRef.current.focus();
        if (open && listRef.current && listRef.current.children[active]) {
            listRef.current.children[active].scrollIntoView({ block: 'nearest' });
        }
    }, [open, active]);

    useEffect(() => {
        const onKey = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen(o => {
                    const next = !o;
                    setQuery('');
                    setActive(0);
                    return next;
                });
                return;
            }
            if (!open) return;
            if (e.key === 'Escape') { e.preventDefault(); setOpen(false); setQuery(''); return; }
            if (!items.length) return;
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => (a + 1) % items.length); return; }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => (a - 1 + items.length) % items.length); return; }
            if (e.key === 'Enter' && items[active]) { e.preventDefault(); go(items[active]); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    });

    function go(item) {
        setOpen(false);
        setQuery('');
        if (item.hash) {
            if (window.location.pathname === '/') {
                window.location.hash = item.hash;
            } else {
                setLocation('/');
                setTimeout(() => { window.location.hash = item.hash; }, 80);
            }
        } else {
            setLocation(item.route);
        }
    }

    if (!open) return null;

    let lastGroup = null;
    return (
        <div
            className="fixed inset-0 z-[110] flex items-start justify-center pt-[12vh] px-4"
            onClick={(e) => { if (e.target === e.currentTarget) { setOpen(false); setQuery(''); } }}
        >
            <div className="w-full max-w-xl pixel-border bg-white pixel-shadow" role="dialog" aria-modal="true" aria-label="Command palette">
                <div className="flex items-center gap-2 px-3 py-2 border-b-[3px] border-black bg-[#BFE0FF]">
                    <span className="font-pixel text-[8px] text-[#101020] uppercase">▶ Search</span>
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        type="text"
                        placeholder="Cari stage, project, tulisan…"
                        aria-label="Command palette search"
                        className="flex-1 min-w-0 bg-transparent outline-none font-retro text-sm text-[#101020] placeholder:text-[#101020]/40"
                    />
                    <kbd className="shrink-0 font-pixel text-[8px] text-[#101020]/70 border-[2px] border-black px-1 py-0.5 bg-white">ESC</kbd>
                </div>
                <ul ref={listRef} className="max-h-80 overflow-y-auto" role="listbox">
                    {items.length === 0 && (
                        <li className="px-3 py-3 font-pixel text-[8px] text-[#101020]/60 uppercase text-center">No match — coba keyword lain</li>
                    )}
                    {items.map((item, i) => {
                        const showGroup = item.group !== lastGroup;
                        lastGroup = item.group;
                        const isActive = i === active;
                        return (
                            <li key={item.group + '-' + item.label}>
                                {showGroup && (
                                    <div className="px-3 pt-2 pb-0.5 font-pixel text-[7px] text-[#B45309] uppercase bg-white">{item.group}</div>
                                )}
                                <button
                                    type="button"
                                    onMouseEnter={() => setActive(i)}
                                    onClick={() => go(item)}
                                    className={`w-full text-left px-3 py-2 flex items-center justify-between gap-3 cursor-pointer ${isActive ? 'bg-[#FFD51A]' : 'bg-white hover:bg-[#FFD51A]/70'}`}
                                    role="option"
                                    aria-selected={isActive}
                                >
                                    <span className="truncate font-retro text-sm text-[#101020]">{item.label}</span>
                                    <span className={`shrink-0 font-pixel text-[7px] uppercase ${isActive ? 'text-[#105E3D]' : 'text-[#101020]/50'}`}>{item.hint}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
                <div className="px-3 py-1.5 border-t-[3px] border-black bg-[#BFE0FF] flex items-center justify-between font-pixel text-[7px] text-[#101020] uppercase">
                    <span>↑↓ pilih · ↵ buka · esc tutup</span>
                    <span>ctrl+k</span>
                </div>
            </div>
        </div>
    );
}