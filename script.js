document.addEventListener('DOMContentLoaded', () => {

  /* ── Year ──────────────────────────────────────────────── */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ── Theme Toggle ──────────────────────────────────────── */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = document.getElementById('themeIcon');
  const savedTheme  = localStorage.getItem('rs-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  const setTheme = (mode) => {
    const isLight = mode === 'light';
    document.body.classList.toggle('light', isLight);
    if (themeIcon) themeIcon.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('rs-theme', mode);
  };
  setTheme(savedTheme || (prefersLight ? 'light' : 'dark'));
  themeToggle?.addEventListener('click', () => {
    setTheme(document.body.classList.contains('light') ? 'dark' : 'light');
  });

  /* ── Nav Scroll ────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  const fab = document.getElementById('fab');
  const onScroll = () => {
    const scrolled = window.scrollY > 40;
    nav?.classList.toggle('scrolled', scrolled);
    if (fab) fab.style.opacity = scrolled ? '1' : '0.7';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile Menu ───────────────────────────────────────── */
  const burger = document.getElementById('navBurger');
  const menu   = document.getElementById('navMenu');

  const closeMenu = () => {
    burger?.classList.remove('open');
    menu?.classList.remove('open');
    burger?.setAttribute('aria-expanded', 'false');
    burger?.setAttribute('aria-label', 'Open menu');
  };
  burger?.addEventListener('click', () => {
    const isOpen = menu?.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  /* ── Active Nav Links ──────────────────────────────────── */
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = [...navLinks]
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });

  /* ── Reveal on Scroll ──────────────────────────────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.reveal-line, .reveal-fade, .reveal-up, .reveal-scale, .status-badge'
  ).forEach(el => io.observe(el));

  /* ── Animated Counters ─────────────────────────────────── */
  const counters = document.querySelectorAll('.counter__num[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const duration = 1600;
      const step = 16;
      const increment = target / (duration / step);
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + increment, target);
        el.textContent = Math.round(current);
        if (current >= target) clearInterval(timer);
      }, step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ── Particle Canvas ───────────────────────────────────── */
  const canvas = document.getElementById('particleCanvas');
  if (canvas && window.innerWidth > 768) {
    const ctx = canvas.getContext('2d');
    let W, H, particles;

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const PARTICLE_COUNT = 60;
    const COLORS = [
      'rgba(108,99,255,',
      'rgba(34,211,238,',
      'rgba(167,139,250,',
    ];

    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: Math.random() * 0.5 + 0.1,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    // Stop animation when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else draw();
    });
  }

  /* ── Mouse Parallax on Profile Orb ────────────────────── */
  const profileOrb = document.querySelector('.profile-orb');
  if (profileOrb && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      profileOrb.style.transform = `translate(${dx * 8}px, ${dy * 8}px)`;
    }, { passive: true });
  }

  /* ── Cursor Glow ───────────────────────────────────────── */
  if (window.matchMedia('(hover: hover)').matches) {
    const glow = document.createElement('div');
    Object.assign(glow.style, {
      position: 'fixed',
      width: '420px',
      height: '420px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: '1',
      transform: 'translate(-50%,-50%)',
      transition: 'opacity .5s',
      willChange: 'left, top',
    });
    document.body.appendChild(glow);
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    }, { passive: true });
  }

  /* ── Service Card Mouse Glow ───────────────────────────── */
  document.querySelectorAll('.service-card, .project-card, .about-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    }, { passive: true });
  });

  /* ── Smooth hash scroll ─────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

});