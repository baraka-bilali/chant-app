/* Recueil CMI — download site */
(function () {
  'use strict';

  // ---- Settings you may need to change ------------------------------------
  var CONFIG = {
    // Address of the web app (PWA) deployed on Vercel.
    pwaUrl: 'https://chant-app.vercel.app',
    // APK file served by this site (see site/downloads/).
    apkPath: '/downloads/recueil-cmi.apk',
    version: '2.0.0',
    apkSize: '25 Mo',
    whatsapp: '243980139630',
    email: 'techcmk11@gmail.com',
  };
  // --------------------------------------------------------------------------

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Links and texts from CONFIG ---------- */
  $$('[data-pwa]').forEach(function (a) { a.href = CONFIG.pwaUrl; });
  $$('[data-apk]').forEach(function (a) { a.href = CONFIG.apkPath; });
  $$('[data-apk-size]').forEach(function (el) { el.textContent = CONFIG.apkSize; });
  $$('[data-version]').forEach(function (el) { el.textContent = CONFIG.version; });
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  var subject = 'Recueil CMI — signaler un problème';
  $$('[data-whatsapp]').forEach(function (a) {
    a.href = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(subject);
  });
  $$('[data-email]').forEach(function (a) {
    a.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(subject);
  });
  try {
    var host = new URL(CONFIG.pwaUrl).host;
    var hostEl = $('#pwa-host');
    if (hostEl) hostEl.textContent = host + ' · aucune installation requise';
  } catch (e) {}

  /* ---------- Theme (light / dark / system) ---------- */
  var root = document.documentElement;
  var themeButtons = $$('[data-theme-choice]');
  function currentChoice() {
    var t = root.getAttribute('data-theme');
    return t === 'light' || t === 'dark' ? t : 'system';
  }
  function paintThemeButtons() {
    var c = currentChoice();
    themeButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-theme-choice') === c)); });
  }
  themeButtons.forEach(function (b) {
    b.addEventListener('click', function () {
      var c = b.getAttribute('data-theme-choice');
      if (c === 'system') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', c);
      try { localStorage.setItem('site_theme', c); } catch (e) {}
      paintThemeButtons();
    });
  });
  paintThemeButtons();

  /* ---------- Header ---------- */
  var header = $('.header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var burger = $('#burger');
  var nav = $('#nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  /* ---------- QR codes ---------- */
  function qrSvg(text) {
    var qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    var n = qr.getModuleCount();
    var d = '';
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        if (qr.isDark(r, c)) d += 'M' + c + ' ' + r + 'h1v1h-1z';
      }
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + n + ' ' + n + '" shape-rendering="crispEdges"><path fill="#0b1530" d="' + d + '"/></svg>';
  }
  function renderQr(id, text) {
    var el = document.getElementById(id);
    if (!el) return;
    try { el.innerHTML = qrSvg(text); } catch (e) { el.textContent = 'QR indisponible'; }
  }
  var apkAbsolute = new URL(CONFIG.apkPath, window.location.origin).href;
  renderQr('qr-apk', apkAbsolute);
  renderQr('qr-web', CONFIG.pwaUrl);

  /* ---------- "How to install" tabs ---------- */
  var howTabs = $$('[data-how]');
  howTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var key = tab.getAttribute('data-how');
      howTabs.forEach(function (t) { t.setAttribute('aria-selected', String(t === tab)); });
      $$('[data-how-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-how-panel') !== key; });
    });
  });
  // Preselect the tab matching the visitor's device.
  (function () {
    var ua = navigator.userAgent;
    var key = /iPhone|iPad|iPod/.test(ua) ? 'ios' : /Android/.test(ua) ? 'android' : /Mobi/.test(ua) ? 'ios' : 'desktop';
    var tab = $('[data-how="' + key + '"]');
    if (tab) tab.click();
  })();

  /* ---------- Feature explorer ---------- */
  var ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    book: '<path d="M12 6c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-13C17 4 14 4.5 12 6z"/><path d="M12 6v13"/>',
    text: '<path d="M4 19l5-14 5 14M6 14h6M17 9v8M13.5 12.5h7"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    moon: '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/>',
    wifi: '<path d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01M3 3l18 18"/>',
    heart: '<path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9z"/>',
  };
  var FEATURES = [
    { icon: 'search', label: 'Recherche instantanée', img: 'search.png',
      title: 'Trouvez un chant en un instant',
      desc: 'Tapez un numéro, un titre ou quelques mots des paroles : la liste se filtre pendant que vous écrivez.',
      points: ['Par numéro, titre ou paroles', 'Sans tenir compte des accents ni des majuscules', 'Un bouton ✕ pour tout effacer d’un geste'] },
    { icon: 'book', label: 'Lecture confortable', img: 'song-dark.png',
      title: 'Des paroles claires, faites pour chanter',
      desc: 'Les couplets sont numérotés et le refrain est mis en valeur, une seule fois, juste après le premier couplet.',
      points: ['Couplets numérotés', 'Refrain encadré, sans répétitions inutiles', 'Mise en page aérée, facile à suivre'] },
    { icon: 'text', label: 'Taille du texte', img: 'song-big.png',
      title: 'Agrandissez le texte selon vos yeux',
      desc: 'Deux boutons, A- et A+, pour lire confortablement, de près comme à distance.',
      points: ['De petit à très grand', 'Le numéro de couplet suit la taille', 'Votre choix est mémorisé'] },
    { icon: 'list', label: 'Playlists', img: 'playlists.png',
      title: 'Préparez vos cultes et vos veillées',
      desc: 'Créez vos listes de chants : culte du dimanche, veillée de prière, louange en famille…',
      points: ['Ajoutez un chant depuis sa page', 'Retrouvez vos listes en un geste', 'Enregistrées sur votre téléphone'] },
    { icon: 'globe', label: 'Plusieurs langues', img: 'languages.png',
      title: 'Chantez dans la langue de votre cœur',
      desc: 'Plus de 850 cantiques en français, anglais, kiswahili, lingala, tshiluba et kikongo.',
      points: ['854 chants dans le recueil', 'Six langues de nos assemblées', 'Cherchez dans toutes les langues à la fois'] },
    { icon: 'moon', label: 'Clair ou sombre', img: 'song-light.png',
      title: 'Lisible de jour comme de nuit',
      desc: 'Passez du thème clair au thème sombre d’un simple toucher, pour ne pas fatiguer les yeux.',
      points: ['Thème clair ou sombre', 'Idéal pour les veillées', 'Votre préférence est mémorisée'] },
    { icon: 'wifi', label: 'Sans internet', img: 'offline.png',
      title: 'Aucune connexion nécessaire',
      desc: 'Tous les chants sont déjà dans l’application. Lisez-les partout, sans forfait.',
      points: ['Fonctionne hors ligne', 'Rien à charger ni à attendre', 'Parfait à l’église ou en voyage'] },
    { icon: 'heart', label: 'En famille', img: 'family.png',
      title: 'Chantez ensemble, en famille',
      desc: 'Une courte introduction vous guide au premier lancement, avec des conseils et un moyen de nous contacter.',
      points: ['Conseils au premier lancement', 'Contact WhatsApp et e-mail intégré', 'Pour toute la famille'] },
  ];

  var tabsEl = $('#tabs');
  var stageA = $('#stage-a');
  var stageB = $('#stage-b');
  var stageText = $('#stage-text');
  var titleEl = $('#stage-title');
  var descEl = $('#stage-desc');
  var pointsEl = $('#stage-points');
  var current = 0;
  var timer = null;
  var userTookOver = false;
  var tabButtons = [];

  function svgIcon(name) {
    return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
  }

  FEATURES.forEach(function (f, i) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tab';
    btn.setAttribute('role', 'tab');
    btn.id = 'tab-' + i;
    btn.innerHTML = '<span class="ico">' + svgIcon(f.icon) + '</span><span>' + f.label + '</span><span class="bar"></span>';
    btn.addEventListener('click', function () { userTookOver = true; stopTimer(); show(i); });
    tabsEl.appendChild(btn);
    tabButtons.push(btn);
    var pre = new Image();
    pre.src = '/images/shots/' + f.img;
  });

  var showingA = true;
  function show(i) {
    current = i;
    var f = FEATURES[i];
    tabButtons.forEach(function (b, k) {
      var on = k === i;
      b.setAttribute('aria-selected', String(on));
      b.setAttribute('tabindex', on ? '0' : '-1');
      b.classList.remove('run');
      if (on && !userTookOver && !reduceMotion) { void b.offsetWidth; b.classList.add('run'); }
    });
    var incoming = showingA ? stageB : stageA;
    var outgoing = showingA ? stageA : stageB;
    incoming.src = '/images/shots/' + f.img;
    incoming.classList.add('is-on');
    outgoing.classList.remove('is-on');
    showingA = !showingA;

    titleEl.textContent = f.title;
    descEl.textContent = f.desc;
    pointsEl.innerHTML = f.points.map(function (p) { return '<li>' + p + '</li>'; }).join('');
    stageText.classList.remove('swap');
    void stageText.offsetWidth;
    stageText.classList.add('swap');
  }

  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
  function startTimer() {
    if (reduceMotion || userTookOver || timer) return;
    timer = setInterval(function () { show((current + 1) % FEATURES.length); }, 6000);
  }

  tabsEl.setAttribute('role', 'tablist');
  tabsEl.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    userTookOver = true; stopTimer();
    var dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1;
    var next = (current + dir + FEATURES.length) % FEATURES.length;
    show(next);
    tabButtons[next].focus();
  });

  stageA.classList.remove('is-on');
  stageB.classList.remove('is-on');
  showingA = false; // first call fills stage A
  show(0);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) startTimer(); else stopTimer(); });
    }, { threshold: 0.35 }).observe($('#explorer'));
  }

  /* ---------- Reveal on scroll + count up ---------- */
  var revealTargets = $$('.section h2, .section-lead, .stat, .card, .family-art, .family-copy, .offline-art, .offline-copy, .faq details, .contact-card, .explorer');
  if ('IntersectionObserver' in window && !reduceMotion) {
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
        var num = $('[data-count]', en.target);
        if (num) countUp(num);
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { io.observe(el); });
  }
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var start = performance.now();
    var dur = 1100;
    function tick(now) {
      var p = Math.min(1, (now - start) / dur);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();
