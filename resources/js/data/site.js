import brands from '../../data/brands.json';
import events from '../../data/events.json';
import projects from '../../data/projects.json';
import writings from '../../data/writings.json';
import profile from '../../data/profile.json';
import cv from '../../data/cv.json';

export const site = {
    profile,
    brands,
    events,
    projects,
    writings,
    cv,
};

export const stageConfig = {
    1: { name: 'Code', color: '#15803D', icon: '⚡' },
    2: { name: 'Events', color: '#BE123C', icon: '⚔' },
    3: { name: 'Words', color: '#0E7490', icon: '✎' },
};

export const itemRoute = {
    1: (slug) => `/work/${slug}`,
    2: (slug) => `/programs/${slug}`,
    3: (slug) => `/writing/${slug}`,
};

export function findItem(stageNumber, slug) {
    if (stageNumber === 1) return projects.find(p => p.slug === slug);
    if (stageNumber === 2) return events.find(e => e.slug === slug);
    if (stageNumber === 3) return writings.find(w => w.slug === slug);
    return null;
}

export function nextItem(stageNumber, slug) {
    const list = stageNumber === 1 ? projects : stageNumber === 2 ? events : writings;
    const idx = list.findIndex(i => i.slug === slug);
    if (idx === -1) return null;
    const next = list[idx + 1] || list[0];
    return next;
}

export const itemsForStage = (stageNumber) => {
    if (stageNumber === 1) return projects.filter(p => p.published).map(p => ({
        ...p,
        tags: p.tags ? p.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    }));
    if (stageNumber === 2) return events.map(e => ({ ...e, description: e.fact }));
    if (stageNumber === 3) return writings.map(w => ({ ...w, description: w.description }));
    return [];
};

export const cvPdfHtml = (() => {
    const c = cv;
    const cands = c.competencies.join(' · ');
    const tools = c.tools.join(' · ');
    const web = c.web.join(' · ');
    const leadRows = c.leadership.map(l => `
        <tr>
            <td style="font-weight:bold;width:30%">${l.role}</td>
            <td>${l.org} <span style="color:#777">(${l.period})</span></td>
        </tr>
        <tr><td colspan="2" style="padding-bottom:6px"><ul style="margin:4px 0 8px 18px">${l.points.map(p => `<li>${p}</li>`).join('')}</ul></td></tr>
    `).join('');
    const progRows = c.programs.map(p => `
        <tr>
            <td style="font-weight:bold;width:30%">${p.role}</td>
            <td>${p.org} <span style="color:#777">(${p.period})</span></td>
        </tr>
        <tr><td colspan="2" style="padding-bottom:6px"><ul style="margin:4px 0 8px 18px">${p.points.map(x => `<li>${x}</li>`).join('')}</ul></td></tr>
    `).join('');
    const certs = c.certifications.map(x => `<li><strong>${x.name}</strong> — ${x.org} (${x.period})${x.note ? ' — ' + x.note : ''}</li>`).join('');
    const awards = c.awards.map(a => `<li>${a}</li>`).join('');
    return `<!doctype html><html><head><meta charset="utf-8"><title>${c.name} — CV</title>
<style>
body { font-family: 'DejaVu Sans', sans-serif; font-size: 11px; color: #222; margin: 28px; line-height: 1.45; }
h1 { font-size: 22px; margin: 0 0 2px; }
h2 { font-size: 13px; margin: 18px 0 4px; padding: 3px 6px; background: #f0e8d4; border-left: 3px solid #b45309; }
.head { color: #555; font-size: 11px; margin-bottom: 8px; }
table { width: 100%; border-collapse: collapse; }
ul { padding-left: 18px; }
</style></head><body>
<h1>${c.name}</h1>
<div class="head">${c.headline} · ${c.email} · ${c.phone} · ${c.location}</div>
<p>${c.profile}</p>
<h2>Core Competencies</h2><p>${cands}</p>
<h2>Tools & Web Stack</h2>
<p><strong>Tools:</strong> ${tools}</p>
<p><strong>Web:</strong> ${web}</p>
<h2>Leadership</h2><table>${leadRows}</table>
<h2>Programs & Events</h2><table>${progRows}</table>
<h2>Education</h2>
<p><strong>${c.education.degree}</strong> — ${c.education.school} (${c.education.period})${c.education.note ? ' · ' + c.education.note : ''}</p>
<h2>Certifications</h2><ul>${certs}</ul>
<h2>Awards</h2><ul>${awards}</ul>
</body></html>`;
})();
