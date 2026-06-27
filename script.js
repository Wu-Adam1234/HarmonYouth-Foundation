// mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  // language toggle: EN / ZH
  const langBtn = document.getElementById('langToggle');
  if (langBtn) {
    let zh = false;
    langBtn.addEventListener('click', () => {
      zh = !zh;
      document.querySelectorAll('[data-zh]').forEach(el => {
        if (el.dataset.en === undefined) el.dataset.en = el.textContent;
        el.textContent = zh ? el.dataset.zh : el.dataset.en;
      });
      document.querySelectorAll('[data-zh-placeholder]').forEach(el => {
        if (el.dataset.enPlaceholder === undefined) el.dataset.enPlaceholder = el.placeholder;
        el.placeholder = zh ? el.dataset.zhPlaceholder : el.dataset.enPlaceholder;
      });
      langBtn.textContent = zh ? 'EN' : '中文';
      document.documentElement.lang = zh ? 'zh' : 'en';
    });
  }

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.15 });
  revealEls.forEach(el => obs.observe(el));

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
