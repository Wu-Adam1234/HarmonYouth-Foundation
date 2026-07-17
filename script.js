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
  const glowTargets = document.querySelectorAll('.step, .panel, .gofundme-fallback, .wechat-block, .volunteer-perk, .past-show, .recruiting-banner .section-inner');
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
  const pEmail = document.getElementById('vparentemail');
  const pEmail2 = document.getElementById('vparentemail2');
  const vMatchError = document.getElementById('vemailMatchError');
  if (pEmail && pEmail2 && vMatchError) {
    function emailsMatch() {
      return pEmail.value.trim().toLowerCase() === pEmail2.value.trim().toLowerCase();
    }
    function updateMatchUI() {
      if (pEmail2.value && !emailsMatch()) {
        vMatchError.textContent = "These don't match yet.";
        pEmail2.style.borderColor = 'var(--rose)';
      } else {
        vMatchError.textContent = '';
        pEmail2.style.borderColor = pEmail2.value ? 'var(--sage)' : '';
      }
    }
    pEmail2.addEventListener('input', updateMatchUI);
    pEmail.addEventListener('input', updateMatchUI);
    const vForm = document.getElementById('volunteerForm');
    if (vForm) {
      vForm.addEventListener('submit', (e) => {
        if (!emailsMatch()) {
          e.preventDefault();
          e.stopImmediatePropagation();
          vMatchError.textContent = 'Please make sure both parent or guardian email fields match before sending.';
          pEmail2.focus();
        }
      }, true);
    }
  }

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
