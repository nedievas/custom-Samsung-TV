/*
 * Minimal fake of the Tizen APIs the launcher uses, for desktop-browser preview.
 * Does nothing when running on the TV.
 * The app names are the UE55MU6502's installed apps as its Smart Hub reports them; most ids are
 * illustrative, so use "All apps" on the TV for real ones.
 */
(function () {
    'use strict';
    if (window.tizen) return;
    window.__TIZEN_MOCK__ = true;

    function app(id, name, show) {
        return { id: id, name: name, show: show !== false, iconPath: '', categories: [], packageId: id.split('.')[0] };
    }

    var apps = [
        app('Arn0Lnchr0.Launcher', 'Arn0 Launcher'),
        app('111299001912', 'YouTube'),
        app('org.tizen.netflix-app', 'Netflix'),
        app('Go3TvApp00.Go3', 'Go3'),
        app('Viaplay000.Viaplay', 'Viaplay'),
        app('MCmYXNxgcu.DisneyPlus', 'Disney+'),
        app('org.tizen.primevideo', 'Prime Video'),
        app('AprZAARz4r.Jellyfin', 'Jellyfin'),
        app('rJeHak5zRg.Spotify', 'Spotify - Music and Podcasts'),
        app('com.samsung.tv.aria-video', 'Apple TV'),
        app('FastlinkTv.FastlinkTV', 'Fastlink.lt TV'),
        app('org.tizen.browser', 'Internet'),
        app('PlexMedia0.Plex', 'Plex'),
        app('RakutenTv0.RakutenTV', 'Rakuten TV'),
        // Noise that the consumer filter should hide
        app('tv6pbVMQFF.PrivacyChoices', 'Privacy Choices'),
        app('com.samsung.tv.ep-dataservice-app', 'ep-dataservice-app'),
        app('adplatform.ADPlayer', 'ADPlayer'),
        app('com.samsung.tv.store', 'Apps'),
        app('25emanual3.emanual', 'e-Manual'),
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
                return { appInfo: { id: 'Arn0Lnchr0.Launcher' }, exit: function () {}, hide: function () {} };
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
