// mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
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
          goTo(i);
          startAutoplay();
        });
      });
      startAutoplay();
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

  // turn inline success messages into a full confirmation screen, hiding the form
  document.querySelectorAll('[data-fs-success]').forEach(successEl => {
    const panel = successEl.closest('.panel') || successEl.parentElement;
    const form = panel ? panel.querySelector('form') : null;
    const observer = new MutationObserver(() => {
      const msg = successEl.textContent.trim();
      if (msg && !successEl.classList.contains('fs-success-screen')) {
        if (form) form.style.display = 'none';
        successEl.classList.add('fs-success-screen');
        successEl.innerHTML =
          '<div class="fs-success-title">Sent!</div>' +
          '<div class="fs-success-msg">' + msg + '</div>';
      }
    });
    observer.observe(successEl, { childList: true, characterData: true, subtree: true });
  });

  // small decorative piano key strips used as dividers on non-home pages
  document.querySelectorAll('.mini-keys').forEach(container => {
    const count = parseInt(container.dataset.count || '24', 10);
    for (let i = 0; i < count; i++) {
      const k = document.createElement('div');
      k.className = 'mini-key';
      container.appendChild(k);
    }
    const keys = container.querySelectorAll('.mini-key');
    let played = false;
    const mObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !played) {
          played = true;
          keys.forEach((k, i) => {
            setTimeout(() => k.classList.add('lit'), i * 26);
            setTimeout(() => k.classList.remove('lit'), 480 + i * 26);
          });
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
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
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
