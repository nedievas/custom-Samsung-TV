/* App listing, filtering and launching on top of tizen.application. */
(function () {
    'use strict';

    // Samsung's `show` flag still lets many services through (e.g. ep-dataservice-app).
    // Store apps have ids like "AbCdEfGhIj.Name"; a few consumer apps ship preinstalled with system ids.
    var STORE_ID = /^[A-Za-z0-9]{10}\.[A-Za-z0-9_-]+$/;
    var NUMERIC_ID = /^\d{9,13}$/;
    var PRELOADED = [
        'org.tizen.netflix-app', 'org.tizen.primevideo', 'org.tizen.apple.apple-music',
        'org.tizen.browser', 'com.samsung.tv.aria-video'
    ];
    var INTERNAL = [
        'adplatform.ADPlayer', 'WykOS4t4F0.cmsWebApp', '25emanual3.emanual',
        'ZODRT12q2l.WebAccountExtension', 'ByJlgt0XeD.CastSettingsApp', 'tv6pbVMQFF.PrivacyChoices',
        '2022ePop01.SmartTV', 'w2VwCK465D.OTApp', 'J9fZJDMi1v.SecurityCenter'
    ];
    // Not "launcher": launchable() already drops this app, and Prime Video's id on the UE55MU6502 is
    // evKhCgZelL.AmazonIgnitionLauncher2.
    var NOISE = /service|worker|preview|promotion|plugin|test|sdk|^ep[ -]|factory|daemon|dummy|agent|e-?manual|account|adplayer|privacy|security/i;

    function withTimeout(promise, ms, what) {
        return new Promise(function (resolve, reject) {
            var timer = setTimeout(function () { reject(new Error(what + ': the TV did not respond')); }, ms);
            promise.then(function (v) { clearTimeout(timer); resolve(v); },
                function (e) { clearTimeout(timer); reject(e); });
        });
    }

    function selfAppId() {
        try {
            return tizen.application.getCurrentApplication().appInfo.id;
        } catch (e) {
            return null;
        }
    }

    function getInstalledApps() {
        return withTimeout(new Promise(function (resolve, reject) {
            tizen.application.getAppsInfo(resolve, reject);
        }), 8000, 'App list');
    }

    function launch(appId) {
        return withTimeout(new Promise(function (resolve, reject) {
            tizen.application.launch(appId, resolve, reject);
        }), 8000, 'Launch');
    }

    function isConsumer(app) {
        if (PRELOADED.indexOf(app.id) >= 0) return true;
        if (!app.show || INTERNAL.indexOf(app.id) >= 0) return false;
        if (!STORE_ID.test(app.id) && !NUMERIC_ID.test(app.id)) return false;
        return !NOISE.test(app.name + ' ' + app.id);
    }

    // Everything launchable with a name, minus ourselves. Curated entries match against this,
    // so any app can still be pinned by id even if the consumer filter hides it.
    function launchable(apps) {
        var self = selfAppId();
        var seen = {};
        return apps.filter(function (a) {
            if (!a.name || a.id === self || seen[a.id]) return false;
            seen[a.id] = true;
            return true;
        });
    }

    function curated(apps, cfg) {
        var used = {};
        var out = [];
        (cfg.apps || []).forEach(function (entry) {
            var re = entry.match ? new RegExp(entry.match, 'i') : null;
            var candidates = apps.filter(function (a) {
                if (used[a.id]) return false;
                if (entry.id) return a.id === entry.id;
                return re && (re.test(a.id) || re.test(a.name));
            });
            // Prefer a consumer app when several match (e.g. Netflix and a Netflix service), and
            // of two same-named ones the built-in entry (see onePerName).
            var consumers = candidates.filter(isConsumer);
            var app = consumers.find(function (a) { return !isStoreApp(a); }) || consumers[0] || candidates[0];
            if (app) {
                used[app.id] = true;
                out.push(toItem(app, entry));
            }
        });
        return out;
    }

    function isStoreApp(app) {
        return STORE_ID.test(app.id);
    }

    /*
     * Some TVs list two apps under one name: the 2017 UE55MU6502 shows two "Netflix", and the
     * store-format one (RN1MCdNq8t.Netflix) only flashes to black, so: one tile per name,
     * preferring the built-in or numeric id over the store-format one.
     */
    function onePerName(apps) {
        var best = {};
        apps.forEach(function (a) {
            var key = shortName(a.name).toLowerCase();
            if (!best[key] || (isStoreApp(best[key]) && !isStoreApp(a))) best[key] = a;
        });
        return apps.filter(function (a) { return best[shortName(a.name).toLowerCase()] === a; });
    }

    // showEverything (Yellow) lists every visible app, duplicates included, for finding things.
    function allSorted(apps, showEverything) {
        var list = showEverything ? apps.filter(function (a) { return a.show; }) : onePerName(apps.filter(isConsumer));
        return list
            .map(function (a) { return toItem(a, {}); })
            .sort(function (x, y) { return x.label.localeCompare(y.label); });
    }

    // Store names often carry a tagline: "Spotify - Music and Podcasts", "MEGOGO: TV, Movies,
    // Sports". A dash needs spaces around it, so "Spider-Man" stays whole.
    function shortName(name) {
        return name.split(/\s*[:|]\s+|\s+[-–]\s+/)[0].trim() || name;
    }

    function toItem(app, entry) {
        return {
            kind: 'app',
            id: app.id,
            label: entry.label || shortName(app.name),
            brand: entry.brand ? findBrand(entry.brand) : findBrand(app),
            iconPath: app.iconPath || ''
        };
    }

    function describe(app) {
        return {
            id: app.id, name: app.name, show: app.show, packageId: app.packageId,
            categories: app.categories ? Array.prototype.slice.call(app.categories) : [],
            iconPath: app.iconPath, version: app.version, consumer: isConsumer(app)
        };
    }

    window.Apps = {
        getInstalledApps: getInstalledApps,
        launchable: launchable,
        curated: curated,
        allSorted: allSorted,
        describe: describe,
        launch: launch,
        withTimeout: withTimeout
    };
})();
