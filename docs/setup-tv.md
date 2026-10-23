# Putting it on a TV

The launcher installs as an ordinary web app: it changes nothing about the TV's own behaviour,
and uninstalling it removes it. Open it from the app list like any other app.

## Target TV

| | |
| --- | --- |
| Model | Samsung UE55MU6502 (6 Series, 2017) |
| Platform | Tizen 3.0; web engine estimated at Chromium 47 |
| Launcher app id | `TvLauncher.Launcher` |
| Install | `.wgt` via Apps2Samsung — not yet tried on this TV |

The original launcher, Arn0 Launcher, was built and tested on a Samsung Q70B (2022, Tizen 6.5).
This fork was adapted for the older engine in the browser preview; the Lab screen's probes report
what the TV itself supports once it is installed.

## Install

Prerequisites: Node.js 20+, `zip`, and the TV in Developer Mode with this computer's IP address set
as the developer IP, on the same network.

1. Build the package:

   ```sh
   npm run build          # -> dist/tv-launcher.wgt
   ```

   `src/js/config.local.js` is included, so the TV gets your apps, consoles and weather location.

2. Install it with Apps2Samsung's **Custom WGT File** option. When updating later, use the same
   Samsung author certificate/profile as the existing installation. Apps2Samsung certificate
   options depend on its version and signing setup; do not assume that **Force Samsung
   certificate** should always be on or always be off. If an update reports an author-certificate
   mismatch, keep the current install and sort out the signing first, since uninstalling clears the
   launcher's saved settings.

3. Open it from the Samsung app list and check it works: apps launch, HDMI tiles switch inputs,
   Settings saves across a restart. Then run the Lab screen's probes (Blue) to see what this TV's
   engine supports and how smoothly it draws.

## Removing it

Uninstall it from the TV's app list like any other app. That also clears its saved settings.

**Settings ▸ Samsung Home** opens Samsung's own home screen (`com.samsung.tv.csfs`), from which TV
settings are one press away, so the TV's menus are always reachable from inside the launcher.
