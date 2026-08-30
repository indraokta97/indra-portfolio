import AppLayout from '../Layouts/AppLayout';
import { site } from '../data/site';

export default function Writing({ slug }) {
    const writing = site.writings.find(w => w.slug === slug) || site.writings[0];
    const next = site.writings.find(w => w.slug !== writing.slug);

    const gallery = writing.gallery || [];
    const captions = writing.gallery_captions || [];

    return (
        <AppLayout title={writing.title}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
                <nav className="flex items-center gap-2 font-pixel text-[8px] text-[#3A4657] mb-8 uppercase">
                    <a href="/" className="hover:text-[#B45309]">▶ HOME</a>
                    <span>▶</span>
                    <a href="/stage/3" className="hover:text-[#B45309]">▶ STAGE 3</a>
                    <span>▶</span>
                    <span className="text-[#0E7490]">{writing.title.toUpperCase()}</span>
                </nav>

                <h1 className="font-pixel text-2xl sm:text-3xl lg:text-4xl text-[#101020] uppercase leading-snug mb-4">{writing.title}</h1>

                <div className="flex items-center gap-3 mb-6">
                    {writing.outlet && <span className="badge-pixel">{writing.outlet.toUpperCase()}</span>}
                </div>

                <p className="font-retro text-lg sm:text-xl text-[#3A4657] leading-relaxed mb-8">{writing.description}</p>

                {writing.image && (
                    <div className="pixel-image w-full aspect-video overflow-hidden mb-10 border-[3px] border-[#101020] bg-[#101020]">
                        <img src={writing.image} alt={writing.title} className="w-full h-full object-cover" />
                    </div>
                )}

                {writing.link && (
                    <div className="mb-6">
                        <a href={writing.link} target="_blank" rel="noopener" className="btn-pixel">▶ READ ARTICLE</a>
                    </div>
                )}

                {writing.long_description && (
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="font-pixel text-[10px] text-[#B45309]">▶ FULL ARTICLE</span>
                            <div className="flex-1 h-1 bg-[#FFD51A]"></div>
                        </div>
                        <div className="panel-pixel">
                            <div className="font-retro text-lg text-[#101020] leading-relaxed space-y-4">
                                {writing.long_description.split(/\n\s*\n/).map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {gallery.length > 0 && (
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="font-pixel text-[10px] text-[#B45309]">▶ KEY SCREENS</span>
                            <div className="flex-1 h-1 bg-[#FFD51A]"></div>
                        </div>
                        <div className="space-y-6">
                            {gallery.map((img, i) => (
                                <div key={i}>
                                    <div className="pixel-image w-full aspect-video overflow-hidden border-[3px] border-[#101020] bg-[#101020]">
                                        <img src={img} alt={`${writing.title} — Screen ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                                    </div>
                                    {captions[i] && <p className="font-retro text-sm text-[#3A4657] mt-2 px-1">{captions[i]}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {next && (
                    <a href={'/writing/' + next.slug} className="pixel-card group block mt-8">
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <div className="font-pixel text-[8px] text-[#0E7490] uppercase">▶ NEXT QUEST</div>
                                <div className="font-pixel text-sm text-[#101020] group-hover:text-[#B45309] mt-1 uppercase">{next.title}</div>
                            </div>
                            <div className="font-pixel text-[10px] text-[#B45309]">▶▶</div>
                        </div>
                    </a>
                )}

                <aside className="hidden lg:block fixed right-4 top-1/2 -translate-y-1/2 z-30">
                    <div className="pixel-border bg-sky-texture p-2 flex flex-col gap-2">
                        <div className="font-pixel text-[7px] text-[#3A4657] text-center uppercase tracking-wider mb-1 px-1">Levels</div>
                        {[{ n: 1, name: 'Code', href: '/stage/1', bg: 'bg-[#73DC57]', text: 'text-[#101020]' }, { n: 2, name: 'Events', href: '/stage/2', bg: 'bg-[#F05A6E]', text: 'text-white' }, { n: 3, name: 'Words', href: '/stage/3', bg: 'bg-[#36CFDD]', text: 'text-white' }].map(s => (
                            <a key={s.n} href={s.href} className={`group flex items-center gap-2 px-2 py-2 ${s.bg} ${s.text} hover:bg-[#FFD51A] hover:text-[#101020] transition-colors`}>
                                <span className="font-pixel text-xs">0{s.n}</span>
                                <span className="font-pixel text-[9px] uppercase font-bold whitespace-nowrap hidden group-hover:inline">{s.name}</span>
                            </a>
                        ))}
                        <a href="/#contact" className="group flex items-center gap-2 px-2 py-2 bg-[#FFD51A] text-[#101020] hover:bg-white transition-colors border-t-2 border-[#101020] mt-1">
                            <span className="font-pixel text-xs">✉</span>
                            <span className="font-pixel text-[9px] uppercase font-bold whitespace-nowrap hidden group-hover:inline">Contact</span>
                        </a>
                    </div>
                </aside>
            </div>
        </AppLayout>
    );
}
