/* ═══════════════════════════════════════════════════════════
   RAKIB SOJIB — Portfolio v2 · script.js
   ═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.lucide) lucide.createIcons();

  /* ── Year ── */
  const yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ── Theme ── */
  const setTheme = (mode) => {
    document.body.classList.toggle('light', mode === 'light');
    localStorage.setItem('rs-theme', mode);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = mode === 'light' ? '#fafaf8' : '#07070a';
  };
  setTheme(localStorage.getItem('rs-theme') || 'dark');
  $('#themeToggle')?.addEventListener('click', () =>
    setTheme(document.body.classList.contains('light') ? 'dark' : 'light'));

  /* ── Nav state + progress ── */
  const nav = $('#nav');
  const progress = $('#progress');
  const onScroll = () => {
    const y = window.scrollY;
    nav?.classList.toggle('scrolled', y > 20);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = max > 0 ? `${(y / max) * 100}%` : '0';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Active section (desktop nav + mobile dock) ── */
  const navLinks = $$('.nav__link');
  const dockItems = $$('.dock__item');
  const sections = ['home', 'about', 'projects', 'services', 'contact']
    .map(id => document.getElementById(id)).filter(Boolean);
  const setActive = (id) => {
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
    dockItems.forEach(d => d.classList.toggle('active', d.dataset.section === id));
  };
  const updateActive = () => {
    let current = 'home';
    const mark = window.innerHeight * 0.35;
    sections.forEach(s => { if (s.getBoundingClientRect().top <= mark) current = s.id; });
    setActive(current);
  };
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();

  /* ── Reveal on scroll ── */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ── Counters ── */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const dur = 1600;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => countIO.observe(el));

  /* ── Typewriter ── */
  const tw = $('#typewriter');
  if (tw && !reduceMotion) {
    const words = ['Flutter apps', 'Telegram bots', 'AI videos', 'mini apps', 'automation systems'];
    let wi = 0, ci = words[0].length, deleting = true;
    const loop = () => {
      const w = words[wi];
      ci += deleting ? -1 : 1;
      tw.textContent = w.slice(0, ci);
      let delay = deleting ? 45 : 85;
      if (!deleting && ci === w.length) { deleting = true; delay = 1900; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 300; }
      setTimeout(loop, delay);
    };
    setTimeout(loop, 2200);
  }

  /* ── Local time (Dhaka) ── */
  const timeEl = $('#localTime');
  if (timeEl) {
    const fmt = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Dhaka' });
    const tick = () => { timeEl.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 30000);
  }

  if (canHover && !reduceMotion) {
    /* ── Cursor spotlight on cards ── */
    $$('.spot').forEach(card => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });

    /* ── Magnetic buttons ── */
    $$('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.22;
        const y = (e.clientY - r.top - r.height / 2) * 0.3;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });

    /* ── Hero parallax on floating cards ── */
    const portrait = $('#portrait');
    const floats = $$('.float', portrait || document);
    const hero = $('.hero');
    if (portrait && hero) {
      hero.addEventListener('pointermove', (e) => {
        const dx = e.clientX / window.innerWidth - 0.5;
        const dy = e.clientY / window.innerHeight - 0.5;
        floats.forEach(f => {
          const d = +f.dataset.depth || 10;
          f.style.transform = `translate(${dx * d}px, ${dy * d}px)`;
        });
        $('.portrait__frame', portrait).style.transform =
          `perspective(1000px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg)`;
      });
      hero.addEventListener('pointerleave', () => {
        floats.forEach(f => { f.style.transform = ''; });
        $('.portrait__frame', portrait).style.transform = '';
      });
    }
  }

  /* ── Ambient music (Web Audio synth) ── */
  let audioCtx = null, mainGain = null, melodyTimer = null, playing = false;
  const musicBtn = $('#musicToggle');

  const initAudio = () => {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    mainGain = audioCtx.createGain();
    mainGain.gain.value = 0;
    mainGain.connect(audioCtx.destination);

    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 320;
    lowpass.connect(mainGain);

    // binaural theta (110 / 116 Hz)
    const merger = audioCtx.createChannelMerger(2);
    [[110, 0], [116, 1]].forEach(([f, ch]) => {
      const o = audioCtx.createOscillator();
      o.frequency.value = f;
      const g = audioCtx.createGain(); g.gain.value = 0.22;
      o.connect(g); g.connect(merger, 0, ch); o.start();
    });
    merger.connect(lowpass);

    // A-minor drone
    const droneGains = [[110, 0.28], [130.81, 0.24], [164.81, 0.24]].map(([f, v]) => {
      const o = audioCtx.createOscillator(); o.type = 'triangle'; o.frequency.value = f;
      const g = audioCtx.createGain(); g.gain.value = v;
      o.connect(g); g.connect(lowpass); o.start();
      return g;
    });
    const lfo = audioCtx.createOscillator(); lfo.frequency.value = 0.06;
    const lfoGain = audioCtx.createGain(); lfoGain.gain.value = 0.08;
    lfo.connect(lfoGain); lfoGain.connect(droneGains[0].gain); lfoGain.connect(droneGains[1].gain); lfo.start();

    // pentatonic melody with echo
    const scale = [220, 261.63, 293.66, 329.63, 392, 440];
    const delay = audioCtx.createDelay(1); delay.delayTime.value = 0.65;
    const fb = audioCtx.createGain(); fb.gain.value = 0.48;
    delay.connect(fb); fb.connect(delay); delay.connect(lowpass);
    const melodyGain = audioCtx.createGain(); melodyGain.gain.value = 0.24;
    melodyGain.connect(lowpass); melodyGain.connect(delay);

    const note = () => {
      if (!playing || audioCtx.state === 'suspended') return;
      const t = audioCtx.currentTime;
      const o = audioCtx.createOscillator(); o.type = 'sine';
      o.frequency.value = scale[Math.floor(Math.random() * scale.length)];
      const env = audioCtx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.35, t + 1.6);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 6.5);
      o.connect(env);
      if (audioCtx.createStereoPanner) {
        const p = audioCtx.createStereoPanner(); p.pan.value = (Math.random() - 0.5) * 1.6;
        env.connect(p); p.connect(melodyGain);
      } else env.connect(melodyGain);
      o.start(t); o.stop(t + 7.5);
    };
    note();
    melodyTimer = setInterval(note, 5800);
  };

  musicBtn?.addEventListener('click', () => {
    if (!playing) {
      if (!audioCtx) initAudio();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      mainGain.gain.cancelScheduledValues(audioCtx.currentTime);
      mainGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 2.5);
      playing = true;
      musicBtn.classList.add('playing');
    } else {
      mainGain.gain.cancelScheduledValues(audioCtx.currentTime);
      mainGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
      playing = false;
      musicBtn.classList.remove('playing');
      setTimeout(() => { if (!playing) audioCtx.suspend(); }, 1600);
    }
  });
});
