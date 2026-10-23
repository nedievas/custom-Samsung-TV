/* Clock and date settings (Prefs.appearance). The font is fixed: Manrope, set in css/style.css. */
(function () {
    'use strict';

    // shortMonth is the month style for the screen saver's short date. Lithuanian has no
    // abbreviated month names, so 'short' comes out as digits ("10-23, pn").
    var LOCALES = [
        { key: 'en-GB', label: 'English', shortMonth: 'short' },
        { key: 'lt-LT', label: 'Lietuvių', shortMonth: 'long' }
    ];

    function prefs() { return Prefs.get().appearance; }

    function locale(key) {
        return LOCALES.find(function (l) { return l.key === key; }) || LOCALES[0];
    }

    // Not String.prototype.padStart: the 2017 TV's engine (about Chromium 47) predates it.
    function pad(n) { return (n < 10 ? '0' : '') + n; }

    // Returns { time: '16:05', suffix: '' } or { time: '4:05', suffix: 'PM' }.
    function time(d) {
        if (prefs().clock === '12h') {
            var h = d.getHours() % 12 || 12;
            return { time: h + ':' + pad(d.getMinutes()), suffix: d.getHours() < 12 ? 'AM' : 'PM' };
        }
        return { time: pad(d.getHours()) + ':' + pad(d.getMinutes()), suffix: '' };
    }

    function date(d) {
        try {
            var text = d.toLocaleDateString(locale(prefs().locale).key, { weekday: 'long', day: 'numeric', month: 'long' });
            return text.charAt(0).toUpperCase() + text.slice(1);
        } catch (e) {
            return d.toDateString();
        }
    }

    function apply() {
        var p = prefs();
        var home = document.getElementById('home');
        home.classList.toggle('names-focused', p.names === 'focused');
        home.classList.toggle('names-never', p.names === 'never');
        home.classList.toggle('no-date', !p.showDate);
        I18n.apply();
    }

    window.Appearance = {
        LOCALES: LOCALES,
        locale: locale,
        time: time,
        date: date,
        apply: apply
    };
})();
