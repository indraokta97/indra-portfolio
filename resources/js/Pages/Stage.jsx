import AppLayout from '../Layouts/AppLayout';
import { site } from '../data/site';

const stageMeta = [
    { name: 'Code', icon: '⚡', color: '#73DC57', ring: '#105E3D' },
    { name: 'Events', icon: '⚔', color: '#F05A6E', ring: '#BE123C' },
    { name: 'Words', icon: '✎', color: '#36CFDD', ring: '#0E7490' },
];

const logoMap = {
    laravel: '/images/brands/laravel.svg', php: '/images/brands/php.svg',
    javascript: '/images/brands/javascript.svg', js: '/images/brands/javascript.svg',
    html: '/images/brands/html-css.svg', css: '/images/brands/html-css.svg',
    tailwind: '/images/brands/tailwind-css.svg', tailwindcss: '/images/brands/tailwind-css.svg',
    mysql: '/images/brands/mysql.svg', git: '/images/brands/git.svg',
    figma: '/images/brands/figma.svg', canva: '/images/brands/canva.svg',
    corel: '/images/brands/coreldraw.svg', coreldraw: '/images/brands/coreldraw.svg',
    python: '/images/brands/python.svg',
};

const getTagLogo = (tag) => {
    const lower = tag.toLowerCase();
    for (const [key, url] of Object.entries(logoMap)) {
        if (lower.includes(key)) return url;
    }
    return null;
};

const getStageLink = (stageNumber) => {
    const lower = stageMeta[stageNumber - 1].name.toLowerCase();
    if (stageNumber === 1) return `/work/`;
    if (stageNumber === 2) return `/programs/`;
    return `/writing/`;
};

export default function Stage({ stageNumber }) {
    const meta = stageMeta[stageNumber - 1];
    const stageName = meta.name;
    const stageColor = meta.color;
    const stageIcon = meta.icon;
    const items = stageNumber === 1 ? site.projects :
                  stageNumber === 2 ? site.events :
                  site.writings;
    const parsedItems = stageNumber === 1 ? items.map(p => ({
        ...p,
        tags: p.tags ? (typeof p.tags === 'string' ? p.tags.split(',').map(t => t.trim()).filter(Boolean) : p.tags) : []
    })) : items;
    const itemsToShow = stageNumber === 1 ? parsedItems : items;
    const itemLinkPrefix = stageNumber === 1 ? '/work/' :
                           stageNumber === 2 ? '/programs/' :
                           '/writing/';
    const stageHref = (n) => `/stage/${n}`;

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {itemsToShow.map((item) => (
                            <a key={item.slug} href={itemLinkPrefix + item.slug} className="pixel-card group block focus:outline-none focus:ring-2 focus:ring-[#B45309] overflow-hidden">
                                {item.image && (
                                    <div className="aspect-video overflow-hidden border-b-3 border-[#101020]">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" style={{ imageRendering: 'pixelated' }} />
                                    </div>
                                )}
                                <div className="p-4">
                                    {stageNumber === 1 && item.tags && item.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                            {item.tags.slice(0, 5).map((tag, i) => {
                                                const logo = getTagLogo(tag);
                                                return logo ? (
                                                    <img key={i} src={logo} alt={tag} className="w-5 h-5" title={tag.toUpperCase()} />
                                                ) : (
                                                    <span key={i} className="font-pixel text-[7px] px-1.5 py-0.5 bg-[#027AE9] text-white border border-[#101020]">{tag.toUpperCase()}</span>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {stageNumber === 2 && item.role && (
                                        <div className="font-pixel text-[8px] text-[#BE123C] uppercase mb-1.5">▶ {item.role}</div>
                                    )}
                                    {stageNumber === 3 && item.outlet && (
                                        <div className="font-pixel text-[8px] text-[#0E7490] uppercase mb-1.5">▶ {item.outlet}</div>
                                    )}
                                    <h3 className="font-display text-sm sm:text-base text-[#101020] group-hover:text-[#B45309] transition-colors leading-snug mb-1">{item.title}</h3>
                                    <p className="font-retro text-xs text-[#3A4657] leading-snug line-clamp-2">{item.description}</p>
                                    {(item.year || item.period) && (
                                        <div className="mt-2 font-pixel text-[7px] text-[#55607A] uppercase">{item.year || item.period}</div>
                                    )}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t-2 border-[#7B97B8]">
                    <div className="flex items-center justify-between font-pixel text-[10px]">
                        {stageNumber > 1 ? (
                            <a href={stageHref(stageNumber - 1)} className="inline-flex items-center gap-2 text-[#101020] hover:text-[#B45309] transition-colors uppercase" style={{ color: stageNumber === 2 ? '#15803D' : '#BE123C' }}>
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
                            const bg = ['bg-[#73DC57]', 'bg-[#F05A6E]', 'bg-[#36CFDD]'][i];
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
