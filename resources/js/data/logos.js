const devicon = (name) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-original.svg`;

const LOGO_RULES = [
    { match: ['laravel'], url: devicon('laravel') },
    { match: ['react'], url: devicon('react') },
    { match: ['inertia'], url: '/images/inertia-logo.svg' },
    { match: ['mysql'], url: devicon('mysql') },
    { match: ['postgres', 'postgresql', 'pgsql'], url: devicon('postgresql') },
    { match: ['sqlite'], url: devicon('sqlite') },
    { match: ['vite'], url: devicon('vitejs') },
    { match: ['tailwind'], url: devicon('tailwindcss') },
    { match: ['vanilla', 'javascript', 'alpine'], url: devicon('javascript') },
    { match: ['typescript', 'ts'], url: devicon('typescript') },
    { match: ['nginx'], url: devicon('nginx') },
    { match: ['google'], url: devicon('google') },
    { match: ['node.js', 'nodejs', 'node'], url: devicon('nodejs') },
    { match: ['github'], url: devicon('github') },
    { match: ['git'], url: devicon('git') },
    { match: ['docker', 'container'], url: devicon('docker') },
    { match: ['vercel'], url: devicon('vercel') },
    { match: ['wordpress'], url: devicon('wordpress') },
    { match: ['elementor'], url: '/images/elementor.svg' },
    { match: ['html'], url: devicon('html5') },
    { match: ['css'], url: devicon('css3') },
    { match: ['c++', 'cplusplus'], url: devicon('cplusplus') },
    { match: ['figma'], url: devicon('figma') },
    { match: ['canva'], url: devicon('canva') },
    { match: ['python'], url: devicon('python') },
    { match: ['php'], url: devicon('php') },
    { match: ['railway'], url: 'https://railway.com/brand/logo-dark.png' },
    { match: ['topas'], url: '/images/projects/topas-ion.jpg' },
    { match: ['geant'], url: '/images/projects/geant4-technologie.jpg' },
    { match: ['midtrans'], url: '/images/projects/midtrans-logo.png' },
];

export function getTagLogo(tag) {
    const lower = tag.toLowerCase();
    for (const { match, url } of LOGO_RULES) {
        if (match.some((k) => lower.includes(k))) return url;
    }
    return null;
}