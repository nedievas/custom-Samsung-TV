/*
 * Minimal fake of the Tizen APIs the launcher uses, for desktop-browser preview.
 * Does nothing when running on the TV.
 * The apps and ids are the UE55MU6502's, as its developer app list reports them, plus a second
 * "Netflix" like the one it also lists (exact id unconfirmed; org.tizen.netflix-app here). On that TV
 * the store-format RN1MCdNq8t.Netflix is the one that only flashes to black.
 */
(function () {
    'use strict';
    if (window.tizen) return;
    window.__TIZEN_MOCK__ = true;

    function app(id, name, show) {
        return { id: id, name: name, show: show !== false, iconPath: '', categories: [], packageId: id.split('.')[0] };
    }

    var apps = [
        app('TvLauncher.Launcher', 'TV Launcher'),
        app('9Ur5IzDKqV.TizenYouTube', 'YouTube'),
        app('org.tizen.netflix-app', 'Netflix'),
        app('RN1MCdNq8t.Netflix', 'Netflix'),
        app('EZiGWpfep9.Go3', 'Go3'),
        app('niYSnzL6h1.Viaplay', 'Viaplay'),
        app('MCmYXNxgcu.DisneyPlus', 'Disney+'),
        app('evKhCgZelL.AmazonIgnitionLauncher2', 'Prime Video'),
        app('AprZAARz4r.Jellyfin', 'Jellyfin'),
        app('rJeHak5zRg.Spotify', 'Spotify - Music and Podcasts'),
        app('Y6A54cEa22.AppleTV', 'Apple TV'),
        app('BAVzq2DNIV.FastlinkltTV', 'Fastlink.lt TV'),
        app('org.tizen.browser', 'Internet'),
        app('kIciSQlYEM.plex', 'Plex'),
        app('vbUQClczfR.Wuakitv', 'Rakuten TV'),
        app('BEd6UQZYva.mggtizen', 'MEGOGO: TV, Movies, Sports'),
        app('FyObqYlHVG.SWEETTV', 'SWEET.TV'),
        // Noise that the consumer filter should hide
        app('jLU2jKvbyN.PrivacyChoices', 'Privacy Choices'),
        app('com.samsung.tv.ep-dataservice-app', 'ep-dataservice-app'),
        app('adplatform.ADPlayer', 'ADPlayer'),
        app('com.samsung.tv.store', 'Apps'),
        app('AGJFlEOkBo.emanual', 'e-Manual'),
        app('org.tizen.volume-setting', 'Volume', false)
    ];

    var sources = {
        connected: [{ type: 'TV', number: 1 }, { type: 'HDMI', number: 2 }, { type: 'HDMI', number: 4 }],
        disconnected: [{ type: 'HDMI', number: 1 }, { type: 'HDMI', number: 3 }]
    };
    var currentSource = sources.connected[0];

    function later(fn) { setTimeout(fn, 60); }

    window.tizen = {
        application: {
            getAppsInfo: function (ok) { later(function () { ok(apps.slice()); }); },
            launch: function (id, ok, err) {
                console.log('[mock] launch', id);
                if (id === 'rJeHak5zRg.Spotify') {
                    later(function () { err({ name: 'NotFoundError', message: 'Mock launch failure' }); });
                    return;
                }
                later(ok);
            },
            getCurrentApplication: function () {
                return { appInfo: { id: 'TvLauncher.Launcher' }, exit: function () {}, hide: function () {} };
            }
        },
        systeminfo: {
            getPropertyValue: function (prop, ok, err) {
                if (prop !== 'VIDEOSOURCE') { later(function () { err({ name: 'NotSupportedError', message: prop }); }); return; }
                later(function () { ok(sources); });
            }
        },
        tvwindow: {
            setSource: function (src, ok) { console.log('[mock] setSource', src); currentSource = src; later(function () { ok(src); }); },
            getSource: function () { return currentSource; },
            show: function (ok) { console.log('[mock] tvwindow.show'); later(ok); },
            hide: function (ok) { console.log('[mock] tvwindow.hide'); later(ok); }
        },
        tvinputdevice: {
            registerKey: function () {},
            registerKeyBatch: function () {},
            unregisterKey: function () {},
            getSupportedKeys: function () { return []; }
        }
    };
})();
