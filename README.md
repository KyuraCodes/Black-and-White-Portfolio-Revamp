# Black-and-White-Portfolio-Revamp 🌑⚪

A modern fork of the original **Black-and-White-Portfolio**, redesigned with a sleek monochrome foundation and enhanced with interactive animations, a floating pill navbar, skill visualizations, a music player, and a dedicated Work section.

---

## 🚀 Features

- **Fully responsive** — mobile-first layout with a collapsible pill navigation menu
- **Elegant monochrome design** — pure black/white palette with optional light mode toggle
- **Floating pill navbar** — centered capsule nav with active-link indicator dot and smooth scroll
- **Animated background** — persistent node-network canvas visible across all sections, reacts to mouse movement
- **Skill rings** — SVG circular progress rings with animated fill and a ranked bar panel
- **Custom music player** — vinyl spin animation, 7-track playlist, seek bar, volume control
- **Project showcase** — 6-card project grid with hover effects
- **Timeline / Journey** — alternating left-right timeline from 2019 to present
- **Work section** — current role card with company logo, status badge, animated purple glow sweep lines, and a detail summary panel
- **Contact section** — animated social cards with shimmer hover effects
- **Loader screen** — animated progress bar with scan lines and wipe transition
- **Custom cursor** — dot + trailing ring cursor with hover and click states
- **Light / Dark mode** — persisted via `localStorage`, canvas nodes adapt to theme
- **Smooth scrolling & scroll reveal** — elements fade in via IntersectionObserver

---

## 🗂 Sections

| # | Section | Description |
|---|---------|-------------|
| — | Home | Name, typing effect, stats counter, profile photo |
| 01 | About | Bio, 4 info cards |
| 02 | Skills | SVG ring cards + ranked featured bars |
| 03 | Projects | 6-card project grid |
| 04 | Music | Full custom audio player with playlist |
| 05 | Journey | Alternating timeline 2019 → present |
| 06 | Work | Current role card (HeppyCloud) |
| 07 | Contact | Social links — Instagram, Discord, GitHub, TikTok |

---

## 🌐 Live Demo

[![Visit Site](https://img.shields.io/badge/Visit%20Site-Black-blue?style=for-the-badge)](https://kyuraa.my.id)  
Or click here: [Visit Live Portfolio](https://kyuraa.my.id)

---

## 🛠 Installation

```bash
# Clone the repository
git clone https://github.com/kyuraa/Black-and-White-Portfolio-Revamp.git

# Move into the project folder
cd Black-and-White-Portfolio-Revamp

# Open index.html in your browser or deploy on your preferred platform
```

No build tools or dependencies required — it's pure HTML, CSS, and vanilla JavaScript.

---

## 📁 File Structure

```
Black-and-White-Portfolio-Revamp/
├── index.html            # Main HTML — all sections
├── style.css             # All styles, animations, responsive rules
├── script.js             # All JS modules (loader, cursor, player, canvas, etc.)
├── Logo-HeppyCloud.png   # Work section company logo
└── assets/
    ├── images/
    │   └── profile.jpg   # Profile photo (replace with your own)
    └── music/
        └── *.mp3         # Music tracks (add your own, update script.js)
```

---

## ✏️ Customization

| What to change | Where |
|----------------|-------|
| Your name | `index.html` — `.home-name` |
| Typing phrases | `script.js` — `Typer` module `words` array |
| Profile photo | `assets/images/profile.jpg` |
| Music tracks | `script.js` — `MusicPlayer` `tracks` array, add MP3s to `assets/music/` |
| Stats (projects, tracks, hours) | `index.html` — `data-target` attributes on `.stat-number` |
| Skill percentages | `index.html` — `data-pct` on `.ring-fill`, `data-width` on `.feat-bar-fill` |
| Social links | `index.html` — `href` on `.social-card` anchors |
| Work / employer details | `index.html` — Work section |

---

## 🧩 JS Modules

| Module | Purpose |
|--------|---------|
| `Loader` | Animated progress bar loader with wipe-out transition |
| `Cursor` | Custom dot + ring cursor with hover/click states |
| `Theme` | Light/dark toggle, persisted in `localStorage` |
| `Navigation` | Scroll-based active link, mobile menu, smooth scroll |
| `ScrollReveal` | IntersectionObserver fade-in for all `.reveal` elements |
| `Counters` | Animated number counters on home stats |
| `SkillBars` | SVG ring animation + featured bar fill on scroll |
| `MusicPlayer` | Full playlist player with simulated or real audio |
| `Timeline` | Staggered reveal for journey timeline items |
| `BackgroundFX` | Node-network canvas, mouse interaction, light/dark aware |
| `Typer` | Typewriter cycle through role phrases |
| `SectionTitles` | Per-character stagger animation on section headings |

---

## 📄 License

MIT — free to use, modify, and distribute with attribution.
