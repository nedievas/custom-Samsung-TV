/*
 * Small, self-contained remote-controlled runner Easter egg: a stork crossing the fields at
 * night, jumping hay bales and ducking crows. Everything is drawn on the canvas, so there is
 * nothing to load and nothing to fail.
 */
(function () {
    'use strict';

    var canvas = document.getElementById('runner-canvas');
    var ctx = canvas.getContext('2d');
    var t = I18n.t;

    var state = 'intro';
    var raf = 0;
    var last = 0;
    var elapsed = 0;
    var score = 0;
    var speed = 520;
    var ground = 870;
    var jumpY = 0;
    var jumpV = 0;
    var crouching = false;
    var crouchTimer = null;
    var nextObstacle = 1.8;
    var obstacles = [];
    var lastAirType = null;
    var sameTypeCount = 0;
    var obstacleCount = 0;

    // The stork's box. Standing it is taller than a crow flies (215–235px up), so a crow can only
    // be passed ducking; ducked it is 58% of that and clears both heights.
    var PLAYER_X = 235;
    var PLAYER_W = 190;
    var PLAYER_H = 260;
    var CROW_W = 135;
    var CROW_H = 125;

    var RED = '#e0503a';
    var WHITE = '#f2f2ee';
    var INK = '#15171b';

    function text(value, x, y, size, color, align, weight) {
        ctx.fillStyle = color || '#fff';
        ctx.font = (weight || 500) + ' ' + size + 'px Manrope, Arial, sans-serif';
        ctx.textAlign = align || 'left';
        ctx.fillText(value, x, y);
    }

    function playerRect(bottom) {
        var h = crouching ? PLAYER_H * 0.58 : PLAYER_H;
        return { x: PLAYER_X, y: bottom - h, w: PLAYER_W, h: h };
    }

    function obstacleRect(o) {
        if (o.air) return { x: o.x, y: ground - o.airHeight - CROW_H, w: CROW_W, h: CROW_H };
        return { x: o.x, y: ground - o.size, w: o.size, h: o.size };
    }

    function circle(x, y, r, color) {
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }

    function oval(x, y, rx, ry, rotation, color) {
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2); ctx.fill();
    }

    function triangle(ax, ay, bx, by, cx, cy, color) {
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(cx, cy); ctx.fill();
    }

    function line(ax, ay, bx, by, width, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
    }

    // Drawn in local coordinates: x from the box's left edge, y upwards from its feet (negative).
    function drawStork(bottom) {
        var low = crouching;
        var hip = low ? -60 : -110;
        var stride = jumpY > 0 ? 0 : Math.sin(elapsed * 14) * 28;
        ctx.save();
        ctx.translate(PLAYER_X, bottom);
        ctx.lineCap = 'round';

        if (jumpY > 0) {
            line(75, hip, 45, -30, 7, RED);
            line(85, hip, 60, -25, 7, RED);
        } else {
            line(75, hip, 75 + stride, 0, 7, RED);
            line(85, hip, 85 - stride, 0, 7, RED);
        }

        if (low) {
            oval(90, -85, 62, 30, 0.05, WHITE);
            oval(60, -80, 42, 17, 0, INK);
            line(135, -95, 160, -115, 14, WHITE);
            circle(165, -120, 14, WHITE);
            triangle(175, -125, 215, -115, 175, -111, RED);
            circle(169, -123, 2.6, INK);
        } else {
            oval(85, -140, 60, 34, -0.15, WHITE);
            oval(55, -132, 42, 18, -0.1, INK);
            line(125, -155, 143, -232, 15, WHITE);
            circle(145, -240, 15, WHITE);
            triangle(155, -246, 198, -234, 155, -232, RED);
            circle(149, -244, 2.6, INK);
        }
        ctx.restore();
    }

    // A round bale, as left in Lithuanian fields after the harvest.
    function drawBale(o) {
        var r = o.size / 2;
        var cx = o.x + r;
        var cy = ground - r;
        circle(cx, cy, r, '#c99b45');
        ctx.strokeStyle = '#a77a2c';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(cx, cy, r * 0.62, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2); ctx.stroke();
    }

    // Flying towards the stork, so its head is on the left. Drawn low in its box: the bottom is
    // what a standing stork's head meets.
    function drawCrow(o) {
        var r = obstacleRect(o);
        var flap = Math.sin(elapsed * 12 + o.x * 0.01);
        ctx.save();
        ctx.translate(r.x, r.y + r.h);
        triangle(108, -34, 135, -48, 135, -20, INK);
        oval(70, -34, 46, 22, 0, INK);
        circle(28, -44, 18, INK);
        triangle(12, -51, -8, -41, 12, -36, '#d9a33a');
        circle(23, -48, 3.2, WHITE);
        triangle(48, -40, 100, -40, 80, -40 - 60 * flap, '#24272d');
        ctx.restore();
    }

    /*
     * The sky never changes, so it is built once. Rebuilding it per frame allocated a gradient
     * object sixty times a second for an identical result — and large gradient fills are the one
     * thing this TV measured badly at (see the header of css/style.css).
     */
    var sky = null;

    function skyFill() {
        if (!sky) {
            sky = ctx.createLinearGradient(0, 0, 0, 1080);
            sky.addColorStop(0, '#14222e');
            sky.addColorStop(1, '#34433c');
        }
        return sky;
    }

    function draw() {
        ctx.fillStyle = skyFill();
        ctx.fillRect(0, 0, 1920, 1080);
        circle(1500, 230, 120, 'rgba(255,255,255,.06)');
        ctx.fillStyle = '#26352f';
        ctx.fillRect(0, ground, 1920, 1080 - ground);
        ctx.fillStyle = '#d4c9a1';
        ctx.fillRect(0, ground, 1920, 5);
        for (var i = 0; i < 9; i++) {
            var x = (i * 271 - (elapsed * speed * 0.22) % 271 + 1920) % 1920;
            ctx.fillStyle = 'rgba(216,229,204,.14)';
            ctx.fillRect(x, ground + 62 + (i % 3) * 23, 72, 5);
        }
        text(t('THE STORK RUN'), 120, 125, 28, 'rgba(255,255,255,.72)', 'left', 700);
        text(('0000' + Math.floor(score)).slice(-5), 1800, 130, 44, '#fff', 'right', 700);

        drawStork(ground - jumpY);
        obstacles.forEach(function (o) {
            if (o.air) drawCrow(o);
            else drawBale(o);
        });

        if (state === 'intro') {
            ctx.fillStyle = 'rgba(5,9,14,.56)'; ctx.fillRect(0, 0, 1920, 1080);
            text(t('HIDDEN GAME'), 960, 360, 28, '#d9dfd4', 'center', 700);
            text(t('Help the stork cross the fields'), 960, 450, 58, '#fff', 'center', 700);
            text(t('OK / Up: jump     Down: duck'), 960, 555, 31, '#d9dfd4', 'center', 500);
            text('OK  ' + t('Start'), 960, 700, 25, '#fff', 'center', 700);
        } else if (state === 'over') {
            ctx.fillStyle = 'rgba(5,9,14,.64)'; ctx.fillRect(0, 0, 1920, 1080);
            text(t('The stork tripped.'), 960, 440, 58, '#fff', 'center', 700);
            text(t('Distance') + '  ' + Math.floor(score), 960, 525, 32, '#d9dfd4', 'center', 500);
            text('OK  ' + t('Try again'), 960, 640, 27, '#fff', 'center', 700);
        }
    }

    function start() {
        state = 'play'; elapsed = 0; score = 0; speed = 480;
        nextObstacle = 2.2; obstacles = []; jumpY = 0; jumpV = 0;
        lastAirType = null; sameTypeCount = 0; obstacleCount = 0;
        crouching = false; clearTimeout(crouchTimer);
        last = 0;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(frame);
    }

    function jump() {
        if (state !== 'play') { start(); return; }
        if (jumpY === 0 && !crouching) jumpV = 910;
    }

    function duck() {
        if (state !== 'play' || jumpY > 0) return;
        crouching = true;
        clearTimeout(crouchTimer);
        crouchTimer = setTimeout(function () { crouching = false; }, 650);
    }

    function frame(now) {
        if (state !== 'play') return;
        var dt = Math.min((now - (last || now)) / 1000, 0.04);
        last = now;
        elapsed += dt;
        score += dt * 12;
        speed = Math.min(830, 480 + elapsed * 8);
        jumpY += jumpV * dt;
        jumpV -= 2200 * dt;
        if (jumpY < 0) { jumpY = 0; jumpV = 0; }
        nextObstacle -= dt;
        if (nextObstacle <= 0) {
            var air = obstacleCount === 0 ? false : Math.random() < 0.48;
            sameTypeCount = air === lastAirType ? sameTypeCount + 1 : 1;
            if (sameTypeCount > 2) { air = !air; sameTypeCount = 1; }
            lastAirType = air;
            obstacles.push({
                x: 1960,
                air: air,
                airHeight: Math.random() < 0.5 ? 215 : 235,
                size: obstacleCount === 0 ? 120 : (Math.random() < 0.5 ? 132 : 145)
            });
            obstacleCount++;
            nextObstacle = Math.max(1.95, 2.9 - elapsed * 0.015) + Math.random() * 0.35;
        }
        obstacles.forEach(function (o) { o.x -= speed * dt; });
        obstacles = obstacles.filter(function (o) { return o.x > -140; });
        var player = playerRect(ground - jumpY);
        obstacles.forEach(function (o) {
            var target = obstacleRect(o);
            var horizontalOverlap = player.x + player.w * 0.78 > target.x + target.w * 0.12 &&
                player.x + player.w * 0.22 < target.x + target.w * 0.88;
            var verticalOverlap = player.y + player.h > target.y + target.h * 0.08 &&
                player.y < target.y + target.h * 0.88;
            if (state === 'play' && horizontalOverlap && verticalOverlap) state = 'over';
        });
        draw();
        if (state === 'play') raf = requestAnimationFrame(frame);
    }

    /*
     * A canvas keeps whatever font it drew with, and Manrope's latin-ext files (ė, ū…) only load
     * once something asks for them. The intro and game-over screens are drawn once, so without
     * this they stay in the fallback font in Lithuanian; while playing, the next frame catches up.
     */
    function redrawWhenFontsLoad() {
        if (!document.fonts || !document.fonts.load) return;
        var sample = 'ąčęėįšųūž';
        Promise.all([document.fonts.load('700 20px Manrope', sample), document.fonts.load('500 20px Manrope', sample)])
            .then(function () { if (UI.isVisible('runner-game') && state !== 'play') draw(); }, function () {});
    }

    function show() { state = 'intro'; draw(); redrawWhenFontsLoad(); }
    function hide() { cancelAnimationFrame(raf); }

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            cancelAnimationFrame(raf);
        } else if (UI.isVisible('runner-game') && state === 'play') {
            last = 0;
            raf = requestAnimationFrame(frame);
        }
    });

    document.addEventListener('keyup', function (event) {
        if (event.keyCode !== UI.KEY.DOWN) return;
        clearTimeout(crouchTimer);
        crouching = false;
        if (UI.isVisible('runner-game') && state === 'play') draw();
    });

    UI.register('runner-game', {
        el: document.getElementById('runner-game'),
        hints: [['OK / Up', 'Jump'], ['Down', 'Duck'], ['Back', 'Home']],
        rows: function () { return []; },
        onShow: show,
        onKey: function (key) {
            if (key === UI.KEY.ENTER || key === UI.KEY.UP) { jump(); return true; }
            if (key === UI.KEY.DOWN) { duck(); return true; }
            return false;
        },
        onBack: function () { hide(); return false; }
    });
    window.RunnerGame = {
        open: function (startNow) {
            UI.show('runner-game');
            if (startNow) start();
        }
    };
})();
