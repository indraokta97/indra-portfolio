import { useEffect, useState } from 'react';
import AppLayout from '../Layouts/AppLayout';
import { site } from '../data/site';
import { getTagLogo } from '../data/logos';

const PROJECTS_PER_PAGE = 4;

const stageMeta = [
    { name: 'Code', icon: '⚡', color: '#6B7280', ring: '#101020' },
    { name: 'Events', icon: '⚔', color: '#F05A6E', ring: '#BE123C' },
    { name: 'Words', icon: '✎', color: '#101020', ring: '#101020' },
];

const wordsCategories = [
    {
        key: 'academic',
        label: 'Academic Writings',
        icon: '☢',
        tagline: 'Essays I wrote during my studies in Nuclear Engineering at Universitas Gadjah Mada.',
        frame: null,
        hideList: true,
    },
    {
        key: 'masjid',
        label: 'Masjid Kampus UGM',
        icon: '🕌',
        tagline: 'Writings published as Writer, Editor, and Admin of masjidkampus.ugm.ac.id.',
        frame: { url: 'https://masjidkampus.ugm.ac.id/author/indraoktafian97/', domain: 'masjidkampus.ugm.ac.id' },
    },
    {
        key: 'js',
        label: "Jama'ah Shalahuddin UGM",
        icon: '✦',
        tagline: 'Writings published as Writer, Editor, and Admin of js.ugm.ac.id.',
        frame: { url: 'https://js.ugm.ac.id/author/indraoktafian97/', domain: 'js.ugm.ac.id' },
    },
    {
        key: 'others',
        label: 'Others',
        icon: '✎',
        tagline: 'Essays, field notes, and how-tos published on Medium, LinkedIn, and elsewhere.',
        frame: null,
        hideList: true,
    },
];

function WebFrame({ url, domain }) {
    const proxy = `/api/proxy?url=${encodeURIComponent(url)}`;
    return (
        <div className="web-frame">
            <div className="web-frame-bar">
                <span className="web-frame-dots" aria-hidden="true"><i></i><i></i><i></i></span>
                <span className="web-frame-url">🔍 {domain}/author/indraoktafian97/</span>
                <a className="web-frame-open" href={url} target="_blank" rel="noopener noreferrer">▶ OPEN ↗</a>
            </div>
            <iframe src={proxy} title={domain} loading="lazy" referrerPolicy="no-referrer" className="web-frame-iframe" />
        </div>
    );
}

export default function Stage({ stageNumber }) {
    const meta = stageMeta[stageNumber - 1];
    const stageName = meta.name;
    const stageColor = meta.color;
    const stageIcon = meta.icon;
    const writingItems = site.writings;
    const items = stageNumber === 1 ? site.projects :
                  stageNumber === 2 ? site.events :
                  writingItems;
    const parsedItems = stageNumber === 1 ? items.map(p => ({
        ...p,
        tags: p.tags ? (typeof p.tags === 'string' ? p.tags.split(',').map(t => t.trim()).filter(Boolean) : p.tags) : []
    })) : items;
    const itemsToShow = stageNumber === 1 ? parsedItems : items;
    const itemLinkPrefix = stageNumber === 1 ? '/work/' :
                           stageNumber === 2 ? '/programs/' :
                           '/writing/';
    const stageHref = (n) => `/stage/${n}`;
    const totalPages = stageNumber === 1 ? Math.ceil(itemsToShow.length / PROJECTS_PER_PAGE) : 1;
    const [page, setPage] = useState(0);
    const pageItems = stageNumber === 1 ? itemsToShow.slice(page * PROJECTS_PER_PAGE, page * PROJECTS_PER_PAGE + PROJECTS_PER_PAGE) : itemsToShow;

    useEffect(() => {
        const t = setTimeout(() => {
            if (window.unlockAchievement) window.unlockAchievement('stage-' + stageNumber);
        }, 2600);
        return () => clearTimeout(t);
    }, [stageNumber]);

    const renderCard = (item) => {
        const inner = (
            <>
                {item.image && (
                    <div className="aspect-video overflow-hidden border-b-3 border-[#101020]">
                        {/\.(mp4|webm|ogg)$/i.test(item.image) ? (
                            <video src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" autoPlay loop muted playsInline></video>
                        ) : (
                            <img src={item.image} alt={item.title || item.event} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" style={{ imageRendering: 'pixelated' }} />
                        )}
                        {item.on_going && (
                            <div className="absolute top-2 right-2 font-pixel text-[8px] px-2 py-1 bg-[#F05A6E] text-white border-2 border-[#101020] uppercase">● On Going</div>
                        )}
                        {item.badge && (
                            <div className="absolute top-2 right-2 font-pixel text-[8px] px-2 py-1 bg-[#F05A6E] text-white border-2 border-[#101020] uppercase">{item.badge}</div>
                        )}
                    </div>
                )}
                <div className="p-4">
                    {stageNumber === 1 && item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {item.tags.slice(0, 8).map((tag, i) => {
                                const logo = getTagLogo(tag);
                                return logo ? (
                                    <img key={i} src={logo} alt={tag} className="w-7 h-7 object-contain" title={tag.toUpperCase()} />
                                ) : (
                                    <span key={i} className="font-pixel text-[7px] px-1.5 py-0.5 bg-[#027AE9] text-white border border-[#101020]">{tag.toUpperCase()}</span>
                                );
                            })}
                        </div>
                    )}
                    {stageNumber === 2 && item.scale && (
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="font-pixel text-[7px] px-1.5 py-0.5 bg-[#101020] text-white border border-[#101020] uppercase">{item.scale}</span>
                            {item.role && <span className="font-pixel text-[8px] text-[#BE123C] uppercase">▶ {item.role}</span>}
                        </div>
                    )}
                    {stageNumber === 3 && item.outlet && (
                        <div className="font-pixel text-[8px] text-[#0E7490] uppercase mb-1.5">▶ {item.outlet}</div>
                    )}
                    <h3 className="font-display text-sm sm:text-base text-[#101020] group-hover:text-[#B45309] transition-colors leading-snug mb-1">{item.title || item.event}</h3>
                    {stageNumber === 2 && (item.period || item.year) && (
                        <div className="mt-1.5 font-pixel text-[7px] text-[#6B7280] uppercase">📅 {item.period || item.year}</div>
                    )}
                    <p className="font-retro text-xs text-[#3A4657] leading-snug line-clamp-2 mt-1.5">{item.description}</p>
                    {stageNumber !== 2 && (item.year || item.period) && (
                        <div className="mt-2 font-pixel text-[7px] text-[#55607A] uppercase">{item.year || item.period}</div>
                    )}
                </div>
            </>
        );
        if (item.on_going || item.locked) {
            return (
                <div key={item.slug} className="pixel-card block overflow-hidden cursor-not-allowed opacity-80 relative">
                    {inner}
                </div>
            );
        }
        return (
            <a key={item.slug} href={itemLinkPrefix + item.slug} className="pixel-card group block focus:outline-none focus:ring-2 focus:ring-[#B45309] overflow-hidden">
                {inner}
            </a>
        );
    };

    return (
        <AppLayout title={`Stage ${stageNumber} · ${stageName}`}>
            <div className="min-h-screen py-8 sm:py-12 stage-page bg-sky-texture" data-stage={stageNumber}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                    <div className="flex items-center justify-between font-pixel text-[9px] uppercase" style={{ color: stageColor }}>
                        <a href="/#stage-select" className="back-to-hub text-[#3A4657] hover:text-[#B45309]">◀ BACK</a>
                        <span>STAGE {stageNumber} / 3</span>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                    <div className="boss-stage-header p-4 border-2" style={{ borderColor: stageColor }}>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-[#FFFFFF] border-2 border-[#101020] font-display text-3xl sm:text-4xl shrink-0">
                                {stageIcon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-pixel text-[9px] mb-1 uppercase" style={{ color: stageColor }}>▶ STAGE {stageNumber}</div>
                                <h1 className="font-display text-3xl sm:text-4xl text-[#101020] uppercase leading-tight">{stageName}</h1>
                                <p className="font-retro text-lg text-[#3A4657] mt-1">{itemsToShow.length} {itemsToShow.length === 1 ? 'entry' : 'entries'} in this stage</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {stageNumber === 3 ? (
                        <div className="space-y-12">
                            {wordsCategories.map((cat) => {
                                const list = writingItems.filter((w) => (w.category || 'others') === cat.key);
                                return (
                                    <div key={cat.key}>
                                        <div className="flex items-start gap-3 mb-5">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#FFFFFF] border-3 border-[#101020] font-display text-xl sm:text-2xl shrink-0">
                                                {cat.icon}
                                            </div>
                                            <div className="min-w-0">
                                                <h2 className="font-display text-xl sm:text-2xl text-[#101020] uppercase leading-tight">{cat.label}</h2>
                                                <p className="font-retro text-sm sm:text-base text-[#3A4657] mt-1">{cat.tagline}</p>
                                            </div>
                                        </div>

                                        {!cat.hideList && list.length > 0 && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {list.map(renderCard)}
                                            </div>
                                        )}

                                        {!cat.hideList && list.length === 0 && !cat.frame && (
                                            <div className="pixel-card px-4 py-6">
                                                <p className="font-retro text-base text-[#55607A]">More essays on the way — check back soon.</p>
                                            </div>
                                        )}

                                        {cat.hideList && (
                                            <div className="pixel-card px-4 py-5">
                                    <p className="font-pixel text-[9px] text-[#B45309] uppercase tracking-wider">OTW INPUT WKWK</p>
                                            </div>
                                        )}

                                        {cat.frame && (
                                            <div className="mt-2">
                                                <WebFrame url={cat.frame.url} domain={cat.frame.domain} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {pageItems.map(renderCard)}
                            {stageNumber === 2 && (
                                <div className="pixel-card px-4 py-5 flex items-center justify-center min-h-[160px] cursor-not-allowed select-none">
                                    <p className="font-pixel text-[9px] text-[#B45309] uppercase tracking-wider">OTW INPUT</p>
                                </div>
                            )}
                        </div>
                        {stageNumber === 1 && totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-10 font-pixel text-[10px] uppercase">
                                <button
                                    type="button"
                                    onClick={() => { setPage((p) => Math.max(0, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    disabled={page === 0}
                                    className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#101020] bg-[#FFFFFF] text-[#101020] hover:bg-[#FFD51A] transition-colors disabled:opacity-40 disabled:hover:bg-[#FFFFFF] disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#B45309]"
                                >
                                    <span>◀</span><span>Prev</span>
                                </button>
                                <span className="px-3 py-1 border-2 border-[#101020] bg-[#101020] text-[#FFD51A]">
                                    Page {page + 1} / {totalPages}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => { setPage((p) => Math.min(totalPages - 1, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    disabled={page === totalPages - 1}
                                    className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#101020] bg-[#FFFFFF] text-[#101020] hover:bg-[#FFD51A] transition-colors disabled:opacity-40 disabled:hover:bg-[#FFFFFF] disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#B45309]"
                                >
                                    <span>Next</span><span>▶</span>
                                </button>
                            </div>
                        )}
                        </>
                    )}
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t-2 border-[#7B97B8]">
                    <div className="flex items-center justify-between font-pixel text-[10px]">
                        {stageNumber > 1 ? (
                            <a href={stageHref(stageNumber - 1)} className="inline-flex items-center gap-2 text-[#101020] hover:text-[#B45309] transition-colors uppercase" style={{ color: stageNumber === 2 ? '#6B7280' : '#BE123C' }}>
                                <span>◀◀</span><span>STAGE {stageNumber - 1}</span>
                            </a>
                        ) : <span></span>}
                        <a href="/#stage-select" className="text-[#3A4657] hover:text-[#B45309] uppercase">★ STAGE SELECT</a>
                        {stageNumber < 3 ? (
                            <a href={stageHref(stageNumber + 1)} className="inline-flex items-center gap-2 text-[#101020] hover:text-[#B45309] transition-colors uppercase" style={{ color: stageNumber === 1 ? '#BE123C' : '#0E7490' }}>
                                <span>STAGE {stageNumber + 1}</span><span>▶▶</span>
                            </a>
                        ) : (
                            <a href="/#contact" className="inline-flex items-center gap-2 text-[#B45309] hover:text-[#101020] transition-colors uppercase">
                                <span>★ CONTACT</span><span>▶▶</span>
                            </a>
                        )}
                    </div>
                </div>

                <aside className="hidden lg:block fixed right-4 top-1/2 -translate-y-1/2 z-30">
                    <div className="pixel-border bg-sky-texture p-2 flex flex-col gap-2">
                        <div className="font-pixel text-[7px] text-[#3A4657] text-center uppercase tracking-wider mb-1 px-1">Levels</div>
                        {stageMeta.map((s, i) => {
                            const n = i + 1;
                            const bg = ['bg-[#9CA3AF]', 'bg-[#F05A6E]', 'bg-[#36CFDD]'][i];
                            const text = ['text-[#101020]', 'text-white', 'text-white'][i];
                            return (
                                <a key={n} href={stageHref(n)} className={`group flex items-center gap-2 px-2 py-2 ${bg} ${text} ${stageNumber === n ? 'ring-2 ring-[#B45309]' : 'opacity-70 hover:opacity-100'} hover:bg-[#FFD51A] hover:text-[#101020] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B45309]`} title={`Stage ${n}: ${s.name}`}>
                                    <span className="font-pixel text-xs">0{n}</span>
                                    <span className="font-pixel text-[9px] uppercase font-bold whitespace-nowrap hidden group-hover:inline">{s.name}</span>
                                </a>
                            );
                        })}
                        <a href="/#contact" className="group flex items-center gap-2 px-2 py-2 bg-[#FFD51A] text-[#101020] hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#101020] border-t-2 border-[#101020] mt-1" title="Contact">
                            <span className="font-pixel text-xs">✉</span>
                            <span className="font-pixel text-[9px] uppercase font-bold whitespace-nowrap hidden group-hover:inline">Contact</span>
                        </a>
                    </div>
                </aside>
            </div>
        </AppLayout>
    );
}