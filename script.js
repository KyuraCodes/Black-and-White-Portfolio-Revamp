/* ═══════════════════════════════════════════════════
   PORTFOLIO — SCRIPT.JS
   Modular · Clean · Well-Commented
═══════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────────
   MODULE: LOADER
   Cinematic loading sequence with progress counter,
   rotating messages, and wipe-out exit transition
────────────────────────────────────────────────── */
const Loader = (() => {
  const loader   = document.getElementById('loader');
  const fill     = document.getElementById('loaderFill');
  const pctEl    = document.getElementById('loaderPct');
  const subEl    = document.getElementById('loaderSub');

  const messages = [
    'Initializing...',
    'Loading modules...',
    'Compiling styles...',
    'Mounting components...',
    'Almost ready...',
  ];

  let progress = 0;
  let msgIndex = 0;

  function init() {
    // Animate progress bar from 0 → 100 over ~1.8s
    const interval = setInterval(() => {
      // Ease: fast at first, slow near end
      const step = progress < 70 ? 3.5 : progress < 90 ? 1.2 : 0.5;
      progress = Math.min(progress + step, 100);

      if (fill)  fill.style.width = `${progress}%`;
      if (pctEl) pctEl.textContent = `${Math.floor(progress)}%`;

      // Cycle messages at thresholds
      const newMsgIdx = Math.floor((progress / 100) * messages.length);
      if (newMsgIdx !== msgIndex && newMsgIdx < messages.length) {
        msgIndex = newMsgIdx;
        if (subEl) {
          subEl.style.opacity = '0';
          setTimeout(() => {
            subEl.textContent = messages[msgIndex];
            subEl.style.opacity = '1';
          }, 150);
        }
      }

      if (progress >= 100) {
        clearInterval(interval);
        hide();
      }
    }, 22);
  }

  function hide() {
    setTimeout(() => {
      // Play wipe-out animation then truly hide
      loader.classList.add('hiding');
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
        triggerHomeReveal();
      }, 700);
    }, 300);
  }

  function triggerHomeReveal() {
    const homeReveals = document.querySelectorAll('.section-home .reveal');
    homeReveals.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 130);
    });
  }

  return { init };
})();


/* ──────────────────────────────────────────────────
   MODULE: THEME
   Dark/Light toggle with localStorage persistence
────────────────────────────────────────────────── */
const Theme = (() => {
  const btn = document.getElementById('themeToggle');
  const STORAGE_KEY = 'portfolio-theme';

  function init() {
    // Load saved preference or default to dark
    const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
    apply(saved);

    btn.addEventListener('click', toggle);
  }

  function apply(theme) {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function toggle() {
    const isLight = document.body.classList.contains('light');
    apply(isLight ? 'dark' : 'light');
  }

  return { init };
})();


/* ──────────────────────────────────────────────────
   MODULE: NAVIGATION
   Sticky nav, active link highlighting, smooth scroll
────────────────────────────────────────────────── */
const Navigation = (() => {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const sections = document.querySelectorAll('section[id]');

  function init() {
    window.addEventListener('scroll', onScroll, { passive: true });

    // Mobile menu toggle
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') &&
          !mobileMenu.contains(e.target) &&
          !menuToggle.contains(e.target)) {
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('open');
      }
    });

    // Smooth scroll + close menu on link click
    [...navLinks, ...mobileLinks].forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          mobileMenu.classList.remove('open');
          menuToggle.classList.remove('open');
        }
      });
    });
  }

  function onScroll() {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 40);

    let currentSection = '';
    sections.forEach(section => {
      if (scrollY >= section.offsetTop - 120) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
    });
    mobileLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
    });
  }

  return { init };
})();


/* ──────────────────────────────────────────────────
   MODULE: SCROLL REVEAL
   Intersection Observer for fade-in animations
────────────────────────────────────────────────── */
const ScrollReveal = (() => {
  // Exclude home section (handled by Loader module)
  const elements = document.querySelectorAll('.reveal:not(.section-home .reveal)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  function init() {
    elements.forEach(el => observer.observe(el));
  }

  return { init };
})();


/* ──────────────────────────────────────────────────
   MODULE: COUNTERS
   Animated number counters for the stat section
────────────────────────────────────────────────── */
const Counters = (() => {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(el => animateCounter(el));
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  function init() {
    const statsSection = document.querySelector('.home-stats');
    if (statsSection) observer.observe(statsSection);
  }

  return { init };
})();




/* ──────────────────────────────────────────────────
   MODULE: MUSIC PLAYER
   Full-featured custom audio player with playlist
────────────────────────────────────────────────── */
const MusicPlayer = (() => {

  // ── Playlist Data ──
  // Replace src values with real audio file paths in /assets/music/
  const tracks = [
    { title: 'Love For You',   artist: 'Loveli Iori', src: 'assets/music/song.mp3', duration: '2:50' },
    { title: 'Love Me Not',      artist: 'Ravyn Lenae', src: 'assets/music/song2.mp3', duration: '3:33' },
    { title: 'A Little Death',      artist: 'The Neighbourhood', src: 'assets/music/song3.mp3', duration: '3:29' },
    { title: 'Golden Brown',      artist: 'The Stranglers', src: 'assets/music/song4.mp3', duration: '4:08' },
    { title: 'LET THE WORLD BURN',   artist: 'Chris Grey', src: 'assets/music/song5.mp3', duration: '2:43' },
    { title: 'HEADLIGHT',      artist: 'Alan Walker', src: 'assets/music/song6.mp3', duration: '2:38' },
    { title: 'Swim',        artist: 'Chase Atlantic', src: 'assets/music/song7.mp3', duration: '3:48' },
  ];

  // ── State ──
  let currentIndex = 0;
  let isPlaying = false;
  let audio = new Audio();

  // ── DOM References ──
  const playBtn       = document.getElementById('playBtn');
  const prevBtn       = document.getElementById('prevBtn');
  const nextBtn       = document.getElementById('nextBtn');
  const trackTitle    = document.getElementById('trackTitle');
  const trackArtist   = document.getElementById('trackArtist');
  const trackBadge    = document.getElementById('trackBadge');
  const vinylInitial  = document.getElementById('vinylInitial');
  const vinylDisk     = document.getElementById('vinylDisk');
  const progressBar   = document.getElementById('progressBar');
  const progressFill  = document.getElementById('progressFill');
  const progressThumb = document.querySelector('.progress-thumb');
  const timeCurrent   = document.getElementById('timeCurrent');
  const timeTotal     = document.getElementById('timeTotal');
  const volumeSlider  = document.getElementById('volumeSlider');
  const playlistEl    = document.getElementById('playlist');

  // ── Utilities ──
  function formatTime(secs) {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // ── Playlist Rendering ──
  function renderPlaylist() {
    playlistEl.innerHTML = '';
    tracks.forEach((track, i) => {
      const li = document.createElement('li');
      li.className = `playlist-item${i === currentIndex ? ' active' : ''}`;
      li.innerHTML = `
        <span class="pl-num">${String(i + 1).padStart(2, '0')}</span>
        <div class="pl-info">
          <div class="pl-title">${track.title}</div>
        </div>
        <span class="pl-duration">${track.duration}</span>
      `;
      li.addEventListener('click', () => loadTrack(i, true));
      playlistEl.appendChild(li);
    });
  }

  // ── Load Track ──
  function loadTrack(index, autoPlay = false) {
    currentIndex = index;
    const track = tracks[currentIndex];

    // Update UI
    trackTitle.textContent  = track.title;
    trackArtist.textContent = track.artist;
    trackBadge.textContent  = `TRACK ${String(currentIndex + 1).padStart(2, '0')}`;
    vinylInitial.textContent = track.title[0];

    // Update audio src
    audio.src = track.src;
    audio.volume = parseFloat(volumeSlider.value);

    // Update playlist active state
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
      item.classList.toggle('active', i === currentIndex);
    });

    // Reset progress
    progressFill.style.width = '0%';
    if (progressThumb) progressThumb.style.left = '0%';
    timeCurrent.textContent = '0:00';
    timeTotal.textContent = track.duration;

    if (autoPlay) {
      playTrack();
    } else {
      pauseTrack();
    }
  }

  // ── Play / Pause ──
  function playTrack() {
    if (audio.src) {
      audio.play().catch(() => {
        // Audio play failed (likely no real file) — simulate playback UI
        simulatePlayback();
      });
    } else {
      // No real audio file — simulate playback for demo
      simulatePlayback();
    }
    isPlaying = true;
    playBtn.textContent = '⏸';
    vinylDisk.classList.add('playing');
  }

  function pauseTrack() {
    audio.pause();
    clearSimulation();
    isPlaying = false;
    playBtn.textContent = '▶';
    vinylDisk.classList.remove('playing');
  }

  function togglePlay() {
    isPlaying ? pauseTrack() : playTrack();
  }

  // ── Simulated Playback (for demo without real audio files) ──
  let simInterval = null;
  let simProgress = 0;

  function simulatePlayback() {
    clearSimulation();
    const totalSecs = parseDuration(tracks[currentIndex].duration);
    simInterval = setInterval(() => {
      simProgress += 0.5;
      if (simProgress >= totalSecs) {
        clearSimulation();
        nextTrack();
        return;
      }
      const pct = (simProgress / totalSecs) * 100;
      progressFill.style.width = `${pct}%`;
      if (progressThumb) progressThumb.style.left = `${pct}%`;
      timeCurrent.textContent = formatTime(simProgress);
    }, 500);
  }

  function clearSimulation() {
    clearInterval(simInterval);
    simInterval = null;
  }

  function parseDuration(str) {
    const [m, s] = str.split(':').map(Number);
    return m * 60 + s;
  }

  // ── Next / Prev ──
  function nextTrack() {
    const nextIndex = (currentIndex + 1) % tracks.length;
    simProgress = 0;
    loadTrack(nextIndex, isPlaying);
  }

  function prevTrack() {
    // If played > 3s, restart; otherwise go to previous
    const threshold = 3;
    if (simProgress > threshold || audio.currentTime > threshold) {
      simProgress = 0;
      audio.currentTime = 0;
      progressFill.style.width = '0%';
      timeCurrent.textContent = '0:00';
    } else {
      const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
      simProgress = 0;
      loadTrack(prevIndex, isPlaying);
    }
  }

  // ── Progress Bar Click ──
  function onProgressClick(e) {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const totalSecs = parseDuration(tracks[currentIndex].duration);
    simProgress = pct * totalSecs;
    progressFill.style.width = `${pct * 100}%`;
    if (progressThumb) progressThumb.style.left = `${pct * 100}%`;
    timeCurrent.textContent = formatTime(simProgress);

    if (audio.src && audio.duration) {
      audio.currentTime = pct * audio.duration;
    }
  }

  // ── Audio Events ──
  function bindAudioEvents() {
    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${pct}%`;
      if (progressThumb) progressThumb.style.left = `${pct}%`;
      timeCurrent.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
      timeTotal.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', () => {
      nextTrack();
    });
  }

  // ── Volume ──
  function onVolumeChange() {
    audio.volume = parseFloat(volumeSlider.value);
  }

  // ── Init ──
  function init() {
    renderPlaylist();
    loadTrack(0, false);
    bindAudioEvents();

    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);
    progressBar.addEventListener('click', onProgressClick);
    volumeSlider.addEventListener('input', onVolumeChange);
  }

  return { init };
})();


/* ──────────────────────────────────────────────────
   MODULE: TYPING EFFECT
   Cycles through words with typewriter animation
────────────────────────────────────────────────── */
const Typer = (() => {
  const el = document.getElementById('typingText');
  if (!el) return { init: () => {} };

  const words = [
    'full-stack apps.',
    'Minecraft plugins.',
    'Discord bots.',
    'AI-powered tools.',
    'automation scripts.',
    'digital experiences.',
    'things that matter.',
  ];

  let wordIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let isPaused   = false;

  // Timing (ms)
  const TYPE_SPEED   = 75;
  const DELETE_SPEED = 40;
  const PAUSE_AFTER  = 1800; // how long to hold the full word
  const PAUSE_BEFORE = 300;  // brief pause before typing next word

  function tick() {
    const currentWord = words[wordIndex];

    if (isPaused) return; // pauses are handled via setTimeout below

    if (!isDeleting) {
      // Type one character
      charIndex++;
      el.textContent = currentWord.slice(0, charIndex);

      if (charIndex === currentWord.length) {
        // Word fully typed — pause then start deleting
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          schedule();
        }, PAUSE_AFTER);
        return;
      }
    } else {
      // Delete one character
      charIndex--;
      el.textContent = currentWord.slice(0, charIndex);

      if (charIndex === 0) {
        // Word fully deleted — move to next word, brief pause
        isDeleting = false;
        wordIndex  = (wordIndex + 1) % words.length;
        isPaused   = true;
        setTimeout(() => {
          isPaused = false;
          schedule();
        }, PAUSE_BEFORE);
        return;
      }
    }

    schedule();
  }

  function schedule() {
    const delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;
    setTimeout(tick, delay);
  }

  function init() {
    // Start after loader finishes (~2.2s for new animated loader)
    setTimeout(schedule, 2400);
  }

  return { init };
})();


/* ──────────────────────────────────────────────────
   MODULE: TIMELINE
   Staggered reveal for timeline entries
────────────────────────────────────────────────── */
const Timeline = (() => {
  // Query inside init() so the DOM is guaranteed to be ready
  function init() {
    const items = document.querySelectorAll('.timeline-item.reveal');
    if (!items.length) return;

    items.forEach((item, i) => {
      // Stagger each timeline card slightly as it scrolls into view
      item.style.transitionDelay = `${i * 0.08}s`;
    });
  }

  return { init };
})();


/* ──────────────────────────────────────────────────
   MODULE: SKILL BARS
   Animates SVG ring progress + featured bar fills
   + sets --level CSS var for bottom indicator bar
────────────────────────────────────────────────── */
const SkillBars = (() => {
  const CIRCUMFERENCE = 2 * Math.PI * 32; // 201.06

  function animateRings(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const ringFill = card.querySelector('.ring-fill');
      if (!ringFill) return;
      const pct = parseFloat(ringFill.dataset.pct);
      const offset = CIRCUMFERENCE * (1 - pct / 100);
      // Set CSS variable for the bottom bar width
      card.style.setProperty('--level', `${pct}%`);
      setTimeout(() => {
        ringFill.style.strokeDashoffset = offset;
        card.classList.add('animated');
      }, 120);
      observer.unobserve(card);
    });
  }

  function animateFeatBars(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.feat-bar-fill[data-width]').forEach((fill, i) => {
        setTimeout(() => {
          fill.style.width = `${fill.dataset.width}%`;
        }, i * 80);
      });
      observer.unobserve(entry.target);
    });
  }

  function init() {
    const ringObserver = new IntersectionObserver(animateRings, { threshold: 0.3 });
    document.querySelectorAll('.skill-card').forEach(card => ringObserver.observe(card));

    const barObserver = new IntersectionObserver(animateFeatBars, { threshold: 0.3 });
    const featPanel = document.querySelector('.skills-featured');
    if (featPanel) barObserver.observe(featPanel);
  }

  return { init };
})();


/* ──────────────────────────────────────────────────
   MODULE: GLOBAL BACKGROUND CANVAS
   Persistent node network visible across ALL sections.
   Nodes bounce softly, connect with lines, react to mouse.
────────────────────────────────────────────────── */
const BackgroundFX = (() => {
  let canvas, ctx, nodes = [], W, H;
  let mouse = { x: -9999, y: -9999 };
  const NODE_COUNT = 70;
  const MAX_DIST   = 150;

  /* ── Node class ── */
  class Node {
    constructor() { this.init(); }
    init() {
      this.x         = Math.random() * W;
      this.y         = Math.random() * H;
      this.vx        = (Math.random() - 0.5) * 0.28;
      this.vy        = (Math.random() - 0.5) * 0.28;
      this.r         = Math.random() * 1.6 + 0.4;
      this.baseAlpha = Math.random() * 0.3 + 0.1;
      this.alpha     = this.baseAlpha;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      // Bounce off edges with slight damping
      if (this.x < 0)  { this.x = 0;  this.vx *= -1; }
      if (this.x > W)  { this.x = W;  this.vx *= -1; }
      if (this.y < 0)  { this.y = 0;  this.vy *= -1; }
      if (this.y > H)  { this.y = H;  this.vy *= -1; }
      // Mouse proximity — brightens and slightly repels
      const dx   = this.x - mouse.x;
      const dy   = this.y - mouse.y;
      const d    = Math.sqrt(dx * dx + dy * dy);
      if (d < 160) {
        this.alpha = this.baseAlpha + (1 - d / 160) * 0.55;
        // Gentle repulsion
        const force = (160 - d) / 160 * 0.4;
        this.x += (dx / (d || 1)) * force;
        this.y += (dy / (d || 1)) * force;
      } else {
        this.alpha = this.baseAlpha;
      }
    }
    draw() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light'
        || document.body.classList.contains('light');
      const color = isLight ? '30,30,30' : '255,255,255';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${this.alpha})`;
      ctx.fill();
    }
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function drawConnections() {
    const isLight = document.body.classList.contains('light');
    const color = isLight ? '30,30,30' : '255,255,255';
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${color},${(1 - d / MAX_DIST) * 0.13})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function drawMouseConnections() {
    if (mouse.x === -9999) return;
    const isLight = document.body.classList.contains('light');
    const color = isLight ? '30,30,30' : '255,255,255';
    nodes.forEach(node => {
      const dx = node.x - mouse.x;
      const dy = node.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 200) {
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = `rgba(${color},${(1 - d / 200) * 0.22})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    drawMouseConnections();
    nodes.forEach(n => { n.update(); n.draw(); });
    requestAnimationFrame(loop);
  }

  function init() {
    canvas = document.getElementById('globalBgCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Mouse tracking for interaction
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });
    document.addEventListener('mouseleave', () => {
      mouse.x = -9999; mouse.y = -9999;
    });

    // Spawn nodes and start loop
    for (let i = 0; i < NODE_COUNT; i++) nodes.push(new Node());
    loop();

    // Home grid parallax on mouse
    const grid = document.querySelector('.home-bg-grid');
    if (grid) {
      window.addEventListener('mousemove', (e) => {
        const xP = (e.clientX / window.innerWidth  - 0.5) * 18;
        const yP = (e.clientY / window.innerHeight - 0.5) * 18;
        grid.style.transform = `translate(${xP}px, ${yP}px)`;
      }, { passive: true });
    }
  }

  return { init };
})();


/* ──────────────────────────────────────────────────
   MODULE: CUSTOM CURSOR
   Dot + ring cursor with hover/click states
────────────────────────────────────────────────── */
const Cursor = (() => {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let dotX = 0, dotY = 0, ringX = 0, ringY = 0;
  let raf;

  function init() {
    if (!dot || !ring) return;
    // Hide on touch devices
    if ('ontouchstart' in window) {
      dot.style.display = 'none';
      ring.style.display = 'none';
      return;
    }

    document.addEventListener('mousemove', (e) => {
      dotX = e.clientX;
      dotY = e.clientY;
    }, { passive: true });

    // Smooth ring follow via rAF lerp
    function animate() {
      ringX += (dotX - ringX) * 0.12;
      ringY += (dotY - ringY) * 0.12;
      dot.style.left  = `${dotX}px`;
      dot.style.top   = `${dotY}px`;
      ring.style.left = `${ringX}px`;
      ring.style.top  = `${ringY}px`;
      raf = requestAnimationFrame(animate);
    }
    animate();

    // Hover state on interactive elements
    const hoverTargets = 'a, button, .project-card, .social-card, .about-card, .playlist-item, .ctrl-btn, .progress-bar';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        document.body.classList.remove('cursor-hover');
      }
    });

    // Click shrink
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
  }

  return { init };
})();


/* ──────────────────────────────────────────────────
   MODULE: SECTION TITLES
   Splits title letters into spans for stagger reveal
────────────────────────────────────────────────── */
const SectionTitles = (() => {
  function init() {
    const titleTexts = document.querySelectorAll('.title-text');
    titleTexts.forEach(el => {
      const text = el.textContent;
      el.innerHTML = text.split('').map((ch, i) =>
        `<span class="title-char" style="transition-delay:${0.04 + i * 0.055}s">${ch}</span>`
      ).join('');
    });
  }

  return { init };
})();



/* ──────────────────────────────────────────────────
   BOOTSTRAP — Initialize all modules
────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  SectionTitles.init(); // Must run before ScrollReveal so chars exist
  Loader.init();
  Cursor.init();
  Theme.init();
  Navigation.init();
  ScrollReveal.init();
  Counters.init();
  SkillBars.init();
  MusicPlayer.init();
  Timeline.init();
  BackgroundFX.init();
  Typer.init();
});