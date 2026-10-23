// Downloads brand marks and the UI font into src/. Run once; the results are kept in the repo.
// Marks are used as CSS masks, so only their shape matters (colour comes from js/brands.js).
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const SI = 'https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/';
const CBI = 'https://raw.githubusercontent.com/elax46/custom-brand-icons/a53cabf49bf439023a8f33585af30d783bffe51b/icon-svg/';

const marks = {
    netflix: SI + 'netflix.svg',
    youtube: SI + 'youtube.svg',
    primevideo: SI + 'primevideo.svg',
    appletv: SI + 'appletv.svg',
    spotify: SI + 'spotify.svg',
    plex: SI + 'plex.svg',
    twitch: SI + 'twitch.svg',
    max: SI + 'max.svg',
    crunchyroll: SI + 'crunchyroll.svg',
    dazn: SI + 'dazn.svg',
    movistar: SI + 'movistar.svg',
    playstation: SI + 'playstation.svg',
    nintendoswitch: SI + 'nintendoswitch.svg',
    disneyplus: CBI + 'disney-plus.svg',
    xbox: CBI + 'xbox.svg'
};

/*
 * Manrope, SIL Open Font License. One static file per weight rather than the variable font:
 * the 2017 TV's engine predates variable fonts and would draw everything at the file's default
 * weight, which for Manrope is 200. Latin-ext carries the Lithuanian letters (ą č ę ė į š ų ū ž).
 */
const FS = 'https://cdn.jsdelivr.net/npm/@fontsource/manrope@5.1.0/';
const fonts = { 'OFL.txt': FS + 'LICENSE' };
for (const weight of [300, 400, 500, 600, 700, 800]) {
    for (const subset of ['latin', 'latin-ext']) {
        fonts[`manrope-${subset}-${weight}.woff2`] = FS + `files/manrope-${subset}-${weight}-normal.woff2`;
    }
}

const src = resolve(import.meta.dirname, '..', 'src');

async function get(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return Buffer.from(await res.arrayBuffer());
}

await mkdir(resolve(src, 'img/marks'), { recursive: true });
await mkdir(resolve(src, 'fonts'), { recursive: true });

const lines = ['# Brand marks', '', 'Trademarks belong to their owners; used here only to identify apps and devices.', ''];
for (const [name, url] of Object.entries(marks)) {
    await writeFile(resolve(src, 'img/marks', name + '.svg'), await get(url));
    lines.push(`- ${name}.svg: ${url} (${url.startsWith(SI) ? 'Simple Icons, CC0' : 'Custom Brand Icons, MIT'})`);
    console.log('mark', name);
}
await writeFile(resolve(src, 'img/marks/SOURCES.md'), lines.join('\n') + '\n');

for (const [name, url] of Object.entries(fonts)) {
    await writeFile(resolve(src, 'fonts', name), await get(url));
    console.log('font', name);
}
