/* ═══════════════════════════════════════════════
   MUHAMMAD ALI KHAN — PORTFOLIO SCRIPT
   Author: MAK | Version: 1.0
   ═══════════════════════════════════════════════ */

'use strict';

/* ════════ 1. PRELOADER ════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if (pre) {
      pre.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  }, 2000);
});

/* ════════ 2. CUSTOM CURSOR ════════════════════ */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let rafId;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animate() {
    // Dot follows instantly
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    // Ring lags slightly
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    rafId = requestAnimationFrame(animate);
  }
  animate();

  // Hover state on interactive elements
  const hoverEls = 'a, button, .skill-card, .proj-card, .stat-card, .tl-card, .exp-card, input, textarea, .pf-btn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverEls)) document.body.classList.add('hovering');
  });
  document.addEventListener('mouseout',  e => {
    if (e.target.closest(hoverEls)) document.body.classList.remove('hovering');
  });

  // Hide on leave / show on enter
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
})();

/* ════════ 3. PARTICLE CANVAS ════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.color = Math.random() > 0.7
        ? '124,58,237'   // purple
        : '0,245,212';   // neon teal
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  function createParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  // Draw connecting lines between close particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,245,212,${0.04 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', () => { resize(); createParticles(70); });
  createParticles(70);
  loop();
})();

/* ════════ 4. NAVBAR SCROLL BEHAVIOR ════════════ */
(function initNavbar() {
  const nav   = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');
  const secs  = document.querySelectorAll('section[id]');
  const backTop = document.getElementById('back-top');
  if (!nav) return;

  function onScroll() {
    const y = window.scrollY;

    // Scrolled style
    nav.classList.toggle('scrolled', y > 30);

    // Back-to-top
    if (backTop) backTop.classList.toggle('visible', y > 400);

    // Active nav link
    let current = '';
    secs.forEach(sec => {
      if (y >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Back to top
  if (backTop) {
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
})();

/* ════════ 5. HAMBURGER / MOBILE MENU ═══════════ */
(function initMobileMenu() {
  const ham   = document.getElementById('hamburger');
  const menu  = document.getElementById('mobile-menu');
  const close = document.getElementById('mobile-close');
  const links = document.querySelectorAll('.mob-link');

  function openMenu() {
    menu.classList.add('open');
    ham.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menu.classList.remove('open');
    ham.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (ham)   ham.addEventListener('click', () => menu.classList.contains('open') ? closeMenu() : openMenu());
  if (close) close.addEventListener('click', closeMenu);
  links.forEach(l => l.addEventListener('click', closeMenu));
})();

/* ════════ 6. THEME TOGGLE ══════════════════════ */
(function initTheme() {
  const btn  = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const body = document.body;
  let dark   = localStorage.getItem('mak-theme') !== 'light';

  function apply() {
    body.setAttribute('data-theme', dark ? 'dark' : 'light');
    body.classList.toggle('dark-theme',  dark);
    body.classList.toggle('light-theme', !dark);
    if (icon) {
      icon.className = dark ? 'ph ph-sun' : 'ph ph-moon';
    }
    localStorage.setItem('mak-theme', dark ? 'dark' : 'light');
  }

  apply();
  if (btn) btn.addEventListener('click', () => { dark = !dark; apply(); });
})();

/* ════════ 7. TYPED EFFECT ══════════════════════ */
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Web Experiences.',
    'Stunning UIs.',
    'React Apps.',
    'Clean Code.',
    'Digital Magic.',
    'Modern Interfaces.'
  ];

  let pi = 0, ci = 0, deleting = false;
  const speed = { type: 75, delete: 40, pause: 1800 };

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) {
        deleting = true;
        return setTimeout(tick, speed.pause);
      }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? speed.delete : speed.type);
  }

  setTimeout(tick, 800);
})();

/* ════════ 8. SCROLL REVEAL ════════════════════ */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach((el, i) => {
    // Staggered delay for siblings
    const delay = Math.min(i % 4, 3) * 100;
    el.style.transitionDelay = delay + 'ms';
    obs.observe(el);
  });
})();

/* ════════ 9. SKILL BAR ANIMATIONS ══════════════ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.sk-bar-fill');
  if (!bars.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = e.target.getAttribute('data-width');
        setTimeout(() => { e.target.style.width = target + '%'; }, 200);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => obs.observe(b));
})();

/* ════════ 10. COUNTER ANIMATION ═════════════════ */
(function initCounters() {
  const nums = document.querySelectorAll('.stat-num');
  if (!nums.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.getAttribute('data-target'));
      const dur    = 1600;
      const step   = Math.ceil(target / (dur / 16));
      let cur = 0;

      const run = () => {
        cur = Math.min(cur + step, target);
        el.textContent = cur;
        if (cur < target) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });

  nums.forEach(n => obs.observe(n));
})();

/* ════════ 11. PROJECT FILTER ════════════════════ */
(function initFilter() {
  const btns  = document.querySelectorAll('.pf-btn');
  const cards = document.querySelectorAll('.proj-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        const show = filter === 'all' || card.getAttribute('data-category') === filter;
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (show) {
          card.classList.remove('hidden');
          card.style.opacity = '1';
          card.style.transform = '';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (!show) card.classList.add('hidden');
          }, 300);
        }
      });
    });
  });
})();

/* ════════ 12. CONTACT FORM ═════════════════════ */
(function initForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name  = form.querySelector('#cf-name').value.trim();
    const email = form.querySelector('#cf-email').value.trim();
    const msg   = form.querySelector('#cf-msg').value.trim();

    if (!name || !email || !msg) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Simulate send
    setTimeout(() => {
      showStatus('✓ Message sent! I\'ll get back to you within 24 hours.', 'success');
      form.reset();
      btn.textContent = '✓ Message Sent';
      setTimeout(() => {
        btn.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Send Message';
        btn.disabled = false;
      }, 3000);
    }, 1600);
  });

  function showStatus(msg, type) {
    if (!status) return;
    status.textContent = msg;
    status.className   = 'form-status ' + type;
    setTimeout(() => { if (status.textContent === msg) status.textContent = ''; }, 5000);
  }
})();

/* ════════ 13. SMOOTH SCROLL (for all nav links) ═ */
(function initSmooth() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ════════ 14. SCROLLTOSECTION helper ═══════════ */
window.scrollToSection = function(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/* ════════ 15. MOUSE PARALLAX on Hero Glows ═════ */
(function initParallax() {
  const g1 = document.querySelector('.glow-1');
  const g2 = document.querySelector('.glow-2');
  if (!g1 || !g2) return;

  let ticking = false;
  document.addEventListener('mousemove', e => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const xFrac = e.clientX / window.innerWidth  - 0.5;
      const yFrac = e.clientY / window.innerHeight - 0.5;
      g1.style.transform = `translate(${xFrac * 30}px, ${yFrac * 30}px)`;
      g2.style.transform = `translate(${xFrac * -25}px, ${yFrac * -25}px)`;
      ticking = false;
    });
    ticking = true;
  });
})();

/* ════════ 16. CV BUTTON (fake download) ════════ */
(function initCV() {
  const btn = document.getElementById('cv-btn');
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.preventDefault();
    // In production replace with real CV link
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="ph ph-check"></i> Downloaded!';
    setTimeout(() => { btn.innerHTML = orig; }, 2500);
  });
})();

/* ════════ 17. FLOATING ELEMENTS Mouse Tilt ═════ */
(function initTilt() {
  document.querySelectorAll('.proj-card, .stat-card, .tl-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(700px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ════════ 18. SECTION TRANSITION glow line ═════ */
(function initSectionLines() {
  // Add glow underline animation when sections enter view
  const secs = document.querySelectorAll('.section-heading');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animation = 'none';
        void e.target.offsetWidth;
        e.target.style.animation = '';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  secs.forEach(s => obs.observe(s));
})();

/* ════════ 19. ACTIVE LINK highlight in mobile ══ */
(function updateMobileActiveLink() {
  const links = document.querySelectorAll('.mob-link');
  const secs  = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let cur = '';
    secs.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) cur = s.id;
    });
    links.forEach(l => {
      l.style.color = l.getAttribute('href') === '#' + cur
        ? 'var(--neon)'
        : '';
    });
  }, { passive: true });
})();

/* ════════ 20. CONSOLE GREETING ═════════════════ */
console.log('%c👨‍💻 Muhammad Ali Khan Portfolio', 'font-size:16px; font-weight:bold; color:#00f5d4;');
console.log('%cBuilt with HTML + CSS + Vanilla JS', 'font-size:12px; color:#6b7280;');
