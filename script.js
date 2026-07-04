document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════════════════════
     RAKIB SOJIB PORTFOLIO — script.js
     Features: Theme · Nav · Counters · Scramble · Typewriter
               Cursor · Progress · Particles · Parallax · Tilt
               Magnetic · Back-to-Top · Mobile Nav · Confetti
  ══════════════════════════════════════════════════════════ */

  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ── Year ──────────────────────────────────────────────── */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ── Theme Toggle ──────────────────────────────────────── */
  const themeToggle  = document.getElementById('themeToggle');
  const themeIcon    = document.getElementById('themeIcon');
  const savedTheme   = localStorage.getItem('rs-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  const setTheme = (mode) => {
    const isLight = mode === 'light';
    document.body.classList.toggle('light', isLight);
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', isLight ? 'sun' : 'moon');
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }
    localStorage.setItem('rs-theme', mode);
  };
  setTheme(savedTheme || (prefersLight ? 'light' : 'dark'));
  themeToggle?.addEventListener('click', () =>
    setTheme(document.body.classList.contains('light') ? 'dark' : 'light')
  );

  /* ── Nav Scroll ────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  const fab = document.getElementById('fab');
  const onScroll = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 40);
    if (fab) fab.style.opacity = window.scrollY > 40 ? '1' : '0.7';
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
  menu?.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));

  /* ── Active Nav Links ──────────────────────────────────── */
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = [...navLinks]
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  const updateActiveNav = () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 150) current = s.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
  };
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ── Scroll Progress Bar ───────────────────────────────── */
  const progressBar = document.getElementById('scrollProgressBar');
  const updateProgress = () => {
    if (!progressBar) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : '0%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ── Reveal on Scroll ──────────────────────────────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal-line,.reveal-fade,.reveal-up,.reveal-scale,.status-badge')
    .forEach(el => io.observe(el));

  /* ── Animated Counters ─────────────────────────────────── */
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      let current = 0;
      const inc = target / (1600 / 16);
      const t = setInterval(() => {
        current = Math.min(current + inc, target);
        el.textContent = Math.round(current);
        if (current >= target) clearInterval(t);
      }, 16);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter__num[data-target]').forEach(c => counterObs.observe(c));

  /* ── Text Scramble on Hero Heading ────────────────────── */
  const scrambleHeading = () => {
    const lines = document.querySelectorAll('.hero__heading .reveal-line');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#&';
    lines.forEach((line, idx) => {
      // Skip gradient line (has child elements)
      if (line.children.length) return;
      const original = line.textContent;
      let frame = 0;
      const total = 20;
      setTimeout(() => {
        const iv = setInterval(() => {
          line.textContent = original.split('').map((ch, i) => {
            if (ch === ' ' || ch === '&') return ch;
            if (frame > (i / original.length) * total) return ch;
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('');
          if (++frame > total) { line.textContent = original; clearInterval(iv); }
        }, 38);
      }, idx * 220 + 400);
    });
  };
  // Run scramble once on load after a short delay
  setTimeout(scrambleHeading, 300);

  /* ── Typewriter Effect ─────────────────────────────────── */
  const twEl = document.getElementById('typewriter');
  if (twEl) {
    const roles = ['Flutter apps', 'AI videos', 'Telegram bots', 'blockchain tools', 'automation systems'];
    let ri = 0, ci = 0, deleting = false;
    const type = () => {
      const word = roles[ri];
      twEl.textContent = deleting ? word.slice(0, ci - 1) : word.slice(0, ci + 1);
      deleting ? ci-- : ci++;
      let delay = deleting ? 55 : 95;
      if (!deleting && ci === word.length) { delay = 1800; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 350; }
      setTimeout(type, delay);
    };
    setTimeout(type, 1400);
  }

  /* ── Particle Canvas: Cosmic Starfield Warp ───────────────── */
  const canvas = document.getElementById('particleCanvas');
  if (canvas && window.innerWidth > 768) {
    const ctx = canvas.getContext('2d');
    let W, H, cx, cy;
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      cx = W / 2;
      cy = H / 2;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Track scroll velocity for star acceleration
    let scrollSpeed = 0;
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      scrollSpeed = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
    }, { passive: true });

    const COLORS = ['#c084fc', '#06b6d4', '#db2777', '#7c3aed', '#ffffff'];
    const numStars = 100;
    const stars = Array.from({ length: numStars }, () => ({
      x: (Math.random() - 0.5) * window.innerWidth,
      y: (Math.random() - 0.5) * window.innerHeight,
      z: Math.random() * window.innerWidth,
      r: Math.random() * 1.5 + 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    let animId;
    const draw = () => {
      const isLight = document.body.classList.contains('light');
      ctx.fillStyle = isLight ? 'rgba(240, 242, 250, 0.28)' : 'rgba(2, 2, 5, 0.18)';
      ctx.fillRect(0, 0, W, H);

      // Accelerate stars during scroll, decay speed back to normal afterward
      const warpFactor = 1.6 + Math.min(scrollSpeed * 0.18, 14);
      scrollSpeed *= 0.94; // slowly decay speed

      stars.forEach(s => {
        s.z -= warpFactor;
        if (s.z <= 0) {
          s.z = W;
          s.x = (Math.random() - 0.5) * W;
          s.y = (Math.random() - 0.5) * H;
        }

        const k = 400 / s.z;
        const px = s.x * k + cx;
        const py = s.y * k + cy;

        if (px >= 0 && px <= W && py >= 0 && py <= H) {
          const size = s.r * k * 0.45;
          ctx.beginPath();
          ctx.arc(px, py, Math.min(size, 3), 0, Math.PI * 2);
          ctx.fillStyle = isLight ? 'rgba(124, 58, 237, 0.4)' : s.color;
          ctx.fill();
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(animId); else draw();
    });
  }

  /* ── Custom Cursor ─────────────────────────────────────── */
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');
  if (cursor && cursorTrail && window.innerWidth > 768 && window.matchMedia('(hover: hover)').matches) {
    let mx = -200, my = -200, tx = -200, ty = -200;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    }, { passive: true });

    const trailAnim = () => {
      tx += (mx - tx) * 0.1;
      ty += (my - ty) * 0.1;
      cursorTrail.style.left = tx + 'px';
      cursorTrail.style.top  = ty + 'px';
      requestAnimationFrame(trailAnim);
    };
    trailAnim();

    document.querySelectorAll('a,button,.service-card,.project-card,.about-card,.testimonial-card,.contact-card').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('hovering'); cursorTrail.classList.add('hovering'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('hovering'); cursorTrail.classList.remove('hovering'); });
    });
  }

  /* ── Mouse Parallax on Profile Orb ────────────────────── */
  const profileOrb = document.querySelector('.profile-orb');
  if (profileOrb && window.matchMedia('(hover: hover)').matches && window.innerWidth > 900) {
    document.addEventListener('mousemove', e => {
      const dx = (e.clientX - window.innerWidth  / 2) / window.innerWidth;
      const dy = (e.clientY - window.innerHeight / 2) / window.innerHeight;
      profileOrb.style.transform = `translate(${dx * 10}px, ${dy * 10}px)`;
    }, { passive: true });
  }

  /* ── 3D Tilt on Cards ──────────────────────────────────── */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.project-card,.service-card,.testimonial-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ── Magnetic Buttons ──────────────────────────────────── */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn--glow').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * 0.28;
        const y = (e.clientY - r.top  - r.height / 2) * 0.28;
        btn.style.transform = `translate(${x}px, ${y}px) translateY(-3px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ── Back to Top Button ────────────────────────────────── */
  const backToTop    = document.getElementById('backToTop');
  const progressRing = document.querySelector('.back-to-top__progress');
  if (backToTop) {
    const circumference = 2 * Math.PI * 20; // r=20
    const updateBTT = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct   = total > 0 ? window.scrollY / total : 0;
      backToTop.classList.toggle('visible', window.scrollY > 300);
      if (progressRing) progressRing.style.strokeDashoffset = circumference - pct * circumference;
    };
    window.addEventListener('scroll', updateBTT, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Mobile Bottom Nav Active ──────────────────────────── */
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  window.addEventListener('scroll', () => {
    let current = 'home';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 160) current = s.id; });
    mobileNavItems.forEach(item => item.classList.toggle('active', item.dataset.section === current));
  }, { passive: true });

  mobileNavItems.forEach(item => {
    item.addEventListener('click', e => {
      const href = item.getAttribute('href');
      const target = href && href !== '#' && document.querySelector(href);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ── Confetti Burst on CTA Click ───────────────────────── */
  const CONFETTI_COLORS = ['#6c63ff','#22d3ee','#f472b6','#4ade80','#fbbf24','#a78bfa','#fff'];
  const spawnConfetti = (x, y) => {
    for (let i = 0; i < 24; i++) {
      const dot = document.createElement('div');
      const size = Math.random() * 9 + 4;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 130 + 60;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const isCircle = Math.random() > 0.4;
      Object.assign(dot.style, {
        position: 'fixed',
        width: size + 'px', height: size + 'px',
        borderRadius: isCircle ? '50%' : '2px',
        background: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        left: x + 'px', top: y + 'px',
        pointerEvents: 'none',
        zIndex: '99999',
        transform: 'translate(-50%,-50%)',
        transition: `all ${0.55 + Math.random() * 0.5}s cubic-bezier(0.22,1,0.36,1)`,
        opacity: '1',
      });
      document.body.appendChild(dot);
      requestAnimationFrame(() => {
        dot.style.left    = (x + vx) + 'px';
        dot.style.top     = (y + vy) + 'px';
        dot.style.opacity = '0';
        dot.style.transform = `translate(-50%,-50%) rotate(${Math.random()*360}deg) scale(0.2)`;
      });
      setTimeout(() => dot.remove(), 1200);
    }
  };
  document.querySelectorAll('.btn--glow, .contact-card--whatsapp').forEach(btn => {
    btn.addEventListener('click', e => spawnConfetti(e.clientX, e.clientY));
  });

  /* ── Smooth Hash Scroll ────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── Background Canvas Parallax ────────────────────────── */
  window.addEventListener('scroll', () => {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
      canvas.style.transform = `translateY(${window.scrollY * 0.15}px)`;
    }
  }, { passive: true });

  /* ── Web Audio Ambient Music Synth (Theta Waves) ──────── */
  let audioCtx = null;
  let mainGain = null;
  let droneOsc1 = null;
  let droneOsc2 = null;
  let droneOsc3 = null;
  let binauralL = null;
  let binauralR = null;
  let melodyInterval = null;
  let isPlayingMusic = false;

  const initAudio = () => {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    mainGain = audioCtx.createGain();
    mainGain.gain.setValueAtTime(0, audioCtx.currentTime);
    mainGain.connect(audioCtx.destination);

    // Warm Lowpass filter (blocks digital harshness, keeps it extremely soft/calm)
    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(320, audioCtx.currentTime); // warmth cut-off
    lowpass.connect(mainGain);
    
    // 1. Binaural Theta Beats (Left: 110 Hz, Right: 116 Hz -> 6 Hz Theta wave)
    const merger = audioCtx.createChannelMerger(2);
    
    binauralL = audioCtx.createOscillator();
    binauralL.frequency.setValueAtTime(110, audioCtx.currentTime);
    const gainL = audioCtx.createGain();
    gainL.gain.value = 0.22; // increased volume
    binauralL.connect(gainL);
    gainL.connect(merger, 0, 0);
    
    binauralR = audioCtx.createOscillator();
    binauralR.frequency.setValueAtTime(116, audioCtx.currentTime);
    const gainR = audioCtx.createGain();
    gainR.gain.value = 0.22; // increased volume
    binauralR.connect(gainR);
    gainR.connect(merger, 0, 1);
    
    merger.connect(lowpass);
    
    // 2. Deep Space Ambient Chord Drone (A Minor Chord: A2: 110Hz, C3: 130.81Hz, E3: 164.81Hz)
    droneOsc1 = audioCtx.createOscillator();
    droneOsc1.type = 'triangle';
    droneOsc1.frequency.setValueAtTime(110, audioCtx.currentTime); // root
    const droneGain1 = audioCtx.createGain();
    droneGain1.gain.value = 0.28;
    droneOsc1.connect(droneGain1);
    droneGain1.connect(lowpass);
    
    droneOsc2 = audioCtx.createOscillator();
    droneOsc2.type = 'triangle';
    droneOsc2.frequency.setValueAtTime(130.81, audioCtx.currentTime); // minor third
    const droneGain2 = audioCtx.createGain();
    droneGain2.gain.value = 0.24;
    droneOsc2.connect(droneGain2);
    droneGain2.connect(lowpass);

    droneOsc3 = audioCtx.createOscillator();
    droneOsc3.type = 'triangle';
    droneOsc3.frequency.setValueAtTime(164.81, audioCtx.currentTime); // fifth
    const droneGain3 = audioCtx.createGain();
    droneGain3.gain.value = 0.24;
    droneOsc3.connect(droneGain3);
    droneGain3.connect(lowpass);
    
    // Slow LFO to modulate base drone volume (breathing ocean wave effect)
    const lfo = audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.06, audioCtx.currentTime); // 16s cycle
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 0.08;
    lfo.connect(lfoGain);
    lfoGain.connect(droneGain1.gain);
    lfoGain.connect(droneGain2.gain);
    
    binauralL.start();
    binauralR.start();
    droneOsc1.start();
    droneOsc2.start();
    droneOsc3.start();
    lfo.start();
    
    // 3. Dreamy Floating Pentatonic Space Melodies (A Minor Pentatonic Scale)
    const pentatonicScale = [220.00, 261.63, 293.66, 329.63, 392.00, 440.00];
    
    const delayNode = audioCtx.createDelay(1.0);
    delayNode.delayTime.value = 0.65; // 650ms delay
    const delayFeedback = audioCtx.createGain();
    delayFeedback.gain.value = 0.48; // echo feedback volume
    
    delayNode.connect(delayFeedback);
    delayFeedback.connect(delayNode);
    
    const melodyGain = audioCtx.createGain();
    melodyGain.gain.value = 0.24; // increased melody volume
    melodyGain.connect(lowpass);
    melodyGain.connect(delayNode);
    delayNode.connect(lowpass);
    
    const playRandomNote = () => {
      if (!isPlayingMusic || audioCtx.state === 'suspended') return;
      const note = pentatonicScale[Math.floor(Math.random() * pentatonicScale.length)];
      
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, audioCtx.currentTime);
      
      const envelope = audioCtx.createGain();
      envelope.gain.setValueAtTime(0, audioCtx.currentTime);
      envelope.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 1.6); // attack 1.6s
      envelope.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 6.5); // release 4.9s
      
      // Random stereo panner to drift note left/right in headphones
      const panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
      if (panner) {
        panner.pan.setValueAtTime((Math.random() - 0.5) * 1.6, audioCtx.currentTime);
        osc.connect(envelope);
        envelope.connect(panner);
        panner.connect(melodyGain);
      } else {
        osc.connect(envelope);
        envelope.connect(melodyGain);
      }
      
      osc.start();
      osc.stop(audioCtx.currentTime + 7.5);
    };
    
    playRandomNote();
    melodyInterval = setInterval(playRandomNote, 5800); // play note every 5.8s
  };

  const startMusic = () => {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    mainGain.gain.linearRampToValueAtTime(1.0, audioCtx.currentTime + 2.5);
    isPlayingMusic = true;
    
    const btn = document.getElementById('musicToggle');
    const icon = document.getElementById('musicIcon');
    btn?.classList.add('playing');
    if (icon && typeof lucide !== 'undefined') {
      icon.setAttribute('data-lucide', 'volume-2');
      lucide.createIcons();
    }
  };

  const stopMusic = () => {
    if (!mainGain || !audioCtx) return;
    
    mainGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
    isPlayingMusic = false;
    
    setTimeout(() => {
      if (!isPlayingMusic && audioCtx) {
        audioCtx.suspend();
      }
    }, 1600);
    
    const btn = document.getElementById('musicToggle');
    const icon = document.getElementById('musicIcon');
    btn?.classList.remove('playing');
    if (icon && typeof lucide !== 'undefined') {
      icon.setAttribute('data-lucide', 'music');
      lucide.createIcons();
    }
  };

  const musicToggle = document.getElementById('musicToggle');
  musicToggle?.addEventListener('click', () => {
    if (isPlayingMusic) {
      stopMusic();
    } else {
      startMusic();
    }
  });

});