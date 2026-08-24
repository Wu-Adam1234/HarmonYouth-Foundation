// mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  // scroll reveal (replays every time elements enter the viewport)
  const revealEls = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => e.target.classList.toggle('in', e.isIntersecting));
  }, { threshold: 0.15 });
  revealEls.forEach(el => obs.observe(el));

  // persistent scroll-reactive piano bar fixed at the bottom of the page
  const scrollPiano = document.getElementById('scrollPiano');
  if (scrollPiano) {
    const count = 50;
    for (let i = 0; i < count; i++) {
      const k = document.createElement('div');
      k.className = 'key';
      scrollPiano.appendChild(k);
    }
    const spKeys = scrollPiano.querySelectorAll('.key');
    function updateScrollPiano() {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      const activeCount = Math.round(progress * count);
      spKeys.forEach((k, i) => k.classList.toggle('active', i < activeCount));
    }
    window.addEventListener('scroll', updateScrollPiano);
    window.addEventListener('resize', updateScrollPiano);
    updateScrollPiano();
  }

  // auto-rotating photo carousels with clickable dots (reusable for any .carousel on the site)
  // images use data-src and only load once the carousel scrolls into view
  const carouselLoadObs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const carousel = entry.target;
      carousel.querySelectorAll('.carousel-slide[data-src]').forEach(img => {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      });
      observer.unobserve(carousel);
      if (carousel._startAutoplay) carousel._startAutoplay();
    });
  }, { rootMargin: '200px 0px' });

  document.querySelectorAll('.carousel').forEach(carousel => {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    let current = 0;
    let timer = null;

    function goTo(index) {
      if (slides[current]) slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = index;
      if (slides[current]) slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }

    function startAutoplay() {
      if (timer) clearInterval(timer);
      timer = setInterval(() => goTo((current + 1) % slides.length), 3000);
    }

    if (slides.length > 1) {
      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          // in case someone clicks a dot before the carousel has scrolled into view
          carousel.querySelectorAll('.carousel-slide[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
          });
          goTo(i);
          startAutoplay();
        });
      });
      carousel._startAutoplay = startAutoplay;
      carouselLoadObs.observe(carousel);
    } else {
      // single-image "carousel" still needs its image loaded once visible
      carouselLoadObs.observe(carousel);
    }
  });

  // scatter music notes across dark sections; they drift as you scroll (parallax)
  const noteSvgs = [
    '<svg width="__S__" height="__S__" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="1.5"/></svg>',
    '<svg width="__S__" height="__S__" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 18V4l6 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="7" cy="18" r="3" stroke="currentColor" stroke-width="1.5"/></svg>'
  ];
  const parallaxEls = [];
  document.querySelectorAll('.hero, .page-header, .founder, .form-section, .recruiting-banner').forEach(section => {
    section.classList.add('has-notes');
    const noteCount = 4;
    for (let i = 0; i < noteCount; i++) {
      const span = document.createElement('span');
      span.className = 'parallax-note';
      const size = 18 + Math.round(Math.random() * 22);
      span.innerHTML = noteSvgs[i % noteSvgs.length].replaceAll('__S__', size);
      span.style.left = (6 + Math.random() * 88) + '%';
      span.style.top = (8 + Math.random() * 80) + '%';
      section.appendChild(span);
      parallaxEls.push({ el: span, speed: 0.06 + Math.random() * 0.14, rot: (Math.random() - 0.5) * 40 });
    }
  });
  if (parallaxEls.length) {
    function updateParallax() {
      const y = window.scrollY;
      parallaxEls.forEach(p => {
        p.el.style.transform = 'translateY(' + (-y * p.speed) + 'px) rotate(' + (y * 0.02 * p.rot / 10) + 'deg)';
      });
    }
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  // flowing background paths (vanilla port of the BackgroundPaths component)
  function buildFloatingPaths(position) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 696 316');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    for (let i = 0; i < 36; i++) {
      const d = `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`;
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', d);
      path.setAttribute('pathLength', '1');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', (0.5 + i * 0.03).toFixed(2));
      path.style.strokeOpacity = (0.08 + i * 0.02).toFixed(3);
      path.style.animationDuration = (20 + Math.random() * 10) + 's';
      path.style.animationDelay = (-Math.random() * 20) + 's';
      svg.appendChild(path);
    }
    return svg;
  }
  document.querySelectorAll('.hero, .page-header, .support-section, .recruiting-banner').forEach(section => {
    const wrap = document.createElement('div');
    wrap.className = 'bg-paths';
    wrap.appendChild(buildFloatingPaths(1));
    wrap.appendChild(buildFloatingPaths(-1));
    section.prepend(wrap);
  });

  // 3D tilt-on-scroll cards (vanilla port of the ContainerScroll component)
  const tiltEls = Array.from(document.querySelectorAll('.past-show-photo, .gofundme-card, .founder-photo, .mission-stats'));
  if (tiltEls.length) {
    tiltEls.forEach(el => el.classList.add('scroll-tilt'));
    function updateTilt() {
      const vh = window.innerHeight;
      tiltEls.forEach(el => {
        const r = el.getBoundingClientRect();
        // progress: 0 when the card's top enters the viewport bottom, 1 when its center passes viewport center
        const progress = Math.min(Math.max((vh - r.top) / (vh * 0.9), 0), 1);
        const rotate = 18 * (1 - progress);
        const scale = 1.04 - 0.04 * progress;
        el.style.transform = 'perspective(1000px) rotateX(' + rotate.toFixed(2) + 'deg) scale(' + scale.toFixed(3) + ')';
      });
    }
    window.addEventListener('scroll', updateTilt, { passive: true });
    window.addEventListener('resize', updateTilt);
    updateTilt();
  }

  // pointer-tracking glow borders (vanilla port of the GlowingEffect component)
  const glowTargets = document.querySelectorAll('.step, .panel, .involve-card, .route-btn, .gofundme-fallback, .wechat-block, .volunteer-perk, .past-show, .recruiting-banner .section-inner');
  glowTargets.forEach(el => el.classList.add('glow-card'));
  // mouse sheen on dark feature cards (from the CinematicHero card)
  const sheenTargets = document.querySelectorAll('.gofundme-fallback, .wechat-block, .founder-photo');
  sheenTargets.forEach(el => el.classList.add('sheen-card'));

  if (glowTargets.length || sheenTargets.length) {
    let glowRaf = null;
    document.addEventListener('pointermove', (e) => {
      if (glowRaf) return;
      glowRaf = requestAnimationFrame(() => {
        glowRaf = null;
        const proximity = 80;
        glowTargets.forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.bottom < -proximity || r.top > window.innerHeight + proximity) return;
          const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          const active = e.clientX > r.left - proximity && e.clientX < r.right + proximity &&
                         e.clientY > r.top - proximity && e.clientY < r.bottom + proximity;
          el.style.setProperty('--active', active ? '1' : '0');
          if (active) {
            const angle = (180 * Math.atan2(e.clientY - cy, e.clientX - cx)) / Math.PI + 90;
            el.style.setProperty('--start', String(angle));
          }
        });
        sheenTargets.forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) return;
          el.style.setProperty('--mouse-x', (e.clientX - r.left) + 'px');
          el.style.setProperty('--mouse-y', (e.clientY - r.top) + 'px');
        });
      });
    }, { passive: true });
  }

  // parent/guardian email confirmation: live feedback + hard block on submit (runs before Formspree)
  // works on any form: put data-confirm-for="<id of the first email field>" on the confirm input
  document.querySelectorAll('input[data-confirm-for]').forEach(confirmEl => {
    const primary = document.getElementById(confirmEl.dataset.confirmFor);
    if (!primary) return;
    const errEl = confirmEl.parentElement ? confirmEl.parentElement.querySelector('.fs-error') : null;
    const form = confirmEl.closest('form');
    const val = el => el.value.trim().toLowerCase();
    const matches = () => val(primary) === val(confirmEl);
    const bothBlank = () => !val(primary) && !val(confirmEl);

    function updateMatchUI() {
      if (!errEl) return;
      if (confirmEl.value && !matches()) {
        errEl.textContent = "These don't match yet.";
        confirmEl.style.borderColor = 'var(--rose)';
      } else {
        errEl.textContent = '';
        confirmEl.style.borderColor = confirmEl.value ? 'var(--sage)' : '';
      }
    }
    primary.addEventListener('input', updateMatchUI);
    confirmEl.addEventListener('input', updateMatchUI);

    if (form) {
      form.addEventListener('submit', (e) => {
        // blank on both sides is fine, that is how the optional version behaves
        if (bothBlank() || matches()) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        if (errEl) errEl.textContent = 'Please make sure both parent or guardian email fields match before sending.';
        confirmEl.focus();
      }, true);
    }
  });

  // list/calendar view toggle — scoped per section, so more than one can live on a page
  document.querySelectorAll('.view-toggle').forEach(toggle => {
    const scope = toggle.closest('.section-inner') || document;
    const listView = scope.querySelector('.show-list');
    const calView = scope.querySelector('.calendar-view');
    if (!listView || !calView) return;
    toggle.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        toggle.querySelectorAll('.view-btn').forEach(b => b.classList.toggle('active', b === btn));
        const cal = btn.dataset.view === 'calendar';
        listView.hidden = cal;
        calView.hidden = !cal;
      });
    });
  });

  // ---------------------------------------------------------------------
  // SCHEDULE DATA — this is the part you edit when dates change.
  // Format: 'YYYY-MM-DD': [['VENUE_CODE', 'status', 'time']]
  // Statuses: recruiting, full, talks, past, cancelled
  // ---------------------------------------------------------------------

  // Performances page
  const PERFORMANCE_CALENDAR = {
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
      '2026-08-30': [['BW', 'full', '2:00 to 2:30 PM']],
      '2026-09-06': [['SG', 'talks', '12:00 to 12:30 PM']],
      '2026-09-13': [['MV', 'talks', '11:30 AM to 12:00 PM']],
      '2026-09-25': [['SG', 'talks', '3:30 to 4:00 PM']],
      '2026-10-04': [['RR', 'talks', '3:30 to 4:00 PM']],
      '2026-10-11': [['SG', 'talks', '12:00 to 12:30 PM']]
    },
    min: { y: 2026, m: 7 },   // August 2026
    max: { y: 2026, m: 9 },   // October 2026
    start: { y: 2026, m: 7 }, // month the calendar opens on
    labels: { past: 'Past performance' },
    note: 'Blue = recruiting, gray = past. Hover a chip for venue and time.'
  };

  // Build meets page
  const BUILD_MEET_CALENDAR = {
    venues: {
      BM: 'Build meeting, location to be confirmed'
    },
    events: {
      '2026-09-30': [['BM', 'recruiting', '9:00 AM to 12:00 PM']]
    },
    min: { y: 2026, m: 8 },   // September 2026
    max: { y: 2026, m: 8 },   // September 2026
    start: { y: 2026, m: 8 },
    labels: { recruiting: 'Spots open', past: 'Past meet' },
    note: 'Blue = spots open, gray = past. Hover a chip for details and time.'
  };

  const STATUS_LABEL = { recruiting: 'Recruiting', full: 'Full', talks: 'In talks', past: 'Past', cancelled: 'Cancelled' };
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function initCalendar(monthEl, cfg) {
    if (!monthEl) return;
    const VENUES = cfg.venues, EVENTS = cfg.events;
    const LABEL = Object.assign({}, STATUS_LABEL, cfg.labels || {});
    const MIN = cfg.min, MAX = cfg.max;
    const cur = { y: cfg.start.y, m: cfg.start.m };
    const root = monthEl.closest('.calendar-view') || document;
    const titleEl = root.querySelector('.cal-title');
    const prevBtn = root.querySelector('.cal-nav-btn.prev');
    const nextBtn = root.querySelector('.cal-nav-btn.next');
    const legendEl = root.querySelector('.cal-legend');
    if (legendEl) {
      legendEl.innerHTML = Object.entries(VENUES).map(([k, v]) => '<span><b>' + k + '</b> ' + v + '</span>').join(' ')
        + '<span class="cal-legend-note">' + cfg.note + '</span>';
    }

    // floating tooltip so details are readable and never clipped
    let tip = document.querySelector('.cal-tip');
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'cal-tip';
      tip.hidden = true;
      document.body.appendChild(tip);
    }

    function cmp(a, b) { return (a.y * 12 + a.m) - (b.y * 12 + b.m); }

    function renderMonth() {
      titleEl.textContent = MONTHS[cur.m] + ' ' + cur.y;
      prevBtn.disabled = cmp(cur, MIN) <= 0;
      nextBtn.disabled = cmp(cur, MAX) >= 0;
      const daysInMonth = new Date(cur.y, cur.m + 1, 0).getDate();
      const startDow = new Date(cur.y, cur.m, 1).getDay();
      let html = '<div class="cal-grid">';
      ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d => { html += '<div class="cal-head">' + d + '</div>'; });
      for (let i = 0; i < startDow; i++) html += '<div class="cal-cell empty"></div>';
      for (let day = 1; day <= daysInMonth; day++) {
        const key = cur.y + '-' + String(cur.m + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        const evs = EVENTS[key];
        if (evs) {
          const chips = evs.map(([v, s, t]) =>
            '<span class="cal-chip ' + s + '" data-venue="' + VENUES[v] + '" data-time="' + t + '" data-status="' + LABEL[s] + '">' + v + '</span>').join('');
          html += '<div class="cal-cell has-event"><span class="cal-day">' + day + '</span>' + chips + '</div>';
        } else {
          html += '<div class="cal-cell"><span class="cal-day">' + day + '</span></div>';
        }
      }
      html += '</div>';
      monthEl.innerHTML = html;

      monthEl.querySelectorAll('.cal-chip').forEach(chip => {
        chip.addEventListener('mouseenter', () => {
          tip.innerHTML = '<strong>' + chip.dataset.venue + '</strong>'
            + '<span>' + chip.dataset.time + '</span>'
            + '<span class="cal-tip-status">' + chip.dataset.status + '</span>';
          tip.hidden = false;
        });
        chip.addEventListener('mousemove', (e) => {
          tip.style.left = (e.clientX + 14) + 'px';
          tip.style.top = (e.clientY + 14) + 'px';
        });
        chip.addEventListener('mouseleave', () => { tip.hidden = true; });
      });
    }
    prevBtn.addEventListener('click', () => { if (cmp(cur, MIN) > 0) { cur.m--; if (cur.m < 0) { cur.m = 11; cur.y--; } renderMonth(); } });
    nextBtn.addEventListener('click', () => { if (cmp(cur, MAX) < 0) { cur.m++; if (cur.m > 11) { cur.m = 0; cur.y++; } renderMonth(); } });
    renderMonth();
  }

  initCalendar(document.getElementById('calMonth'), PERFORMANCE_CALENDAR);
  initCalendar(document.getElementById('buildCalMonth'), BUILD_MEET_CALENDAR);

  // footer contact us toggle
  document.querySelectorAll('.footer-contact').forEach(block => {
    const btn = block.querySelector('.contact-toggle');
    const email = block.querySelector('.contact-email');
    if (btn && email) {
      btn.addEventListener('click', () => {
        email.hidden = false;
        requestAnimationFrame(() => email.classList.add('shown'));
        btn.textContent = 'Email us at:';
        btn.disabled = true;
        btn.style.cursor = 'default';
      });
    }
  });

  // turn inline success messages into a full confirmation screen, hiding the form
  const IG_LINK = '<a href="https://www.instagram.com/harmonyouthfoundation/" target="_blank" rel="noopener" class="fs-success-link">Instagram</a>';
  const SHOWS_LINK = '<a href="performances.html" class="fs-success-link">Performances page</a>';
  const SUCCESS_CONTENT = {
    volunteerForm: {
      title: "You're on the roster",
      body: 'We\'ll email you before the next show that fits your dates. In the meantime, check our ' + SHOWS_LINK + ' for what\'s coming up, and follow us on ' + IG_LINK + ' for the latest updates.'
    },
    makerForm: {
      title: 'Thanks for reaching out',
      body: 'We\'ll follow up by email about the next build meeting or your request. In the meantime, check our ' + SHOWS_LINK + ' for what\'s coming up, and follow us on ' + IG_LINK + ' for the latest updates.'
    },
    helpForm: {
      title: 'Message received',
      body: 'We\'ll be in touch by email soon. In the meantime, check our ' + SHOWS_LINK + ' for what\'s coming up, and follow us on ' + IG_LINK + ' for the latest updates.'
    }
  };
  document.querySelectorAll('[data-fs-success]').forEach(successEl => {
    const panel = successEl.closest('.panel') || successEl.parentElement;
    const form = panel ? panel.querySelector('form') : null;
    const custom = form && SUCCESS_CONTENT[form.id];
    const observer = new MutationObserver(() => {
      const msg = successEl.textContent.trim();
      if (msg && !successEl.classList.contains('fs-success-screen')) {
        if (form) form.style.display = 'none';
        successEl.classList.add('fs-success-screen');
        successEl.innerHTML =
          '<div class="fs-success-title">' + (custom ? custom.title : 'Sent!') + '</div>' +
          '<div class="fs-success-msg">' + (custom ? custom.body : msg) + '</div>';
      }
    });
    observer.observe(successEl, { childList: true, characterData: true, subtree: true });
  });

  // small decorative piano key strips used as dividers on non-home pages (replays on re-entry)
  document.querySelectorAll('.mini-keys').forEach(container => {
    const count = parseInt(container.dataset.count || '24', 10);
    for (let i = 0; i < count; i++) {
      const k = document.createElement('div');
      k.className = 'mini-key';
      container.appendChild(k);
    }
    const keys = container.querySelectorAll('.mini-key');
    let playing = false;
    const mObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !playing) {
          playing = true;
          keys.forEach((k, i) => {
            setTimeout(() => k.classList.add('lit'), i * 26);
            setTimeout(() => k.classList.remove('lit'), 480 + i * 26);
          });
          setTimeout(() => { playing = false; }, 480 + count * 26 + 200);
        }
      });
    }, { threshold: 0.4 });
    mObs.observe(container);
  });
  const groupSelectors = ['.steps .step', '.mission-stats .stat', '.split-grid .panel'];
  groupSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = (i * 0.08) + 's';
    });
  });
  const groupObs = new IntersectionObserver((entries) => {
    entries.forEach(e => e.target.classList.toggle('in', e.isIntersecting));
  }, { threshold: 0.1 });
  document.querySelectorAll(groupSelectors.join(',')).forEach(el => groupObs.observe(el));

  // piano keyboard, only present on the homepage
  const piano = document.getElementById('piano');
  if (piano) {
    const WHITE_COUNT = 28;
    const wrap = document.getElementById('pianoWrap');
    const blackLayer = document.getElementById('bkeys');
    const whiteKeys = [];

    for (let i = 0; i < WHITE_COUNT; i++) {
      const k = document.createElement('div');
      k.className = 'wkey';
      piano.appendChild(k);
      whiteKeys.push(k);
    }

    // standard black key pattern across octaves: after white index 0,1,3,4,5 (skip 2 and 6) within each group of 7
    const blackKeys = [];
    const pattern = [0, 1, 3, 4, 5];
    const slotWidth = 100 / WHITE_COUNT;
    for (let octave = 0; octave * 7 < WHITE_COUNT; octave++) {
      pattern.forEach(p => {
        const idx = octave * 7 + p;
        if (idx < WHITE_COUNT - 1) {
          const bk = document.createElement('div');
          bk.className = 'bkey';
          const leftPercent = (idx + 1) * slotWidth - (slotWidth * 0.32);
          bk.style.left = leftPercent + '%';
          blackLayer.appendChild(bk);
          blackKeys.push(bk);
        }
      });
    }

    // mouse follow: highlight the key nearest the pointer while hovering the keyboard
    let mouseActiveIndex = -1;
    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const ratio = Math.min(Math.max(x / rect.width, 0), 1);
      const idx = Math.floor(ratio * WHITE_COUNT);
      if (idx !== mouseActiveIndex) {
        if (whiteKeys[mouseActiveIndex]) whiteKeys[mouseActiveIndex].classList.remove('active');
        mouseActiveIndex = idx;
        if (whiteKeys[mouseActiveIndex]) whiteKeys[mouseActiveIndex].classList.add('active');
      }
    });
    wrap.addEventListener('mouseleave', () => {
      if (whiteKeys[mouseActiveIndex]) whiteKeys[mouseActiveIndex].classList.remove('active');
      mouseActiveIndex = -1;
    });

    // 3D: the whole keyboard sits in perspective and un-tilts as you scroll
    function updateTilt3D() {
      const heroEl = document.querySelector('.hero');
      if (!heroEl) return;
      const progress = Math.min(Math.max(window.scrollY / (heroEl.offsetHeight * 0.7), 0), 1);
      const rx = 38 - 30 * progress; // 38deg tilted like a player's view, flattens toward 8deg
      wrap.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg)';
    }
    window.addEventListener('scroll', updateTilt3D, { passive: true });
    updateTilt3D();

    // click to actually play notes (WebAudio) — white keys start at C3
    let audioCtx = null;
    function playNote(whiteIndex) {
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const whiteOffsets = [0, 2, 4, 5, 7, 9, 11];
        const midi = 48 + 12 * Math.floor(whiteIndex / 7) + whiteOffsets[whiteIndex % 7];
        const freq = 440 * Math.pow(2, (midi - 69) / 12);
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.1);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.15);
      } catch (err) { /* audio unsupported; stay silent */ }
    }
    whiteKeys.forEach((k, i) => {
      k.addEventListener('click', () => {
        playNote(i);
        k.classList.add('pressed');
        setTimeout(() => k.classList.remove('pressed'), 180);
      });
    });

    // scroll animation: as the hero scrolls past, keys press down left to right in sequence
    let lastScrollIndex = -1;
    function updateOnScroll() {
      const heroEl = document.querySelector('.hero');
      if (!heroEl) return;
      const heroHeight = heroEl.offsetHeight;
      const scrollY = window.scrollY;
      const progress = Math.min(Math.max(scrollY / (heroHeight * 0.8), 0), 1);
      const activeIndex = Math.floor(progress * WHITE_COUNT);
      if (activeIndex !== lastScrollIndex) {
        whiteKeys.forEach((k, i) => {
          if (i <= activeIndex && i !== mouseActiveIndex) {
            k.classList.add('active');
          } else if (i !== mouseActiveIndex) {
            k.classList.remove('active');
          }
        });
        blackKeys.forEach((k, i) => {
          const approxWhiteIdx = Math.round((i / blackKeys.length) * WHITE_COUNT);
          if (approxWhiteIdx <= activeIndex) {
            k.classList.add('active');
          } else {
            k.classList.remove('active');
          }
        });
        lastScrollIndex = activeIndex;
      }
    }
    window.addEventListener('scroll', updateOnScroll);
    updateOnScroll();
  }
});
