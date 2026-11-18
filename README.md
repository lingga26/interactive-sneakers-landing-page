# Interactive Sneakers Landing Page

Modern, interactive e-commerce showcase landing page for Aerostreet Maximo sneakers featuring interactive Canvas / WebGL visualization, smooth scrolling with Lenis, and GSAP animations.

---

## ✨ Features

- **Interactive 3D / Canvas Hero**: Canvas particle and lighting visualization powered by WebGL.
- **Colorway Switcher**: Real-time switching between *Black White* and *All Black* colorways with smooth transitions.
- **Interactive Size Configurator**: Size selector with insole length calculation and visual scale feedback (EU 38 - EU 44).
- **Smooth Scrolling Experience**: Integrated with [Lenis](https://github.com/darkroomengineering/lenis) and [GSAP ScrollTrigger](https://greensock.com/scrolltrigger/).
- **Product Specs Showcase**: Visual breakdown of materials, *Shoes Injection Mould* sole technology, and breathability.
- **Shopping Bag / Cart Modal**: Interactive cart drawer with quantity adjustments and IDR price formatting.
- **Responsive Design**: Optimized for all viewports from mobile to high-resolution desktop displays.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler & Dev Server:** Vite
- **Animations:** GSAP 3 (ScrollTrigger)
- **Smooth Scroll:** Lenis
- **Graphics:** HTML5 Canvas / WebGL

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- `npm` (or `bun` / `pnpm` / `yarn`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/interactive-sneakers-landing-page.git
   cd interactive-sneakers-landing-page
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open your browser at [http://localhost:3000](http://localhost:3000).

---

## 📦 Build for Production

To create an optimized production build:

```bash
npm run build
```

The output will be in the `dist` folder.
