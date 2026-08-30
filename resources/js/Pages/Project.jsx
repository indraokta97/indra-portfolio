import AppLayout from '../Layouts/AppLayout';
import { site } from '../data/site';
import { getTagLogo } from '../data/logos';

export default function Project({ slug }) {
    const project = site.projects.find(p => p.slug === slug) || site.projects[0];
    const next = site.projects.find(p => p.slug !== project.slug);

    const tags = typeof project.tags === 'string' 
        ? project.tags.split(',').map(t => t.trim()).filter(Boolean) 
        : (project.tags || []);
    const captions = project.gallery_captions || [];
    const gallery = project.gallery || [];

    return (
        <AppLayout title={project.title}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
                <nav className="flex items-center gap-2 font-pixel text-[8px] text-[#3A4657] mb-8 uppercase">
                    <a href="/" className="hover:text-[#B45309]">▶ HOME</a>
                    <span>▶</span>
                    <a href="/stage/1" className="hover:text-[#B45309]">▶ STAGE 1</a>
                    <span>▶</span>
                    <span className="text-[#105E3D]">{project.title.toUpperCase()}</span>
                </nav>

                <h1 className="font-pixel text-2xl sm:text-3xl lg:text-4xl text-[#101020] uppercase leading-snug mb-4">{project.title}</h1>

                <div className="flex items-center gap-3 mb-6">
                    <span className="badge-pixel">{project.category?.toUpperCase()}</span>
                    <span className="font-pixel text-[9px] text-[#3A4657]">{project.year}</span>
                    <span className="font-pixel text-[9px] text-[#105E3D]">SHIPPED ✓</span>
                </div>

                <p className="font-retro text-lg sm:text-xl text-[#3A4657] leading-relaxed mb-8">{project.description}</p>

                <div className="pixel-image w-full aspect-video overflow-hidden mb-10 border-[3px] border-[#101020] bg-[#101020]">
                    {project.youtube_link ? (
                        <iframe src={project.youtube_link} className="w-full h-full" frameBorder="0" allowFullScreen loading="lazy"></iframe>
                    ) : /\.(mp4|webm|ogg)$/i.test(project.image) ? (
                        <video src={project.image} className="w-full h-full object-cover" autoPlay loop muted playsInline poster={project.poster}></video>
                    ) : (
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    )}
                </div>

                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="font-pixel text-[10px] text-[#B45309]">▶ PROJECT OVERVIEW</span>
                        <div className="flex-1 h-1 bg-[#FFD51A]"></div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {tags.length > 0 && (
                            <div className="panel-pixel">
                                <div className="font-pixel text-[8px] text-[#105E3D] mb-2 uppercase">▶ Stack</div>
                                <div className="flex flex-wrap gap-2.5">
                                    {tags.map((tag, i) => {
                                        const logo = getTagLogo(tag);
                                        return logo ? (
                                            <img key={i} src={logo} alt={tag} title={tag.toUpperCase()} loading="lazy" className="w-7 h-7 object-contain" style={{ filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.25))' }} />
                                        ) : (
                                            <span key={i} className="font-pixel text-[7px] px-1.5 py-0.5 bg-[#027AE9] text-white border border-[#101020]">{tag.toUpperCase()}</span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                    {(project.link || project.github_link || project.youtube_link) && (
                        <div className="flex flex-wrap gap-3 mt-4">
                            {project.link && <a href={project.link} target="_blank" rel="noopener" className="btn-pixel">▶ LIVE DEMO</a>}
                            {project.github_link && <a href={project.github_link} target="_blank" rel="noopener" className="btn-pixel btn-pixel-blue">▶ SOURCE CODE</a>}
                            {project.youtube_link && <a href={project.youtube_link} target="_blank" rel="noopener" className="btn-pixel btn-pixel-red">▶ VIDEO DEMO</a>}
                        </div>
                    )}
                </div>

                {project.long_description && (
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="font-pixel text-[10px] text-[#B45309]">▶ DETAILS</span>
                            <div className="flex-1 h-1 bg-[#FFD51A]"></div>
                        </div>
                        <div className="panel-pixel">
                            <div className="font-retro text-lg text-[#101020] leading-relaxed space-y-5">
                                {project.long_description.split(/\n\s*\n/).map((p, i) => (
                                    <div key={i}>
                                        {p.split('\n').map((line, j) => {
                                            const trimmed = line.trim();
                                            if (trimmed.startsWith('•')) {
                                                return (
                                                    <div key={j} className="flex gap-2 items-start">
                                                        <span className="text-[#027AE9] shrink-0">•</span>
                                                        <span>{trimmed.slice(1).trim()}</span>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div key={j} className="font-pixel text-[10px] text-[#B45309] mt-4 mb-1.5 first:mt-0 uppercase">{trimmed}</div>
                                            );
                                        })}
                                    </div>
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
                                        <img src={img} alt={`${project.title} — Screen ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                                    </div>
                                    {captions[i] && <p className="font-retro text-sm text-[#3A4657] mt-2 px-1">{captions[i]}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {next && (
                    <a href={'/work/' + next.slug} className="pixel-card group block mt-8">
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <div className="font-pixel text-[8px] text-[#105E3D] uppercase">▶ NEXT QUEST</div>
                                <div className="font-pixel text-sm text-[#101020] group-hover:text-[#B45309] mt-1 uppercase">{next.title}</div>
                            </div>
                            <div className="font-pixel text-[10px] text-[#B45309]">▶▶</div>
                        </div>
                    </a>
                )}

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
