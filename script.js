class AdvancedPortfolio {
  constructor() {
    this.init();
    this.setupEventListeners();
    this.createParticles();
    this.setupMusicPlayer();      // base player
    this.setupPlaylist();         // playlist + prev/next
    this.setupScrollAnimations();
    this.setupCustomCursor();
    this.setupLoadingScreen();
    this.setupThemeToggle();      // dark/light
    this.setupTyping();           // typing animation
    this.setupProjectsFilter();   // filter projects
    this.setupParallax();         // parallax
    this.setupEasterEgg();        // konami code
  }

  init() {
    this.isPlaying = false;
    // Music
    this.audioPlayer = document.getElementById('audioPlayer');
    this.playBtn = document.getElementById('playBtn');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.progressBar = document.getElementById('progressBar');
    this.progressContainer = document.getElementById('progressContainer');
    this.progressHandle = document.getElementById('progressHandle');
    this.currentTimeDisplay = document.getElementById('currentTime');
    this.durationDisplay = document.getElementById('duration');
    this.volumeSlider = document.getElementById('volumeSlider');
    this.visualizerBars = document.querySelectorAll('.visualizer-bar');
    this.songTitleEl = document.getElementById('songTitle');
    this.songArtistEl = document.getElementById('songArtist');

    // Cursor
    this.cursor = { x: 0, y: 0 };
    this.cursorElement = null;

    // Scroll
    this.lastScrollY = 0;

    // Typing
    this.typedTextEl = document.getElementById('typed-text');
    this.typingPhrases = [
      'Digital Creator', 'Anime Lover', 'Minecraft Plugin Dev', 'Frontend Coder', 'Gaming Enthusiast', 'Passionate Coder'
    ];
    this.typeIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;

    // Theme
    this.themeToggle = document.getElementById('themeToggle');
    this.themeIcon = document.getElementById('themeIcon');

    // Playlist (ganti file sendiri sesuai kebutuhan)
    this.tracks = [
      { title: 'Love for You', artist: 'loveli lori', src: 'song.mp3' },
      { title: "Tell Me Why I'm Waiting", artist: 'timmies, Shiloh Dynasty', src: 'song2.mp3' },
      { title: 'Kisah Sebuah Permata', artist: 'Fiq7', src: 'song3.mp3' }
    ];
    this.currentTrack = 0;

    // Easter Egg
    this.konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];
    this.konamiBuffer = [];
    this.secretOverlay = document.getElementById('secret-overlay');
    this.closeSecretBtn = document.getElementById('close-secret');

    this.animationId = null;
  }

  setupEventListeners() {
    // Smooth nav
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          this.smoothScrollTo(target);
          this.setActiveNavLink(link);
        }
      });
    });

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
      });
    }

    window.addEventListener('scroll', () => { this.handleScroll(); });
    window.addEventListener('resize', () => { this.handleResize(); });
    document.addEventListener('mousemove', (e) => { this.updateCursor(e); });

    document.querySelectorAll('.social-card').forEach(card => {
      card.addEventListener('mouseenter', () => { this.animateSocialCard(card, true); });
      card.addEventListener('mouseleave', () => { this.animateSocialCard(card, false); });
    });

    document.addEventListener('keydown', (e) => { this.handleKeyboard(e); });

    // Secret overlay close
    if (this.closeSecretBtn) {
      this.closeSecretBtn.addEventListener('click', () => {
        this.secretOverlay.classList.remove('active');
      });
    }
  }

  /* Particles */
  createParticles() {
    const container = document.getElementById('particles-container');
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 3 + 1;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 20 + 's';
      p.style.animationDuration = (Math.random() * 10 + 15) + 's';
      container.appendChild(p);
    }
  }

  /* THEME */
  setupThemeToggle() {
    const saved = localStorage.getItem('kyur-theme');
    if (saved === 'light') {
      document.body.classList.add('light');
      this.themeIcon.textContent = '☀️';
    }
    this.themeToggle?.addEventListener('click', () => {
      document.body.classList.toggle('light');
      const isLight = document.body.classList.contains('light');
      this.themeIcon.textContent = isLight ? '☀️' : '🌙';
      localStorage.setItem('kyur-theme', isLight ? 'light' : 'dark');
    });
  }

  /* Typing animation */
  setupTyping() {
    const tick = () => {
      const phrase = this.typingPhrases[this.typeIndex % this.typingPhrases.length];
      const full = phrase;
      if (!this.isDeleting) {
        this.charIndex++;
        if (this.charIndex >= full.length) {
          this.isDeleting = true;
          setTimeout(tick, 1200);
          this.renderTyping(full.substring(0, this.charIndex));
          return;
        }
      } else {
        this.charIndex--;
        if (this.charIndex <= 0) {
          this.isDeleting = false;
          this.typeIndex++;
        }
      }
      this.renderTyping(full.substring(0, this.charIndex));
      const speed = this.isDeleting ? 40 : 80;
      setTimeout(tick, speed);
    };
    tick();
  }
  renderTyping(text) {
    if (this.typedTextEl) this.typedTextEl.textContent = text;
  }

  /* Projects filter */
  setupProjectsFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          const show = (filter === 'all') || (filter === category);
          card.style.display = show ? 'block' : 'none';
        });
      });
    });
  }

  /* Music base controls */
  setupMusicPlayer() {
    if (!this.audioPlayer) return;

    this.playBtn.addEventListener('click', () => { this.togglePlayPause(); });

    this.progressContainer.addEventListener('click', (e) => { this.seekAudio(e); });

    let isDragging = false;
    this.progressHandle.addEventListener('mousedown', () => { isDragging = true; });
    document.addEventListener('mousemove', (e) => { if (isDragging) { this.dragProgress(e); } });
    document.addEventListener('mouseup', () => { isDragging = false; });

    this.volumeSlider.addEventListener('input', (e) => { this.audioPlayer.volume = e.target.value / 100; });

    this.audioPlayer.addEventListener('loadedmetadata', () => {
      if (!isNaN(this.audioPlayer.duration)) {
        this.durationDisplay.textContent = this.formatTime(this.audioPlayer.duration);
      }
    });

    this.audioPlayer.addEventListener('timeupdate', () => { this.updateProgress(); });
    this.audioPlayer.addEventListener('ended', () => { this.nextTrack(); });

    this.audioPlayer.volume = 0.7;
    this.startVisualizer();
  }

  /* Playlist */
  setupPlaylist() {
    if (!this.audioPlayer) return;
    const loadTrack = (index) => {
      const track = this.tracks[index];
      if (!track) return;
      this.audioPlayer.src = track.src;       // kamu ganti file mp3 sesuai koleksi kamu
      this.songTitleEl.textContent = track.title;
      this.songArtistEl.textContent = track.artist;
      this.audioPlayer.load();
      this.isPlaying = false;
      const playIcon = this.playBtn.querySelector('.play-icon');
      const pauseIcon = this.playBtn.querySelector('.pause-icon');
      playIcon.style.display = 'inline';
      pauseIcon.style.display = 'none';
      this.progressBar.style.width = '0%';
      this.progressHandle.style.left = '0%';
      this.currentTimeDisplay.textContent = '0:00';
      this.durationDisplay.textContent = '0:00';
    };

    this.prevBtn?.addEventListener('click', () => { this.prevTrack(); });
    this.nextBtn?.addEventListener('click', () => { this.nextTrack(); });

    this.loadTrack = loadTrack;
    this.prevTrack = () => {
      this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
      loadTrack(this.currentTrack);
      this.togglePlayPause(true);
    };
    this.nextTrack = () => {
      this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
      loadTrack(this.currentTrack);
      this.togglePlayPause(true);
    };

    loadTrack(this.currentTrack);
  }

  togglePlayPause(forcePlay = false) {
    const playIcon = this.playBtn.querySelector('.play-icon');
    const pauseIcon = this.playBtn.querySelector('.pause-icon');

    if (this.isPlaying && !forcePlay) {
      this.audioPlayer.pause();
      playIcon.style.display = 'inline';
      pauseIcon.style.display = 'none';
      this.isPlaying = false;
      this.stopVisualizer();
    } else {
      this.audioPlayer.play().catch(()=>{});
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'inline';
      this.isPlaying = true;
      this.startVisualizer();
    }
  }

  seekAudio(e) {
    const rect = this.progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * this.audioPlayer.duration;
    this.audioPlayer.currentTime = newTime;
  }
  dragProgress(e) {
    const rect = this.progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    const newTime = percentage * this.audioPlayer.duration;
    this.audioPlayer.currentTime = newTime;
  }
  updateProgress() {
    if (!this.audioPlayer.duration || isNaN(this.audioPlayer.duration)) return;
    const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
    this.progressBar.style.width = progress + '%';
    this.progressHandle.style.left = progress + '%';
    this.currentTimeDisplay.textContent = this.formatTime(this.audioPlayer.currentTime);
    this.durationDisplay.textContent = this.formatTime(this.audioPlayer.duration);
  }
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60) || 0;
    const remainingSeconds = Math.floor(seconds % 60) || 0;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  startVisualizer() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    const animate = () => {
      this.visualizerBars.forEach((bar) => {
        const height = Math.random() * 50 + 10;
        bar.style.height = height + 'px';
        bar.style.opacity = this.isPlaying ? 1 : 0.3;
      });
      if (this.isPlaying) {
        this.animationId = requestAnimationFrame(animate);
      }
    };
    animate();
  }
  stopVisualizer() { if (this.animationId) cancelAnimationFrame(this.animationId); this.visualizerBars.forEach(b => b.style.opacity = 0.3); }

  /* Scroll reveal */
  setupScrollAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          if (entry.target.classList.contains('hero-section')) this.animateCounters();
        }
      });
    }, observerOptions);

    document.querySelectorAll('section, .skill-item, .project-card, .social-card').forEach(el => observer.observe(el));
  }
  animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target')); const duration = 2000;
      const step = target / (duration / 16); let current = 0;
      const updateCounter = () => {
        current += step;
        if (current < target) { counter.textContent = Math.floor(current); requestAnimationFrame(updateCounter); }
        else { counter.textContent = target; }
      };
      updateCounter();
    });
  }

  /* Custom cursor */
  setupCustomCursor() {
    this.cursorElement = document.createElement('div');
    this.cursorElement.className = 'custom-cursor';
    this.cursorElement.style.cssText = `
      position: fixed; width: 20px; height: 20px;
      background: radial-gradient(circle, white 2px, transparent 2px);
      border-radius: 50%; pointer-events: none; z-index: 10000;
      mix-blend-mode: difference; transition: transform .1s ease;
    `;
    document.body.appendChild(this.cursorElement);
    this.updateCursorPosition();
  }
  updateCursor(e) { this.cursor.x = e.clientX; this.cursor.y = e.clientY; }
  updateCursorPosition() {
    if (this.cursorElement) {
      this.cursorElement.style.left = this.cursor.x + 'px';
      this.cursorElement.style.top = this.cursor.y + 'px';
    }
    requestAnimationFrame(() => this.updateCursorPosition());
  }

  /* Loading */
  setupLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.loading-progress');
    let progress = 0;
    const loadingInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100; clearInterval(loadingInterval);
        setTimeout(() => {
          loadingScreen.style.opacity = '0';
          loadingScreen.style.visibility = 'hidden';
          document.body.style.overflow = 'auto';
        }, 500);
      }
      progressBar.style.width = progress + '%';
    }, 100);
  }

  /* Smooth scroll */
  smoothScrollTo(target) {
    const targetPosition = target.offsetTop - 80;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 900; let start = null;
    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };
    requestAnimationFrame(animation);
  }
  easeInOutQuad(t, b, c, d) {
    t /= d / 2; if (t < 1) return c / 2 * t * t + b; t--; return -c / 2 * (t * (t - 2) - 1) + b;
  }

  setActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    activeLink.classList.add('active');
  }

  handleScroll() {
    const currentScrollY = window.pageYOffset;
    const navbar = document.querySelector('.navbar');
    if (currentScrollY > 50) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');

    // Update active on scroll
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      if (currentScrollY >= sectionTop && currentScrollY < sectionTop + sectionHeight) {
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) this.setActiveNavLink(activeLink);
      }
    });

    this.lastScrollY = currentScrollY;
  }

  handleResize() { /* reserved for future adjustments */ }

  animateSocialCard(card, isHover) {
    const arrow = card.querySelector('.social-arrow');
    if (isHover) { card.style.transform = 'translateY(-5px)'; arrow.style.transform = 'translateX(5px)'; }
    else { card.style.transform = 'translateY(0)'; arrow.style.transform = 'translateX(0)'; }
  }

  /* Keyboard */
  handleKeyboard(e) {
    // Easter Egg buffer
    this.konamiBuffer.push(e.code);
    if (this.konamiBuffer.length > this.konamiSeq.length) this.konamiBuffer.shift();
    if (this.konamiSeq.every((k, i) => this.konamiBuffer[i] === k)) {
      this.secretOverlay.classList.add('active');
      this.konamiBuffer = [];
    }

    // Media controls
    if (e.code === 'Space' && e.target === document.body) { e.preventDefault(); this.togglePlayPause(); }
    if (e.code === 'ArrowUp') { e.preventDefault(); const v = this.volumeSlider.value; const nv = Math.min(100, parseInt(v) + 5); this.volumeSlider.value = nv; this.audioPlayer.volume = nv / 100; }
    if (e.code === 'ArrowDown') { e.preventDefault(); const v = this.volumeSlider.value; const nv = Math.max(0, parseInt(v) - 5); this.volumeSlider.value = nv; this.audioPlayer.volume = nv / 100; }
    if (e.code === 'ArrowLeft') { e.preventDefault(); this.audioPlayer.currentTime = Math.max(0, this.audioPlayer.currentTime - 5); }
    if (e.code === 'ArrowRight') { e.preventDefault(); this.audioPlayer.currentTime = Math.min(this.audioPlayer.duration || 0, this.audioPlayer.currentTime + 5); }
  }

  /* Parallax */
  setupParallax() {
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    const onScroll = () => {
      const y = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        el.style.transform = `translateY(${y * speed * -0.2}px)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Utility for gallery hover (kept for consistency) */
  animateGalleryItem(item, isHover) {
    const image = item.querySelector('.gallery-image');
    if (!image) return;
    if (isHover) { item.style.transform = 'translateY(-10px) scale(1.02)'; image.style.filter = 'brightness(0.7)'; }
    else { item.style.transform = 'translateY(0) scale(1)'; image.style.filter = 'brightness(1)'; }
  }

  /* Easter Egg setup already within keyboard, overlay handled above */
}

document.addEventListener('DOMContentLoaded', () => { new AdvancedPortfolio(); });

/* extra CSS injected for small nav behaviors */
const style = document.createElement('style');
style.textContent = `
  .animate-in { animation: fadeInUp 0.8s ease forwards; }
  .custom-cursor { transition: transform 0.1s ease; }
  .nav-menu.active { display: flex; flex-direction: column; position: absolute; top: 100%; left: 0; width: 100%; background: rgba(0,0,0,0.95); padding: 1rem; gap: 1rem; }
  body.light .nav-menu.active { background: rgba(255,255,255,0.98); }
  .nav-toggle.active span:nth-child(1) { transform: rotate(-45deg) translate(-5px, 6px); }
  .nav-toggle.active span:nth-child(2) { opacity: 0; }
  .nav-toggle.active span:nth-child(3) { transform: rotate(45deg) translate(-5px, -6px); }
  @media (max-width: 768px) { .nav-menu { display: none; } }
`;
document.head.appendChild(style);
