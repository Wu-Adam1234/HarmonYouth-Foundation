/* ==========================================================================
   HarmonYouth Foundation — all site behaviour.
   Ported from the mockups' site.js, plus the hero scroll-lock, the two
   schedule calendars, the Formspree forms and the 404 piano.
   No build step: this is a plain script, loaded with defer on every page.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * SEARCH ROUTES — what the menu search matches against.
   * Add a page here and the search can find it.
   * ------------------------------------------------------------------ */
  var ROUTES = [
    { page: 'performances.html', label: 'Upcoming performances', keys: 'upcoming performance show shows calendar september sep date dates scenic grande manor village cambridge boardwalk rocky ridge next played booking book' },
    { page: 'photos.html',       label: 'Photos',                keys: 'photo photos gallery pictures images carousel cambridge scenic manor boardwalk august' },
    { page: 'programs.html',     label: 'Programs',              keys: 'program programs music build assistive device 3d print printing makers making change adapted toys roster instrument piano strings voice clarinet cello' },
    { page: 'build-meets.html',  label: 'Build meets',           keys: 'build meet meets meeting assembly solder switch printer parts september 30' },
    { page: 'get-involved.html', label: 'Get involved',          keys: 'join volunteer involved sign up signup form hours certificate service letter request student musician care home coordinator faq questions email contact wechat' },
    { page: 'donate.html',       label: 'Donate',                keys: 'donate donation gofundme money hospital hospitals senior homes proceeds give support fundraise qr wechat' },
    { page: 'mission.html',      label: 'Our mission',           keys: 'mission why about story values purpose who we are consistency access transparency' },
    { page: 'team.html',         label: 'Meet the team',         keys: 'team founders adam hanry arthur vienna lu bios who runs it marketing outreach lead' },
    { page: 'privacy.html',      label: 'Privacy policy',        keys: 'privacy policy data consent photos personal information cookies under 18 guardian' }
  ];

  var PLACEHOLDERS = [
    'Search: upcoming performances',
    'Search: volunteer hours',
    'Search: service letter request',
    'Search: photos from Cambridge Manor',
    'Search: where donations go'
  ];

  /* ------------------------------------------------------------------ *
   * SCHEDULE DATA — this is the part you edit when dates change.
   * Format: 'YYYY-MM-DD': [['VENUE_CODE', 'status', 'time']]
   * Statuses: recruiting, full, talks, past, cancelled
   * Months are 0-indexed: m:7 is August, m:9 is October.
   * ------------------------------------------------------------------ */
  var PERFORMANCE_CALENDAR = {
    venues: {
      SG: 'The Scenic Grande', MV: 'The Manor Village at Rocky Ridge',
      RR: 'Rocky Ridge Retirement Community', CM: 'Cambridge Manor',
      BW: 'Boardwalk Retirement Community'
    },
    events: {
      '2026-08-01': [['RR', 'past', '2:00 to 2:30 PM']],
      '2026-08-07': [['SG', 'past', '2:00 to 2:30 PM'], ['MV', 'past', '1:00 to 1:30 PM']],
      '2026-08-21': [['SG', 'past', '2:00 to 2:30 PM'], ['MV', 'past', '1:00 to 1:30 PM']],
      '2026-08-23': [['CM', 'past', '2:00 to 2:45 PM']],
      '2026-08-30': [['BW', 'past', '2:00 to 2:30 PM']],
      '2026-09-06': [['SG', 'full', '12:00 to 12:30 PM']],
      '2026-09-13': [['MV', 'recruiting', '11:30 AM to 12:00 PM']],
      '2026-09-25': [['SG', 'talks', '3:30 to 4:00 PM']],
      '2026-10-04': [['RR', 'talks', '3:30 to 4:00 PM']],
      '2026-10-11': [['SG', 'talks', '12:00 to 12:30 PM']],
      '2026-10-18': [['CM', 'recruiting', '11:00 to 11:30 AM']],
      '2026-11-08': [['BW', 'talks', '11:30 AM to 12:00 PM, or 12:00 to 12:30 PM']]
    },
    min: { y: 2026, m: 7 }, max: { y: 2026, m: 10 }, start: { y: 2026, m: 8 },
    labels: { past: 'Past performance' },
    note: 'Gold = booked or recruiting, gray = played. Hover a chip for venue and time.'
  };

  var BUILD_MEET_CALENDAR = {
    venues: { BM: 'Build meeting, location to be confirmed' },
    events: { '2026-09-30': [['BM', 'recruiting', '9:00 AM to 12:00 PM']] },
    min: { y: 2026, m: 8 }, max: { y: 2026, m: 8 }, start: { y: 2026, m: 8 },
    labels: { recruiting: 'Spots open', past: 'Past meet' },
    note: 'Gold = spots open, gray = past. Hover a chip for details and time.'
  };

  var STATUS_LABEL = { recruiting: 'Recruiting', full: 'Full', talks: 'In talks', past: 'Past', cancelled: 'Cancelled' };
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  /* ------------------------------------------------------------------ *
   * Small helpers
   * ------------------------------------------------------------------ */
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function matchRoute(q) {
    var words = String(q || '').toLowerCase().split(/\s+/).filter(function (w) { return w.length > 1; });
    var best = null, score = 0;
    ROUTES.forEach(function (r) {
      var hay = (r.label + ' ' + r.keys).toLowerCase(), s = 0;
      words.forEach(function (w) { if (hay.indexOf(w) >= 0) s += w.length; });
      if (s > score) { score = s; best = r; }
    });
    return score > 0 ? best : null;
  }

  var SUN  = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.7"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
  var MOON = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';

  /* ------------------------------------------------------------------ *
   * Theme — remembered in localStorage under hy-theme
   * ------------------------------------------------------------------ */
  var theme = 'dark';
  function applyTheme() {
    document.documentElement.setAttribute('data-hy-theme', theme);
    var light = theme === 'light';
    $$('[data-theme-icon]').forEach(function (el) { el.innerHTML = light ? SUN : MOON; });
    var c = $('[data-cursor]');
    if (c) c.style.mixBlendMode = light ? 'multiply' : 'screen';
    var shade = $('[data-hero-shade]');
    if (shade) {
      shade.style.background = light
        ? 'radial-gradient(ellipse at 50% 40%,rgba(10,10,12,.30) 0%,rgba(10,10,12,.66) 60%,rgba(10,10,12,.88) 100%)'
        : 'radial-gradient(ellipse at 50% 40%,rgba(7,8,10,.28) 0%,rgba(7,8,10,.78) 60%,rgba(7,8,10,.96) 100%)';
    }
  }
  function initTheme() {
    var saved = null;
    try { saved = window.localStorage.getItem('hy-theme'); } catch (e) { saved = null; }
    theme = (saved === 'light' || saved === 'dark') ? saved : 'dark';
    applyTheme();
    $$('[data-theme-toggle]').forEach(function (b) {
      b.addEventListener('click', function () {
        theme = theme === 'dark' ? 'light' : 'dark';
        try { window.localStorage.setItem('hy-theme', theme); } catch (e) { /* private mode */ }
        applyTheme();
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Dropdown nav
   * ------------------------------------------------------------------ */
  var menuOpen = false;
  function initNav() {
    var btn = $('[data-menu-toggle]'), panel = $('[data-menu-panel]'), bars = $('[data-menu-bars]');
    var current = document.body.getAttribute('data-page') || '';

    $$('[data-navlink]').forEach(function (a) {
      if (current && a.getAttribute('href') === current) a.setAttribute('aria-current', 'page');
    });

    if (!btn || !panel) return;
    function paint() {
      panel.classList.toggle('open', menuOpen);
      btn.setAttribute('aria-expanded', String(menuOpen));
      if (bars) {
        var is = bars.querySelectorAll('i');
        if (is[0]) is[0].style.transform = menuOpen ? 'translateY(2.5px) rotate(45deg)' : 'none';
        if (is[1]) is[1].style.transform = menuOpen ? 'translateY(-2.5px) rotate(-45deg)' : 'none';
      }
      if (menuOpen) {
        var input = panel.querySelector('[data-search-input]');
        if (input) setTimeout(function () { input.focus(); }, 120);
      }
    }
    btn.addEventListener('click', function (e) { e.stopPropagation(); menuOpen = !menuOpen; paint(); });
    panel.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', function () { if (menuOpen) { menuOpen = false; paint(); } });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (modalOpen) closeModal();
      else if (menuOpen) { menuOpen = false; paint(); }
    });
    paint();
  }

  /* ------------------------------------------------------------------ *
   * Search, with the rotating placeholder
   * ------------------------------------------------------------------ */
  function initSearch() {
    $$('[data-search-form]').forEach(function (form) {
      var input  = form.querySelector('[data-search-input]');
      var ph     = form.querySelector('[data-search-ph]');
      var result = form.parentElement && form.parentElement.querySelector('[data-search-result]');
      if (ph && !reduceMotion) {
        var i = 0;
        ph.textContent = PLACEHOLDERS[0];
        setInterval(function () {
          if (input && input.value) { ph.style.opacity = '0'; return; }
          ph.style.opacity = '0';
          ph.style.transform = 'translateY(-140%)';
          setTimeout(function () {
            i += 1;
            ph.textContent = PLACEHOLDERS[i % PLACEHOLDERS.length];
            ph.style.transform = 'translateY(60%)';
            requestAnimationFrame(function () { ph.style.opacity = '1'; ph.style.transform = 'translateY(-50%)'; });
          }, 380);
        }, 3400);
      } else if (ph) {
        ph.textContent = PLACEHOLDERS[0];
      }
      if (input && ph) input.addEventListener('input', function () { ph.style.opacity = input.value ? '0' : '1'; });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var q = ((input && input.value) || '').trim();
        if (!q) return;
        var hit = matchRoute(q);
        if (result) {
          result.style.display = 'block';
          result.innerHTML = hit
            ? 'Opening <strong style="color:var(--text)">' + hit.label + '</strong>…'
            : 'No match for “' + q.replace(/[<>]/g, '') + '” — try performances, photos, hours, or donate.';
        }
        if (hit) setTimeout(function () { window.location.href = hit.page; }, 420);
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Accordions — one row open at a time
   * ------------------------------------------------------------------ */
  function initAccordions() {
    $$('[data-accordion]').forEach(function (acc) {
      var items = $$('[data-acc-item]', acc);
      items.forEach(function (item, i) {
        var trigger = item.querySelector('[data-acc-trigger]');
        var body    = item.querySelector('[data-acc-body]');
        var icon    = item.querySelector('[data-acc-icon]');
        if (!trigger || !body) return;
        function set(open) {
          item.dataset.open = open ? '1' : '0';
          body.style.height = open ? body.scrollHeight + 'px' : '0px';
          trigger.setAttribute('aria-expanded', String(open));
          if (icon) icon.style.transform = open ? 'rotate(45deg)' : 'none';
        }
        trigger.addEventListener('click', function () {
          var open = item.dataset.open !== '1';
          items.forEach(function (o) {
            if (o === item) return;
            var b = o.querySelector('[data-acc-body]'), ic = o.querySelector('[data-acc-icon]');
            var tg = o.querySelector('[data-acc-trigger]');
            o.dataset.open = '0';
            if (b) b.style.height = '0px';
            if (ic) ic.style.transform = 'none';
            if (tg) tg.setAttribute('aria-expanded', 'false');
          });
          set(open);
        });
        set(i === 0);
      });
      window.addEventListener('resize', function () {
        items.forEach(function (item) {
          var body = item.querySelector('[data-acc-body]');
          if (body && item.dataset.open === '1') body.style.height = body.scrollHeight + 'px';
        });
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Reveal on scroll, staggered in groups of four
   * ------------------------------------------------------------------ */
  function initReveals() {
    var reveals = $$('[data-reveal]');
    if (!reveals.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    reveals.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = 'opacity .7s cubic-bezier(.22,.9,.35,1) ' + ((i % 4) * 70) + 'ms, transform .7s cubic-bezier(.22,.9,.35,1) ' + ((i % 4) * 70) + 'ms';
    });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'none'; io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------ *
   * Card carousels — photos are lazy, and blur up as they arrive
   * ------------------------------------------------------------------ */
  function initCarousels() {
    $$('[data-carousel-block]').forEach(function (block) {
      var track = block.querySelector('[data-car-track]');
      var prev  = block.querySelector('[data-car-prev]');
      var next  = block.querySelector('[data-car-next]');
      if (!track) return;
      function step() {
        var card = track.querySelector('[data-card]');
        return (card ? card.getBoundingClientRect().width : 260) + 16;
      }
      function paint() {
        var max = track.scrollWidth - track.clientWidth - 2;
        if (prev) { var o1 = track.scrollLeft <= 2; prev.style.opacity = o1 ? '.35' : '1'; prev.disabled = o1; }
        if (next) { var o2 = track.scrollLeft >= max; next.style.opacity = o2 ? '.35' : '1'; next.disabled = o2; }
      }
      if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step() * 1.5, behavior: 'smooth' }); });
      if (next) next.addEventListener('click', function () { track.scrollBy({ left:  step() * 1.5, behavior: 'smooth' }); });
      track.addEventListener('scroll', paint, { passive: true });
      window.addEventListener('resize', paint);
      setTimeout(paint, 220);
      paint();
    });

    // Lazy-load: images carry data-src until their carousel nears the viewport.
    var pending = $$('img[data-src]');
    function load(img) {
      if (img.dataset.loaded) return;
      img.dataset.loaded = '1';
      img.src = img.getAttribute('data-src');
    }
    function unblur(img) { img.style.filter = 'none'; img.style.transform = 'scale(1)'; }
    pending.forEach(function (img) {
      img.addEventListener('load', function () { unblur(img); });
      img.addEventListener('error', function () { unblur(img); });
    });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { load(e.target); io.unobserve(e.target); } });
      }, { rootMargin: '300px' });
      pending.forEach(function (img) { io.observe(img); });
    } else {
      pending.forEach(load);
    }
  }

  /* ------------------------------------------------------------------ *
   * Lightbox
   * ------------------------------------------------------------------ */
  var modalOpen = false, closeModal = function () {};
  function initModal() {
    var modal = $('[data-modal]');
    if (!modal) return;
    var backdrop = modal.querySelector('[data-modal-backdrop]');
    var panel    = modal.querySelector('[data-modal-panel]');
    var closeBtn = modal.querySelector('[data-modal-close]');
    var img      = modal.querySelector('[data-modal-img]');
    var cat      = modal.querySelector('[data-modal-cat]');
    var title    = modal.querySelector('[data-modal-title]');
    var body     = modal.querySelector('[data-modal-body]');

    closeModal = function () {
      modalOpen = false;
      if (backdrop) backdrop.style.opacity = '0';
      if (panel) { panel.style.opacity = '0'; panel.style.transform = 'scale(.96) translateY(12px)'; }
      setTimeout(function () { modal.style.display = 'none'; }, 340);
      document.body.style.overflow = '';
    };

    $$('[data-card]').forEach(function (card) {
      card.addEventListener('click', function () {
        var src = card.querySelector('img');
        if (img && src) {
          img.src = src.getAttribute('src') || src.getAttribute('data-src');
          img.alt = src.getAttribute('alt') || '';
        }
        if (cat)   cat.textContent   = card.getAttribute('data-cat') || '';
        if (title) title.textContent = card.getAttribute('data-title') || '';
        if (body)  body.textContent  = card.getAttribute('data-body') || '';
        modal.style.display = 'flex';
        modalOpen = true;
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(function () {
          if (backdrop) backdrop.style.opacity = '1';
          if (panel) { panel.style.opacity = '1'; panel.style.transform = 'scale(1) translateY(0)'; }
        });
      });
    });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
  }

  /* ------------------------------------------------------------------ *
   * Piano outline that reveals colour in a spotlight under the cursor
   * ------------------------------------------------------------------ */
  function initPianoSpotlight() {
    $$('[data-piano-hover]').forEach(function (el) {
      var color = el.querySelector('[data-piano-color]');
      if (!color) return;
      function setSpot(x, y) {
        var m = 'radial-gradient(circle 260px at ' + x + 'px ' + y + 'px, #000 0%, #000 55%, transparent 100%)';
        color.style.webkitMaskImage = m;
        color.style.maskImage = m;
      }
      el.addEventListener('pointerenter', function (e) {
        var r = el.getBoundingClientRect();
        setSpot(e.clientX - r.left, e.clientY - r.top);
        el.classList.add('is-lit');
      });
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        setSpot(e.clientX - r.left, e.clientY - r.top);
      });
      el.addEventListener('pointerleave', function () { el.classList.remove('is-lit'); });
    });
  }

  /* ------------------------------------------------------------------ *
   * Fluid cursor trail
   * ------------------------------------------------------------------ */
  function initCursor() {
    var canvas = $('[data-cursor]');
    if (!canvas) return;
    if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) { canvas.style.display = 'none'; return; }
    var ctx = canvas.getContext('2d'), parts = [], last = null, dpr = 1;
    function size() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width  = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    }
    size();
    window.addEventListener('resize', size);
    window.addEventListener('pointermove', function (e) {
      var x = e.clientX, y = e.clientY;
      if (last) {
        var dx = x - last.x, dy = y - last.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d > 2) {
          var n = Math.min(3, Math.ceil(d / 22));
          for (var i = 0; i < n; i++) {
            var t = (i + 1) / n;
            parts.push({
              x: last.x + dx * t, y: last.y + dy * t,
              vx: dx * 0.06, vy: dy * 0.06,
              r: 16 + Math.min(20, d * 0.55), life: 1,
              hue: ((theme === 'light' ? 32 : 38) + Math.random() * 26) % 360
            });
          }
          if (parts.length > 70) parts.splice(0, parts.length - 70);
        }
      }
      last = { x: x, y: y };
    }, { passive: true });

    (function loop() {
      requestAnimationFrame(loop);
      var w = canvas.width, h = canvas.height;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.13)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = theme === 'light' ? 'source-over' : 'lighter';
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.x += p.vx; p.y += p.vy; p.vx *= 0.92; p.vy *= 0.92; p.life -= 0.028;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        var r = p.r * (0.55 + 0.45 * p.life) * dpr;
        var a = 0.13 * p.life;
        var sat = theme === 'light' ? 60 : 78, lig = theme === 'light' ? 52 : 62;
        var g = ctx.createRadialGradient(p.x * dpr, p.y * dpr, 0, p.x * dpr, p.y * dpr, r);
        g.addColorStop(0, 'hsla(' + p.hue + ',' + sat + '%,' + lig + '%,' + a + ')');
        g.addColorStop(0.55, 'hsla(' + ((p.hue + 14) % 360) + ',' + sat + '%,' + (lig - 8) + '%,' + (a * 0.4) + ')');
        g.addColorStop(1, 'hsla(' + p.hue + ',' + sat + '%,' + lig + '%,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x * dpr, p.y * dpr, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    })();
  }

  /* ------------------------------------------------------------------ *
   * Scroll progress bar + homepage dot rail
   * ------------------------------------------------------------------ */
  function initScrollBar() {
    var bar = $('[data-progress]');
    var dots = $$('[data-dot]');
    var header = $('.site-header');
    var heroScene = $('[data-hero-scene]');
    function paint() {
      // While the header overlays the hero photo its text must stay light,
      // whichever colour mode is active.
      if (header && heroScene) {
        header.classList.toggle('over-hero', window.scrollY < heroScene.offsetHeight - 90);
      }
      if (bar) {
        var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        bar.style.width = Math.min(100, (window.scrollY / max) * 100) + '%';
      }
      if (dots.length) {
        var mid = window.scrollY + window.innerHeight * 0.4, active = null;
        dots.forEach(function (d) {
          var sec = document.getElementById(d.getAttribute('data-dot'));
          if (sec && sec.offsetTop <= mid) active = d;
        });
        dots.forEach(function (d) { d.classList.toggle('on', d === active); });
      }
    }
    window.addEventListener('scroll', paint, { passive: true });
    window.addEventListener('resize', paint);
    paint();
  }

  /* ------------------------------------------------------------------ *
   * GoFundMe widget, with a styled fallback if it doesn't load
   * ------------------------------------------------------------------ */
  function initGoFundMe() {
    var host = $('[data-gfm-host]');
    if (!host) return;
    var fallback = host.querySelector('[data-gfm-fallback]');
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (host.querySelector('iframe')) { if (fallback) fallback.style.display = 'none'; clearInterval(timer); }
      else if (tries > 30) clearInterval(timer);
    }, 500);
  }

  /* ------------------------------------------------------------------ *
   * Homepage hero scroll-lock — the first scrolls expand the photo
   * ------------------------------------------------------------------ */
  function initHeroLock() {
    var scene = $('[data-hero-scene]');
    var hero  = $('[data-hero]');
    if (!scene || !hero) return;
    var media   = $('[data-hero-media]', hero);
    var caption = $('[data-hero-caption]', hero);
    var veil    = $('[data-hero-veil]', hero);
    var textL   = $('[data-hero-word="l"]', hero);
    var textR   = $('[data-hero-word="r"]', hero);
    var bar     = $('[data-hero-bar]', hero);
    var meta    = $('[data-hero-meta]', hero);
    if (!media) return;

    function paint(t) {
      var e = t * t * (3 - 2 * t); // smoothstep
      media.style.width  = (340 + e * (window.innerWidth  - 340)) + 'px';
      media.style.height = (440 + e * (window.innerHeight - 440)) + 'px';
      media.style.borderRadius = (24 - e * 24) + 'px';
      if (veil) veil.style.opacity = String(0.86 - e * 0.30);
      if (caption) {
        var c = Math.max(0, (t - 0.55) / 0.45);
        caption.style.opacity = String(c);
        caption.style.transform = 'translateY(' + (18 - c * 18) + 'px)';
      }
      if (textL) { textL.style.transform = 'translateX(' + (-e * 42) + 'vw)'; textL.style.opacity = String(1 - e * 1.4); }
      if (textR) { textR.style.transform = 'translateX(' + ( e * 42) + 'vw)'; textR.style.opacity = String(1 - e * 1.4); }
      if (bar) bar.style.width = (t * 100) + '%';
      if (meta) meta.style.opacity = String(1 - Math.max(0, (t - 0.4) / 0.4));
    }

    if (reduceMotion) { paint(1); return; }

    function onScroll() {
      var travel = Math.max(1, scene.offsetHeight - window.innerHeight);
      paint(Math.min(1, Math.max(0, (window.scrollY - scene.offsetTop) / travel)));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  /* ------------------------------------------------------------------ *
   * List / Calendar toggle + the calendar itself
   * ------------------------------------------------------------------ */
  function initViewToggles() {
    $$('[data-view-toggle]').forEach(function (toggle) {
      var scope = toggle.closest('[data-schedule]') || document;
      var list  = $('[data-view="list"]', scope);
      var cal   = $('[data-view="calendar"]', scope);
      $$('button', toggle).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var want = btn.getAttribute('data-show');
          $$('button', toggle).forEach(function (b) { b.classList.toggle('on', b === btn); });
          if (list) list.hidden = want !== 'list';
          if (cal)  cal.hidden  = want !== 'calendar';
        });
      });
    });
  }

  function initCalendar(monthEl, cfg) {
    if (!monthEl) return;
    var VENUES = cfg.venues, EVENTS = cfg.events;
    var LABEL = Object.assign({}, STATUS_LABEL, cfg.labels || {});
    var cur = { y: cfg.start.y, m: cfg.start.m };
    var root = monthEl.closest('.calendar') || document;
    var titleEl = root.querySelector('.cal-title');
    var prevBtn = root.querySelector('.cal-nav-btn.prev');
    var nextBtn = root.querySelector('.cal-nav-btn.next');
    var legendEl = root.querySelector('.cal-legend');
    if (legendEl) {
      legendEl.innerHTML = Object.keys(VENUES).map(function (k) {
        return '<span><b>' + k + '</b>' + VENUES[k] + '</span>';
      }).join('') + '<span class="cal-legend-note">' + cfg.note + '</span>';
    }

    var tip = document.querySelector('.cal-tip');
    if (!tip) { tip = document.createElement('div'); tip.className = 'cal-tip'; tip.hidden = true; document.body.appendChild(tip); }

    function cmp(a, b) { return (a.y * 12 + a.m) - (b.y * 12 + b.m); }

    function render() {
      titleEl.textContent = MONTHS[cur.m] + ' ' + cur.y;
      prevBtn.disabled = cmp(cur, cfg.min) <= 0;
      nextBtn.disabled = cmp(cur, cfg.max) >= 0;
      var daysInMonth = new Date(cur.y, cur.m + 1, 0).getDate();
      var startDow = new Date(cur.y, cur.m, 1).getDay();
      var html = '<div class="cal-grid">';
      ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(function (d) { html += '<div class="cal-head">' + d + '</div>'; });
      for (var i = 0; i < startDow; i++) html += '<div class="cal-cell empty"></div>';
      for (var day = 1; day <= daysInMonth; day++) {
        var key = cur.y + '-' + String(cur.m + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        var evs = EVENTS[key];
        if (evs) {
          var chips = evs.map(function (e) {
            return '<span class="cal-chip ' + e[1] + '" data-venue="' + VENUES[e[0]] + '" data-time="' + e[2] + '" data-status="' + LABEL[e[1]] + '">' + e[0] + '</span>';
          }).join('');
          html += '<div class="cal-cell has-event"><span class="cal-day">' + day + '</span>' + chips + '</div>';
        } else {
          html += '<div class="cal-cell"><span class="cal-day">' + day + '</span></div>';
        }
      }
      monthEl.innerHTML = html + '</div>';

      $$('.cal-chip', monthEl).forEach(function (chip) {
        chip.addEventListener('mouseenter', function () {
          tip.innerHTML = '<strong>' + chip.dataset.venue + '</strong><span>' + chip.dataset.time + '</span><span class="cal-tip-status">' + chip.dataset.status + '</span>';
          tip.hidden = false;
        });
        chip.addEventListener('mousemove', function (e) {
          tip.style.left = (e.clientX + 14) + 'px';
          tip.style.top  = (e.clientY + 14) + 'px';
        });
        chip.addEventListener('mouseleave', function () { tip.hidden = true; });
      });
    }
    prevBtn.addEventListener('click', function () { if (cmp(cur, cfg.min) > 0) { cur.m--; if (cur.m < 0) { cur.m = 11; cur.y--; } render(); } });
    nextBtn.addEventListener('click', function () { if (cmp(cur, cfg.max) < 0) { cur.m++; if (cur.m > 11) { cur.m = 0; cur.y++; } render(); } });
    render();
  }

  /* ------------------------------------------------------------------ *
   * Formspree forms + the confirmation screen that replaces them
   * ------------------------------------------------------------------ */
  var FORM_ID = 'xnjkdgge';   // one Formspree form, shared by all three panels
  var IG_LINK    = '<a href="https://www.instagram.com/harmonyouthfoundation/" target="_blank" rel="noopener" class="fs-success-link">Instagram</a>';
  var SHOWS_LINK = '<a href="performances.html" class="fs-success-link">Performances page</a>';
  var SUCCESS_CONTENT = {
    volunteerForm: {
      title: "You're on the roster",
      body: "We'll email you before the next show that fits your dates. In the meantime, check our " + SHOWS_LINK + " for what's coming up, and follow us on " + IG_LINK + " for the latest updates."
    },
    makerForm: {
      title: 'Thanks for reaching out',
      body: "We'll follow up by email about the next build meeting or your request. In the meantime, check our " + SHOWS_LINK + " for what's coming up, and follow us on " + IG_LINK + " for the latest updates."
    },
    helpForm: {
      title: 'Message received',
      body: "We'll be in touch by email soon. In the meantime, check our " + SHOWS_LINK + " for what's coming up, and follow us on " + IG_LINK + " for the latest updates."
    }
  };

  function initForms() {
    var forms = $$('form[data-hy-form]');
    if (!forms.length) return;

    // Any confirm field with data-confirm-for="<id>" is checked against that id.
    // Both blank passes, which is what makes the optional pair on #helpForm work.
    function checkConfirm(form) {
      var ok = true;
      $$('[data-confirm-for]', form).forEach(function (conf) {
        var first = document.getElementById(conf.getAttribute('data-confirm-for'));
        var err = conf.parentElement.querySelector('.fs-error');
        if (!first) return;
        var a = first.value.trim(), b = conf.value.trim();
        if (a === b) { if (err) err.textContent = ''; return; }
        ok = false;
        if (err) err.textContent = 'These two emails don’t match.';
      });
      return ok;
    }

    // Under-18 answer decides whether the guardian email pair is required.
    // Fields carry data-guardian-required instead of a hard-coded required attribute.
    function initMinorGate(form) {
      var radios = $$('input[name="under_18"]', form);
      var guardian = $$('[data-guardian-required]', form);
      if (!radios.length || !guardian.length) return;
      function sync() {
        var minor = radios.some(function (r) { return r.checked && r.value === 'Yes'; });
        guardian.forEach(function (el) { el.required = minor; });
      }
      radios.forEach(function (r) { r.addEventListener('change', sync); });
      sync();
    }

    forms.forEach(function (form) {
      initMinorGate(form);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!checkConfirm(form)) return;
        if (!form.reportValidity()) return;

        var btn = form.querySelector('button[type="submit"]');
        var label = btn ? btn.querySelector('.btn-label') : null;
        var was = label ? label.textContent : '';
        if (label) label.textContent = 'Sending…';
        if (btn) btn.disabled = true;

        var data = new FormData(form);

        // CASL: record consent explicitly either way, with the date it was given.
        $$('input[type="checkbox"][data-consent]', form).forEach(function (cb) {
          data.set(cb.name, cb.checked
            ? 'YES — consented ' + new Date().toISOString()
            : 'No — did not opt in');
        });
        fetch('https://formspree.io/f/' + FORM_ID, {
          method: 'POST', body: data, headers: { Accept: 'application/json' }
        }).then(function (r) {
          if (!r.ok) throw new Error('Formspree rejected the submission');
          showSuccess(form);
        }).catch(function () {
          if (label) label.textContent = was;
          if (btn) btn.disabled = false;
          var err = form.querySelector('[data-form-error]');
          if (err) err.textContent = 'That didn’t send. Please email harmonyouthfoundation@gmail.com instead.';
        });
      });
    });

    function showSuccess(form) {
      var content = SUCCESS_CONTENT[form.id] || { title: 'Sent!', body: 'Thanks — we’ll be in touch.' };
      var screen = document.createElement('div');
      screen.className = 'fs-success-screen';
      screen.innerHTML = '<div class="fs-success-title">' + content.title + '</div>'
                       + '<div class="fs-success-msg">' + content.body + '</div>';
      var host = form.closest('.form-body') || form.parentElement;
      form.style.visibility = 'hidden';
      host.appendChild(screen);
      screen.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /* ------------------------------------------------------------------ *
   * 404 piano — real notes via Web Audio, A S D F G H J on the keyboard
   * ------------------------------------------------------------------ */
  function initPiano() {
    var piano = $('[data-piano]');
    if (!piano) return;
    var ac = null;
    function play(freq) {
      try {
        ac = ac || new (window.AudioContext || window.webkitAudioContext)();
        var o = ac.createOscillator(), g = ac.createGain();
        o.type = 'triangle';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.22, ac.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 1.1);
        o.connect(g); g.connect(ac.destination);
        o.start(); o.stop(ac.currentTime + 1.2);
      } catch (e) { /* no audio available */ }
    }
    var note = $('[data-piano-note]');
    function hit(key) {
      if (key.classList.contains('missing')) return;
      play(parseFloat(key.getAttribute('data-freq')));
      key.classList.add('down');
      if (note) note.textContent = key.getAttribute('data-note') + ' — still here';
      setTimeout(function () { key.classList.remove('down'); }, 160);
    }
    $$('.piano-key', piano).forEach(function (key) { key.addEventListener('click', function () { hit(key); }); });
    window.addEventListener('keydown', function (e) {
      var key = piano.querySelector('.piano-key[data-kbd="' + e.key.toLowerCase() + '"]');
      if (key) hit(key);
    });
  }

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */
  function boot() {
    initTheme();
    initNav();
    initSearch();
    initAccordions();
    initReveals();
    initCarousels();
    initModal();
    initPianoSpotlight();
    initCursor();
    initScrollBar();
    initGoFundMe();
    initHeroLock();
    initViewToggles();
    initForms();
    initPiano();
    initCalendar(document.getElementById('perfCalMonth'), PERFORMANCE_CALENDAR);
    initCalendar(document.getElementById('buildCalMonth'), BUILD_MEET_CALENDAR);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
