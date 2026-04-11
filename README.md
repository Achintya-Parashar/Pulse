# ⚡ PULSE — Live Event Streaming Platform

A production-quality live event streaming platform UI built with Next.js, Tailwind CSS, and Framer Motion.

![PULSE Preview](https://images.unsplash.com/photo-1587620962725-abab19836100?w=1200&q=80)

---

## ✨ Features

- **Live Event Listing Page** — Grid of 15 events with search, category filters, and a featured hero banner
- **Event Streaming Page** — Embedded YouTube player with live chat simulation
- **Live Chat UI** — Auto-scrolling chat with simulated incoming messages and emoji picker
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Smooth Animations** — Framer Motion page transitions, card hovers, like toggles, chat message animations
- **Dark Aesthetic** — Deep dark theme with brand-red accents, custom scrollbars, and noise textures

---

## 🚀 Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 (App Router) | Framework |
| React 18 | UI library |
| Tailwind CSS 3 | Styling |
| Framer Motion 11 | Animations |
| React Icons 5 | Icon set |

---

## 📁 Folder Structure

```
livestream-platform/
├── app/
│   ├── globals.css           # Global styles, custom fonts, scrollbar
│   ├── layout.jsx            # Root layout
│   ├── page.jsx              # Homepage (event listing)
│   └── events/
│       └── [id]/
│           └── page.jsx      # Event detail/streaming page
│
├── components/
│   ├── Navbar.jsx            # Fixed top navbar with mobile menu
│   ├── HeroBanner.jsx        # Featured event hero section
│   ├── EventCard.jsx         # Individual event card with like/share
│   ├── VideoPlayer.jsx       # YouTube embed with custom UI
│   └── ChatBox.jsx           # Live chat with auto-messages
│
├── data/
│   ├── events.js             # 15 mock events with full metadata
│   └── chatMessages.js       # Mock chat messages for simulation
│
├── tailwind.config.js        # Custom colors, fonts, shadows
├── next.config.js            # Image domains config
└── package.json
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

---

## 📄 Pages

### `/` — Event Listing
- Hero banner with featured event
- Search bar with real-time filtering
- Category filter buttons (All, Trending, Tech, Music, Gaming)
- 4-column responsive event grid (4 → 2 → 1)
- Each card: thumbnail, title, date/time, viewers, like/share/watch buttons

### `/events/[id]` — Event Streaming
- Large video player with YouTube embed
- Sticky live chat sidebar (desktop) / bottom section (mobile)
- Event info: title, description, host, tags, stats
- Related events section
- Like and share interactions

---

## 🎨 Design System

### Colors
- **Background:** `#0a0a0f` (deep near-black)
- **Surfaces:** `#111118`, `#1a1a24`, `#22222f`
- **Brand Red:** `#ff2323` (accent, CTA, live indicators)
- **Text:** `#e8e8f0` (primary), zinc scale (secondary)

### Typography
- **Display:** Syne (headings, logo, titles) — geometric, distinctive
- **Body:** DM Sans (paragraphs, UI text) — clean, modern
- **Mono:** JetBrains Mono (stats, times, badges) — technical feel

### Animations
- Page entry: fade + slide up (staggered)
- Card hover: lift + shadow intensify + image zoom
- Like button: spring scale + color transition
- Chat messages: slide up + fade in
- Navbar: glass blur on scroll

---

## 🌐 Responsiveness

| Breakpoint | Event Grid | Chat Panel |
|-----------|-----------|------------|
| Mobile (<640px) | 1 column | Below video |
| Tablet (640–1024px) | 2 columns | Below video |
| Desktop (>1024px) | 3–4 columns | Sticky sidebar |

---

## 📝 Notes

- All data is mocked locally — no backend or API required
- YouTube embeds use a thumbnail + click-to-play pattern to avoid autoplay restrictions
- Chat auto-generates messages every ~3 seconds to simulate live activity
- Images sourced from Unsplash (configured in `next.config.js`)

---

Made with ⚡ by PULSE
