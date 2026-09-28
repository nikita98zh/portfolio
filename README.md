# Nikita Zhorov — Portfolio Website

Personal portfolio of **Nikita Zhorov**, Web & Brand Designer based in Chemnitz, Germany.

## Tech Stack & Architecture

- **Framework:** Next.js 15 (App Router, Standalone output)
- **Library & Language:** React 19, TypeScript
- **Styling:** Tailwind CSS v4, PostCSS
- **Animations:** `motion/react` (Motion v12)
- **3D & WebGL:** Three.js portrait shader and continuous cylinder scroll physics on wide screens
- **Audio:** Custom Web Audio API sound synthesizer (`lib/sound-fx.ts`)
- **Typography:** Manrope, Anybody and Onest (self-hosted by Next.js)
- **Compact screens:** Native vertical scroll, readable editorial sections and direct case links

## Key Project Structure

```text
├── app/
│   ├── globals.css          # Tailwind CSS v4 directives & font variables
│   ├── layout.tsx           # Root layout with custom elastic cursor & fonts
│   ├── page.tsx             # Responsive portfolio entry
│   ├── icon.svg             # NZ favicon supplied by Nikita
│   ├── robots.ts            # Crawl rules
│   ├── sitemap.ts           # Public pages
│   └── work/
│       ├── vrak/page.tsx    # VRAK 3D beverage branding case study
│       └── morf/page.tsx    # MORF visual identity case study
├── components/
│   ├── vrak-case-view.tsx        # VRAK case study
│   ├── morf/                     # Morf case study interactive layout components
│   ├── mobile-portfolio.tsx      # Native scroll layout for phones and tablets
│   ├── desktop-spatial-portfolio.tsx # Cylinder experience on wide screens
│   ├── global-elastic-cursor.tsx # Custom reactive cursor
│   ├── disciplines-scene.tsx     # Interactive disciplines showcase
│   ├── design-brand-scene.tsx    # Scroll-led design/brand statement
│   ├── floating-cases-scene.tsx  # MORF and VRAK image previews
│   ├── contact-scene.tsx         # Interactive contact scene
│   └── intro-overlay.tsx         # Preloader & interactive entrance
├── lib/
│   ├── cylinder-manifold.ts # Mathematical cylinder manifold formulas
│   ├── sound-fx.ts          # Interactive Web Audio synthesizer
│   ├── portfolio-data.ts    # Portfolio project & fragment data
│   └── utils.ts             # Tailwind class merging utility
└── public/
    └── assets/              # WebP visuals, compressed video and GLB models
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
node .next/standalone/server.js
```

For a standalone server outside this repository, copy `public` to
`.next/standalone/public` and `.next/static` to `.next/standalone/.next/static`.
