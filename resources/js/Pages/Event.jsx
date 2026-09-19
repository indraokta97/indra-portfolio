import AppLayout from '../Layouts/AppLayout';
import { site } from '../data/site';

function renderRich(text) {
    const parts = [];
    const re = /(\*\*(.+?)\*\*|##(.+?)##)/g;
    let last = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
        if (m.index > last) parts.push(text.slice(last, m.index));
        if (m[2] !== undefined) {
            parts.push(<strong key={parts.length} className="font-bold text-[#B45309]">{m[2]}</strong>);
        } else {
            parts.push(<mark key={parts.length} className="bg-[#FFD51A] px-0.5 text-[#101020] font-bold">{m[3]}</mark>);
        }
        last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
}

export default function Event({ slug }) {
    const event = site.events.find(e => e.slug === slug) || site.events[0];
    const idx = site.events.findIndex(e => e.slug === event.slug);
    const prev = idx > 0 ? site.events[idx - 1] : null;
    const next = idx < site.events.length - 1 ? site.events[idx + 1] : null;

    const gallery = event.gallery || [];
    const captions = event.gallery_captions || [];

    return (
        <AppLayout title={event.event}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
                <nav className="mb-8">
                    <a href="/stage/2" className="font-pixel text-[9px] text-[#3A4657] hover:text-[#B45309] uppercase">◀ BACK</a>
                </nav>

                <h1 className="font-pixel text-2xl sm:text-3xl lg:text-4xl text-[#101020] uppercase leading-snug mb-4">{event.event}</h1>

                <div className="flex items-center gap-3 mb-6">
                    {event.role && <span className="badge-pixel">{event.role.toUpperCase()}</span>}
                    {event.period && <span className="font-pixel text-[9px] text-[#3A4657]">{event.period}</span>}
                </div>

                <p className="font-retro text-lg sm:text-xl text-[#3A4657] leading-relaxed mb-8">{event.fact}</p>

                {event.image && (
                    <div className="pixel-image w-full aspect-video overflow-hidden mb-10 border-[3px] border-[#101020] bg-[#101020]">
                        <img src={event.image} alt={event.event} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="font-pixel text-[10px] text-[#B45309]">▶ EVENT OVERVIEW</span>
                        <div className="flex-1 h-1 bg-[#FFD51A]"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {event.role && (
                            <div className="panel-pixel">
                                <div className="font-pixel text-[8px] text-[#105E3D] mb-2 uppercase">▶ Role</div>
                                <div className="font-retro text-lg text-[#101020]">{event.role}</div>
                            </div>
                        )}
                        {event.period && (
                            <div className="panel-pixel">
                                <div className="font-pixel text-[8px] text-[#105E3D] mb-2 uppercase">▶ Period</div>
                                <div className="font-retro text-lg text-[#101020]">{event.period}</div>
                            </div>
                        )}
                        <div className="panel-pixel">
                            <div className="font-pixel text-[8px] text-[#105E3D] mb-2 uppercase">▶ Status</div>
                            <div className="font-retro text-lg text-[#101020]">Completed ✓</div>
                        </div>
                    </div>
                </div>

                {event.long_description && (
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="font-pixel text-[10px] text-[#B45309]">▶ DETAILS</span>
                            <div className="flex-1 h-1 bg-[#FFD51A]"></div>
                        </div>
                        <div className="panel-pixel">
                            <div className="font-retro text-lg text-[#101020] leading-relaxed space-y-4">
                                {event.long_description.split(/\n\s*\n/).map((p, i) => (
                                    <p key={i}>{renderRich(p)}</p>
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
                                        <img src={img} alt={`${event.event} — Screen ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                                    </div>
                                    {captions[i] && <p className="font-retro text-sm text-[#3A4657] mt-2 px-1">{captions[i]}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    {prev && (
                        <a href={'/programs/' + prev.slug} className="pixel-card group flex-1 block">
                            <div className="p-4 flex items-center justify-between">
                                <div>
                                    <div className="font-pixel text-[8px] text-[#3A4657] uppercase">◀ PREV</div>
                                    <div className="font-pixel text-sm text-[#101020] group-hover:text-[#B45309] mt-1 uppercase">{prev.event}</div>
                                </div>
                            </div>
                        </a>
                    )}
                    {next && (
                        <a href={'/programs/' + next.slug} className="pixel-card group flex-1 block">
                            <div className="p-4 flex items-center justify-between">
                                <div className="text-right ml-auto">
                                    <div className="font-pixel text-[8px] text-[#3A4657] uppercase">NEXT ▶</div>
                                    <div className="font-pixel text-sm text-[#101020] group-hover:text-[#B45309] mt-1 uppercase">{next.event}</div>
                                </div>
                            </div>
                        </a>
                    )}
                </div>

                <aside className="hidden lg:block fixed right-4 top-1/2 -translate-y-1/2 z-30">
                    <div className="pixel-border bg-sky-texture p-2 flex flex-col gap-2">
                        <div className="font-pixel text-[7px] text-[#3A4657] text-center uppercase tracking-wider mb-1 px-1">Levels</div>
                        {[{ n: 1, name: 'Code', href: '/stage/1', bg: 'bg-[#9CA3AF]', text: 'text-[#101020]' }, { n: 2, name: 'Events', href: '/stage/2', bg: 'bg-[#F05A6E]', text: 'text-white' }, { n: 3, name: 'Words', href: '/stage/3', bg: 'bg-[#36CFDD]', text: 'text-white' }].map(s => (
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
