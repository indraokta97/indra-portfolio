import AppLayout from '../Layouts/AppLayout';
import { site } from '../data/site';

export default function CV() {
    const cv = site.cv;
    return (
        <AppLayout title="CV">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="flex items-center gap-2 font-pixel text-[8px] text-[#3A4657] mb-8 uppercase">
                    <a href="/" className="hover:text-[#B45309]">▶ HOME</a>
                    <span>▶</span>
                    <span className="text-[#105E3D]">CV</span>
                </div>

                <div className="panel-yellow mb-6">
                    <h1 className="font-pixel text-xl sm:text-2xl text-[#101020] uppercase">{cv.name}</h1>
                    <p className="font-retro text-lg text-[#3A4657] mt-1">{cv.headline}</p>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                    <span className="badge-pixel">📧 {cv.email}</span>
                    <span className="badge-pixel">📱 {cv.phone}</span>
                    <span className="badge-pixel">📍 {cv.location}</span>
                </div>

                <div className="panel-pixel mb-6">
                    <div className="font-pixel text-[9px] text-[#105E3D] mb-2 uppercase">▶ Profile</div>
                    <p className="font-retro text-lg text-[#101020] leading-relaxed">{cv.profile}</p>
                </div>

                <div className="panel-pixel mb-6">
                    <div className="font-pixel text-[9px] text-[#105E3D] mb-2 uppercase">▶ Core Competencies</div>
                    <div className="flex flex-wrap gap-2">
                        {cv.competencies.map((c, i) => (
                            <span key={i} className="badge-pixel text-[7px]">{c}</span>
                        ))}
                    </div>
                </div>

                <div className="panel-pixel mb-6">
                    <div className="font-pixel text-[9px] text-[#105E3D] mb-2 uppercase">▶ Tools</div>
                    <div className="flex flex-wrap gap-2">
                        {cv.tools.map((t, i) => (
                            <span key={i} className="badge-pixel text-[7px]">{t}</span>
                        ))}
                    </div>
                </div>

                <div className="panel-pixel mb-6">
                    <div className="font-pixel text-[9px] text-[#105E3D] mb-2 uppercase">▶ Web Development</div>
                    <div className="flex flex-wrap gap-2">
                        {cv.web.map((w, i) => (
                            <span key={i} className="badge-pixel text-[7px]">{w}</span>
                        ))}
                    </div>
                </div>

                <div className="panel-pixel mb-6">
                    <div className="font-pixel text-[9px] text-[#105E3D] mb-2 uppercase">▶ Education</div>
                    <div className="font-retro text-lg text-[#101020]">
                        <div className="font-bold">{cv.education.degree}</div>
                        <div>{cv.education.school} · {cv.education.period}</div>
                        {cv.education.note && <div className="text-[#3A4657] text-sm">{cv.education.note}</div>}
                    </div>
                </div>

                {cv.leadership.length > 0 && (
                    <div className="panel-pixel mb-6">
                        <div className="font-pixel text-[9px] text-[#105E3D] mb-2 uppercase">▶ Leadership</div>
                        <div className="space-y-4">
                            {cv.leadership.map((l, i) => (
                                <div key={i}>
                                    <div className="font-retro text-lg text-[#101020] font-bold">{l.role} — {l.org}</div>
                                    <div className="font-pixel text-[8px] text-[#3A4657] mb-1">{l.period}</div>
                                    <ul className="list-disc list-inside font-retro text-base text-[#101020] space-y-1">
                                        {l.points.map((p, j) => <li key={j}>{p}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {cv.programs.length > 0 && (
                    <div className="panel-pixel mb-6">
                        <div className="font-pixel text-[9px] text-[#105E3D] mb-2 uppercase">▶ Programs & Events</div>
                        <div className="space-y-4">
                            {cv.programs.map((p, i) => (
                                <div key={i}>
                                    <div className="font-retro text-lg text-[#101020] font-bold">{p.role} — {p.org}</div>
                                    <div className="font-pixel text-[8px] text-[#3A4657] mb-1">{p.period}</div>
                                    <ul className="list-disc list-inside font-retro text-base text-[#101020] space-y-1">
                                        {p.points.map((pt, j) => <li key={j}>{pt}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {cv.certifications.length > 0 && (
                    <div className="panel-pixel mb-6">
                        <div className="font-pixel text-[9px] text-[#105E3D] mb-2 uppercase">▶ Certifications</div>
                        <div className="space-y-2">
                            {cv.certifications.map((c, i) => (
                                <div key={i} className="font-retro text-base text-[#101020]">
                                    <span className="font-bold">{c.name}</span> — {c.org} ({c.period}){c.note && ` · ${c.note}`}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {cv.awards.length > 0 && (
                    <div className="panel-pixel mb-6">
                        <div className="font-pixel text-[9px] text-[#105E3D] mb-2 uppercase">▶ Awards</div>
                        <ul className="list-disc list-inside font-retro text-base text-[#101020] space-y-1">
                            {cv.awards.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                    </div>
                )}

                <div className="flex gap-3 mt-8">
                    <a href="/cv/pdf" target="_blank" className="btn-pixel">▶ VIEW PDF</a>
                    <a href="/cv/pdf?download=1" className="btn-pixel btn-pixel-blue">▶ DOWNLOAD PDF</a>
                </div>
            </div>
        </AppLayout>
    );
}
