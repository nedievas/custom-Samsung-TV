/*
 * Interface text in the language chosen under Settings ▸ Appearance (Prefs.appearance.locale).
 *
 * English is the source: I18n.t('Apps') returns the entry from the selected language's table, or
 * the English text itself when there is none — so numbers and names such as '5 min' or
 * 'PlayStation' pass through untranslated. {name} placeholders are filled from params; entries
 * that need a plural are functions of params instead.
 *
 * The Lab screen stays in English: it is for development.
 */
(function () {
    'use strict';

    // Lithuanian plurals: 1, 21, 31… / 2–9, 22–29… / 0, 10–20, 30…
    function count(n, one, few, many) {
        var form = n % 10 === 1 && n % 100 !== 11 ? one :
            n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? few : many;
        return n + ' ' + form;
    }

    var LT = {
        // Home and All apps
        'Apps': 'Programos',
        'Consoles': 'Konsolės',
        'All apps': 'Visos programos',
        '{n} apps': function (p) { return count(p.n, 'programa', 'programos', 'programų'); },
        'Could not open {name}: {error}': 'Nepavyko atidaryti {name}: {error}',
        'Switching to {name}…': 'Perjungiama į {name}…',
        'Could not switch to {name}: {error}': 'Nepavyko perjungti į {name}: {error}',
        'Could not list apps: {error}': 'Nepavyko gauti programų sąrašo: {error}',

        // Remote hints
        'Back': 'Atgal',
        'Open': 'Atidaryti',
        'Settings': 'Nustatymai',
        'Home': 'Pradžia',
        'Change': 'Keisti',
        'Switch column': 'Kitas stulpelis',
        'Run': 'Vykdyti',
        'Options': 'Parinktys',
        'Select': 'Pasirinkti',
        'Select / Preview': 'Pasirinkti / Išbandyti',
        'Close': 'Uždaryti',
        'Save': 'Išsaugoti',
        'Cancel': 'Atšaukti',
        'Reorder': 'Perkelti',
        'Drop here': 'Padėti čia',
        'Add to Home': 'Pridėti į pradžią',

        // Settings overview
        'Background': 'Fonas',
        'Apps on Home': 'Programos pradžioje',
        'Appearance': 'Išvaizda',
        'Navigation sound': 'Naršymo garsas',
        'Screen saver': 'Ekrano užsklanda',
        'Advanced': 'Išplėstiniai',
        'Refresh, reset, Lab': 'Atnaujinimas, atstatymas, Lab',
        '{n} on Home': '{n} pradžioje',
        'Rotate · {interval}': 'Kaitaliojama · {interval}',
        'After {delay}': 'Po {delay}',

        // Shared chip labels
        'On': 'Įjungta',
        'Off': 'Išjungta',
        'Never': 'Niekada',
        '1 hour': '1 val.',
        '2 hours': '2 val.',
        'Try it': 'Išbandyti',

        // Background
        'Wallpaper': 'Ekrano fonas',
        'Photo': 'Nuotrauka',
        'Rotate': 'Kaitalioti',
        'Change every': 'Keisti kas',
        'Each time Home opens': 'Kaskart atidarius pradžią',
        'Daily': 'Kasdien',
        'Coast village': 'Pajūrio kaimelis',
        'Snowy valley': 'Snieguotas slėnis',
        'Forest path': 'Miško takas',
        'Aurora': 'Šiaurės pašvaistė',
        'Night sky': 'Naktinis dangus',
        'Earth at night': 'Žemė naktį',
        'Milky Way': 'Paukščių Takas',
        'Kyoto': 'Kiotas',
        'Golden hills': 'Auksinės kalvos',
        'Waterfall': 'Krioklys',

        // Appearance
        'Clock': 'Laikrodis',
        '24-hour': '24 val.',
        '12-hour': '12 val.',
        'Date': 'Data',
        'Show': 'Rodyti',
        'Hide': 'Slėpti',
        'Language': 'Kalba',
        'App names': 'Programų pavadinimai',
        'Always': 'Visada',
        'When selected': 'Kai pasirinkta',

        // Navigation sound
        'Sound': 'Garsas',
        'Style': 'Stilius',
        'Soft': 'Švelnus',
        'Warm': 'Šiltas',
        'Bright': 'Ryškus',
        'Custom': 'Savas',
        'Preview selected sound': 'Paklausyti pasirinkto garso',

        // Screen saver
        'Start after': 'Įsijungia po',
        'Change photo every': 'Keisti nuotrauką kas',
        'Go dark after': 'Užtemsta po',
        'Show it now': 'Rodyti dabar',

        // Apps on Home editor
        'On Home · {n}': 'Pradžioje · {n}',
        'Add apps · {n}': 'Pridėti programų · {n}',
        'Added {name} to Home': '{name} pridėta į pradžią',
        'Move': 'Perkelti',
        'Remove from Home': 'Pašalinti iš pradžios',
        'Home needs at least one app': 'Pradžioje turi likti bent viena programa',

        // Hidden apps
        'Hidden apps': 'Paslėptos programos',
        'Hide app': 'Slėpti programą',
        'Show again': 'Rodyti vėl',
        '{name} is hidden': '{name} paslėpta',
        '{name} is shown again': '{name} vėl rodoma',
        'No hidden apps': 'Paslėptų programų nėra',

        // Consoles
        'Hidden': 'Paslėpta',
        'TV input': 'TV įvestis',
        'Game Mode works': 'veikia žaidimo režimas',
        'Inside the launcher': 'Paleidiklio viduje',
        'Back returns here': 'Atgal grąžina čia',
        'None': 'Nėra',
        '+ Add a console': '+ Pridėti konsolę',
        'Console': 'Konsolė',
        'Rename': 'Pervadinti',
        'Name': 'Pavadinimas',
        'HDMI port': 'HDMI jungtis',
        'connected': 'prijungta',
        'Logo': 'Logotipas',
        'Opens': 'Atidaroma',
        'Show on Home': 'Rodyti pradžioje',
        'Hide from Home': 'Slėpti iš pradžios',
        'Move earlier': 'Perkelti aukščiau',
        'Move later': 'Perkelti žemiau',
        'Remove': 'Pašalinti',
        'Remove {name}?': 'Pašalinti „{name}“?',

        // Hidden game
        'THE STORK RUN': 'GANDRO BĖGIMAS',
        'HIDDEN GAME': 'SLAPTAS ŽAIDIMAS',
        'Help the stork cross the fields': 'Padėk gandrui perbėgti laukus',
        'OK / Up: jump     Down: duck': 'OK / Aukštyn: šuolis     Žemyn: pritūpti',
        'Start': 'Pradėti',
        'The stork tripped.': 'Gandras suklupo.',
        'Distance': 'Atstumas',
        'Try again': 'Bandyti dar kartą',
        'OK / Up': 'OK / Aukštyn',
        'Jump': 'Šuolis',
        'Down': 'Žemyn',
        'Duck': 'Pritūpti',

        // Advanced
        'Refresh app list': 'Atnaujinti programų sąrašą',
        'After installing or removing apps': 'Įdiegus ar pašalinus programas',
        'Refreshing the app list…': 'Atnaujinamas programų sąrašas…',
        'App list refreshed': 'Programų sąrašas atnaujintas',
        'Export settings': 'Eksportuoti nustatymus',
        'Sends them to the log on your computer': 'Išsiunčia į žurnalą kompiuteryje',
        'Settings sent to your computer': 'Nustatymai išsiųsti į kompiuterį',
        'Reset all settings': 'Atstatyti visus nustatymus',
        'Back to the defaults': 'Grąžinti numatytuosius',
        'Reset all settings?': 'Atstatyti visus nustatymus?',
        'Reset': 'Atstatyti',
        'Developer tests': 'Kūrėjo testai'
    };

    var TABLES = { 'lt-LT': LT };

    function table() {
        return TABLES[Appearance.locale(Prefs.get().appearance.locale).key];
    }

    function t(text, params) {
        var tbl = table();
        var entry = tbl && tbl[text];
        if (typeof entry === 'function') return entry(params || {});
        var out = entry || text;
        if (!params) return out;
        return out.replace(/\{(\w+)\}/g, function (m, key) { return params[key]; });
    }

    // Elements marked data-i18n keep their English in the attribute, so this can run again on
    // every language change. An empty attribute takes the element's text the first time.
    function apply() {
        document.documentElement.lang = Appearance.locale(Prefs.get().appearance.locale).key.slice(0, 2);
        Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (node) {
            if (!node.getAttribute('data-i18n')) node.setAttribute('data-i18n', node.textContent);
            node.textContent = t(node.getAttribute('data-i18n'));
        });
    }

    window.I18n = { t: t, apply: apply };
})();
