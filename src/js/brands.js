/*
 * Tile styling per brand. `match` is tested against "<name> <id>" of an installed app.
 * `mark` is a file in img/marks/; the build recolours it in `fg` (img/tiles/<key>.svg), shown over `bg`.
 * `image` instead of `mark` is a ready-made file in img/tiles/, used as is (not recoloured).
 * `text` instead of `mark` draws a typographic logo (for brands without an available mark).
 * `pad` optionally overrides the mark's [vertical, horizontal] inset in % of the tile (default [26, 22]).
 */
window.BRANDS = [
    { key: 'youtube', match: /youtube|tizentube|cobalt-yt/i, mark: 'youtube', bg: '#e62117', fg: '#fff' },
    { key: 'netflix', match: /netflix/i, mark: 'netflix', bg: '#141414', fg: '#e50914' },
    { key: 'primevideo', match: /prime ?video|amazon ?(tv|video)|amazonignition/i, mark: 'primevideo', bg: 'linear-gradient(135deg,#0b4f7a,#1aa0e0)', fg: '#fff', pad: [12, 10] },
    { key: 'disneyplus', match: /disney/i, mark: 'disneyplus', bg: 'linear-gradient(135deg,#091550,#1f5bd8)', fg: '#fff' },
    { key: 'appletv', match: /apple ?tv|aria-video/i, mark: 'appletv', bg: '#1c1c1e', fg: '#fff' },
    { key: 'spotify', match: /spotify/i, mark: 'spotify', bg: '#121212', fg: '#1ed760' },
    { key: 'plex', match: /plex/i, mark: 'plex', bg: '#1f1f1f', fg: '#e5a00d', pad: [16, 12] },
    { key: 'jellyfin', match: /jellyfin/i, mark: 'jellyfin', bg: 'linear-gradient(135deg,#aa5cc3,#00a4dc)', fg: '#fff' },
    { key: 'viaplay', match: /viaplay/i, mark: 'viaplay', bg: '#1b1020', fg: '#fe365f' },
    { key: 'rakutentv', match: /rakuten/i, mark: 'rakuten', bg: '#bf0000', fg: '#fff' },
    // White logo lifted from the Fastlink TV app icon (img/marks/fastlink-tv-icon.png), on its teal.
    { key: 'fastlink', match: /fastlink/i, image: 'fastlink.png', bg: '#00a19b', fg: '#fff', pad: [8, 20] },
    // Go3's own two-colour logo (white Go, red 3), so it is not recoloured.
    { key: 'go3', match: /(^|\s)go3\b/i, image: 'go3.svg', bg: '#18181d', fg: '#fff' },

    // Consoles (used by inputs in config.js)
    // Telia Play has no app for Tizen before 9.0, so on this TV it is a Telia box on HDMI.
    // Only the play-button pebble from the logo (img/marks/teliaplay-logo.png), on the purples from
    // teliaplay.lt's stylesheet (--purple-550 to --purple-700).
    { key: 'teliaplay', image: 'teliaplay.png', bg: 'linear-gradient(135deg,#7a08b5,#990ae3)', fg: '#fff' },
    { key: 'playstation', mark: 'playstation', bg: 'linear-gradient(135deg,#00205c,#0070d1)', fg: '#fff' },
    { key: 'xbox', mark: 'xbox', bg: 'linear-gradient(135deg,#0a3a0a,#16a016)', fg: '#fff' },
    { key: 'switch', mark: 'nintendoswitch', bg: 'linear-gradient(135deg,#b3000e,#ff2a2a)', fg: '#fff' }
];

window.findBrand = function (keyOrApp) {
    if (typeof keyOrApp === 'string') {
        return window.BRANDS.find(function (b) { return b.key === keyOrApp; }) || null;
    }
    var text = (keyOrApp.name || '') + ' ' + (keyOrApp.id || '');
    return window.BRANDS.find(function (b) { return b.match && b.match.test(text); }) || null;
};
