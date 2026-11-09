(function () {
  // ====== UBAH DI SINI ======
  var CAPTION = 'Untuk kamu, yang selalu di hatiku';
  var COLORS = ['#ff5fa2', '#ff8fc0', '#ff3d8b', '#d96cff', '#ffb3d1'];
  // ==========================

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rand = function (a, b) { return a + Math.random() * (b - a); };

  // Font script dari Google Fonts (tetap jalan dengan fallback kalau offline)
  var font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500&display=swap';
  document.head.appendChild(font);

  // Lapisan dekorasi
  var deco = document.createElement('div');
  deco.id = 'deco';
  document.body.insertBefore(deco, document.body.firstChild);

  // Bintang
  for (var i = 0; i < 70; i++) {
    var s = document.createElement('span');
    s.className = 'star';
    var size = rand(1, 3);
    s.style.cssText =
      'left:' + rand(0, 100) + '%;top:' + rand(0, 100) + '%;' +
      'width:' + size + 'px;height:' + size + 'px;' +
      '--d:' + rand(2, 5) + 's;--delay:' + rand(0, 4) + 's;';
    deco.appendChild(s);
  }

  // Hati yang naik
  function spawnHeart(x, y) {
    var h = document.createElement('span');
    h.className = 'float-heart';
    h.textContent = '\u2665';
    h.style.left = (x !== undefined ? x : rand(0, 100) + 'vw');
    if (y !== undefined) h.style.bottom = y;
    h.style.fontSize = rand(10, 28) + 'px';
    h.style.setProperty('--c', COLORS[Math.floor(rand(0, COLORS.length))]);
    h.style.setProperty('--dur', rand(9, 16) + 's');
    h.style.setProperty('--o', rand(0.35, 0.8));
    h.style.setProperty('--sway', rand(-50, 50) + 'px');
    deco.appendChild(h);
    h.addEventListener('animationend', function () { h.remove(); });
  }

  if (!reduce) {
    for (var j = 0; j < 8; j++) setTimeout(spawnHeart, j * 700);
    setInterval(spawnHeart, 900);
  }

  // Klik = ledakan hati kecil
  document.addEventListener('click', function (e) {
    if (reduce) return;
    for (var k = 0; k < 10; k++) {
      var b = document.createElement('span');
      b.textContent = '\u2665';
      var ang = rand(0, Math.PI * 2), dist = rand(40, 110);
      b.style.cssText =
        'position:fixed;z-index:3;pointer-events:none;left:' + e.clientX + 'px;top:' + e.clientY + 'px;' +
        'color:' + COLORS[Math.floor(rand(0, COLORS.length))] + ';font-size:' + rand(12, 24) + 'px;' +
        'text-shadow:0 0 8px currentColor;transition:transform .9s ease-out,opacity .9s ease-out;';
      document.body.appendChild(b);
      (function (el, dx, dy) {
        requestAnimationFrame(function () {
          el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(.4)';
          el.style.opacity = '0';
        });
        setTimeout(function () { el.remove(); }, 1000);
      })(b, Math.cos(ang) * dist, Math.sin(ang) * dist);
    }
  });

  // Kalimat dengan efek mengetik
  var cap = document.createElement('div');
  cap.id = 'caption';
  var span = document.createElement('span');
  cap.insertBefore(span, null);
  document.body.appendChild(cap);

  if (reduce) {
    span.textContent = CAPTION;
  } else {
    var n = 0;
    setTimeout(function type() {
      span.textContent = CAPTION.slice(0, ++n);
      if (n < CAPTION.length) setTimeout(type, 90);
    }, 1500);
  }

  // ====== MUSIK ======
  var bgm = document.getElementById('bgm');
  var btn = document.getElementById('div_support');
  if (bgm && btn) {
    bgm.volume = 0.6;
    var sync = function () {
      btn.style.opacity = bgm.paused ? 0.5 : 1;
      btn.style.boxShadow = bgm.paused ? 'none' : '0 0 14px #ff7eb9';
    };
    sync();

    // Kalau file lagu tidak ketemu / tidak bisa diputar, tombol berubah jadi "!"
    bgm.addEventListener('error', function () {
      btn.textContent = '!';
      btn.style.opacity = 1;
      btn.style.borderColor = '#ff4d4d';
      btn.title = 'Lagu tidak ditemukan. Cek nama file mp3 dan lokasinya.';
    }, true);

    // Tombol: putar atau jeda
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (bgm.paused) { bgm.play().catch(function () {}); } else { bgm.pause(); }
      sync();
    });

    // Klik pertama di mana saja: mulai putar lagu
    document.addEventListener('click', function () {
      if (bgm.paused) { bgm.play().catch(function () {}); sync(); }
    }, { once: true });
  }
})();