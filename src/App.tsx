import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initHeroCanvas } from './webgl/heroCanvas';
import { initSpecsCanvas } from './webgl/specsCanvas';

gsap.registerPlugin(ScrollTrigger);

type ColorwayId = 'black-white' | 'all-black';
type ShoeSizeLabel =
  | 'EU 38'
  | 'EU 39'
  | 'EU 40'
  | 'EU 41'
  | 'EU 42'
  | 'EU 43'
  | 'EU 44';

interface BagItem {
  colorway: ColorwayId;
  size: ShoeSizeLabel;
  insole: string;
  price: number;
  qty: number;
}

const MAXIMO_PRICE = 179900;

const formatIDR = (amount: number): string =>
  `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;

const COLORWAY_META: Record<
  ColorwayId,
  { name: string; short: string; dot: string; src: string; alt: string }
> = {
  'black-white': {
    name: 'Black White',
    short: 'Hitam Putih',
    dot: '#e4e4e7',
    src: '/interactive-sneakers-landing-page/assets/aistudio/image_82e62bae.png',
    alt: 'Sepatu sneakers Aerostreet Maximo varian Black White dengan kombinasi mesh putih, mudguard hitam, dan aksen tumit abu-abu',
  },
  'all-black': {
    name: 'All Black',
    short: 'Hitam Pekat',
    dot: '#18181b',
    src: '/interactive-sneakers-landing-page/assets/aistudio/image_36b3b630.png',
    alt: 'Sepatu sneakers Aerostreet Maximo varian All Black berbahan mesh breathable dan kulit sintetis hitam pekat',
  },
};

const SIZE_OPTIONS: { size: ShoeSizeLabel; insole: string; scale: number }[] = [
  { size: 'EU 38', insole: '24,6 cm', scale: 0.94 },
  { size: 'EU 39', insole: '25,3 cm', scale: 0.96 },
  { size: 'EU 40', insole: '26,0 cm', scale: 0.98 },
  { size: 'EU 41', insole: '26,6 cm', scale: 1.0 },
  { size: 'EU 42', insole: '27,3 cm', scale: 1.02 },
  { size: 'EU 43', insole: '28,0 cm', scale: 1.04 },
  { size: 'EU 44', insole: '28,7 cm', scale: 1.06 },
];

const SHOWCASE_STAGES: {
  src: string;
  alt: string;
  crop: 'full' | 'sole' | 'upper';
  title: string;
  sub: string;
}[] = [
  {
    src: '/interactive-sneakers-landing-page/assets/aistudio/image_82e62bae.png',
    alt: 'Tampak samping penuh Aerostreet Maximo Black White di panggung studio',
    crop: 'full',
    title: 'Maximo Black White',
    sub: 'Siluet kontras dengan mudguard hitam dan aksen tumit abu-abu',
  },
  {
    src: '/interactive-sneakers-landing-page/assets/aistudio/image_36b3b630.png',
    alt: 'Tampak samping penuh Aerostreet Maximo All Black',
    crop: 'full',
    title: 'Maximo All Black',
    sub: 'Tampilan monokrom serba hitam untuk mobilitas harian',
  },
  {
    src: '/interactive-sneakers-landing-page/assets/aistudio/image_82e62bae.png',
    alt: 'Detail midsole tebal Aerostreet Maximo dengan emboss AEROSTREET dan konstruksi tanpa lem',
    crop: 'sole',
    title: 'Shoes Injection Mould',
    sub: 'Sol dicairkan dan menyatu langsung dengan upper tanpa proses lem',
  },
  {
    src: '/interactive-sneakers-landing-page/assets/aistudio/image_36b3b630.png',
    alt: 'Detail material mesh breathable dan panel kulit sintetis dengan jahitan zigzag',
    crop: 'upper',
    title: 'Mesh & Kulit Sintetis',
    sub: 'Sirkulasi udara lega dengan struktur panel samping yang kokoh',
  },
];

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [colorway, setColorway] = useState<ColorwayId>('black-white');
  const [size, setSize] = useState<ShoeSizeLabel>('EU 41');
  const [activeStage, setActiveStage] = useState<number>(0);
  const [captionBlur, setCaptionBlur] = useState<boolean>(false);
  const [splitPct, setSplitPct] = useState<number>(50);
  const [splitAnimate, setSplitAnimate] = useState<boolean>(false);
  const [bag, setBag] = useState<BagItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [checkedOut, setCheckedOut] = useState<boolean>(false);

  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const specsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroStageRef = useRef<HTMLDivElement | null>(null);
  const tiltWrapRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const showcaseRef = useRef<HTMLElement | null>(null);
  const frameRefs = useRef<(HTMLElement | null)[]>([]);
  const bentoGridRef = useRef<HTMLDivElement | null>(null);
  const compWrapRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const stageIdxRef = useRef<number>(0);
  const stageTimerRef = useRef<number | null>(null);
  const checkoutTimerRef = useRef<number | null>(null);
  const selectedConfigRef = useRef<{
    colorway: ColorwayId;
    size: ShoeSizeLabel;
    insole: string;
  }>({ colorway: 'black-white', size: 'EU 41', insole: '26,6 cm' });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const cleanupHeroGl = initHeroCanvas(heroCanvasRef.current);
    const cleanupSpecsGl = initSpecsCanvas(specsCanvasRef.current);

    let lenis: InstanceType<typeof Lenis> | null = null;
    let lenisTicker: ((time: number) => void) | null = null;
    if (!prefersReduced) {
      lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenis.on('scroll', ScrollTrigger.update);
      lenisTicker = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(lenisTicker);
      gsap.ticker.lagSmoothing(0);
    }

    let targetRotX = 0;
    let targetRotY = 0;
    let curRotX = 0;
    let curRotY = 0;
    let velX = 0;
    let velY = 0;
    let tiltTicker: (() => void) | null = null;

    const heroStage = heroStageRef.current;
    const onHeroMove = (e: PointerEvent) => {
      if (!heroStage) return;
      const rect = heroStage.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = nx * 12;
      targetRotX = -ny * 9;
    };
    const onHeroLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    if (heroStage && tiltWrapRef.current && !prefersReduced) {
      heroStage.addEventListener('pointermove', onHeroMove);
      heroStage.addEventListener('pointerleave', onHeroLeave);
      tiltTicker = () => {
        const ax = (targetRotX - curRotX) * 0.08;
        const ay = (targetRotY - curRotY) * 0.08;
        velX = (velX + ax) * 0.82;
        velY = (velY + ay) * 0.82;
        curRotX += velX;
        curRotY += velY;
        if (tiltWrapRef.current) {
          tiltWrapRef.current.style.transform = `rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg)`;
        }
        if (shadowRef.current) {
          shadowRef.current.style.transform = `translateX(${(-curRotY * 1.4).toFixed(1)}px) scale(${1 - Math.abs(curRotX) * 0.01})`;
        }
      };
      gsap.ticker.add(tiltTicker);
    }

    const gsapCtx = gsap.context(() => {
      if (prefersReduced) return;

      const frames = frameRefs.current.filter(
        (el): el is HTMLElement => el !== null
      );
      if (showcaseRef.current && frames.length === 4) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: showcaseRef.current,
            start: 'top top',
            end: '+=280%',
            pin: true,
            scrub: 0.65,
            onUpdate: (self: { progress: number }) => {
              const t = self.progress * 3.5;
              let nextIdx = 0;
              if (t >= 3.07) nextIdx = 3;
              else if (t >= 2.02) nextIdx = 2;
              else if (t >= 0.97) nextIdx = 1;

              if (nextIdx !== stageIdxRef.current) {
                stageIdxRef.current = nextIdx;
                setCaptionBlur(true);
                if (stageTimerRef.current !== null) {
                  window.clearTimeout(stageTimerRef.current);
                }
                stageTimerRef.current = window.setTimeout(() => {
                  stageTimerRef.current = null;
                  setActiveStage(nextIdx);
                  setCaptionBlur(false);
                }, 100);
              }
            },
          },
        });

        const wipeStarts = [0.25, 1.3, 2.35];
        frames.forEach((frame, i) => {
          if (i === 0) return;
          tl.fromTo(
            frame,
            { clipPath: 'inset(0 0 0 100%)' },
            { clipPath: 'inset(0 0 0 0%)', ease: 'none', duration: 0.8 },
            wipeStarts[i - 1]
          );
        });
        tl.set({}, {}, 3.5);
      }

      if (bentoGridRef.current) {
        gsap.from('.reveal-tile', {
          y: 28,
          scale: 0.96,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: bentoGridRef.current,
            start: 'top 82%',
            once: true,
          },
        });
      }
    });

    return () => {
      if (stageTimerRef.current !== null) {
        window.clearTimeout(stageTimerRef.current);
        stageTimerRef.current = null;
      }
      if (checkoutTimerRef.current !== null) {
        window.clearTimeout(checkoutTimerRef.current);
        checkoutTimerRef.current = null;
      }
      cleanupHeroGl();
      cleanupSpecsGl();
      gsapCtx.revert();
      if (tiltTicker) gsap.ticker.remove(tiltTicker);
      if (lenisTicker) gsap.ticker.remove(lenisTicker);
      lenis?.destroy();
      heroStage?.removeEventListener('pointermove', onHeroMove);
      heroStage?.removeEventListener('pointerleave', onHeroLeave);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  const selectStage = (idx: number) => {
    stageIdxRef.current = idx;
    setCaptionBlur(true);
    if (stageTimerRef.current !== null) {
      window.clearTimeout(stageTimerRef.current);
    }
    stageTimerRef.current = window.setTimeout(() => {
      stageTimerRef.current = null;
      setActiveStage(idx);
      setCaptionBlur(false);
    }, 110);
    frameRefs.current.forEach((frame, i) => {
      if (!frame) return;
      frame.style.clipPath =
        i <= idx ? 'inset(0 0 0 0%)' : 'inset(0 0 0 100%)';
    });
  };

  const updateSplit = (pct: number, animate: boolean) => {
    const clamped = Math.max(0, Math.min(100, pct));
    setSplitAnimate(animate);
    setSplitPct(clamped);
  };

  const handleCompPointerDown = (e: {
    currentTarget: HTMLDivElement;
    pointerId: number;
    clientX: number;
  }) => {
    isDraggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    updateSplit(((e.clientX - rect.left) / rect.width) * 100, false);
  };

  const handleCompPointerMove = (e: {
    currentTarget: HTMLDivElement;
    clientX: number;
  }) => {
    if (!isDraggingRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    updateSplit(((e.clientX - rect.left) / rect.width) * 100, false);
  };

  const handleCompPointerUp = () => {
    isDraggingRef.current = false;
  };

  const selectColorway = (nextColorway: ColorwayId) => {
    selectedConfigRef.current.colorway = nextColorway;
    setColorway(nextColorway);
  };

  const selectSize = (nextSize: ShoeSizeLabel, nextInsole: string) => {
    selectedConfigRef.current.size = nextSize;
    selectedConfigRef.current.insole = nextInsole;
    setSize(nextSize);
  };

  const cancelPendingCheckout = () => {
    if (checkoutTimerRef.current !== null) {
      window.clearTimeout(checkoutTimerRef.current);
      checkoutTimerRef.current = null;
      setCheckedOut(false);
    }
  };

  const addToBag = () => {
    cancelPendingCheckout();
    const activeCfg = selectedConfigRef.current;
    setBag((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.colorway === activeCfg.colorway && item.size === activeCfg.size
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [
        ...prev,
        {
          colorway: activeCfg.colorway,
          size: activeCfg.size,
          insole: activeCfg.insole,
          price: MAXIMO_PRICE,
          qty: 1,
        },
      ];
    });
    setDrawerOpen(true);
  };

  const updateBagQty = (idx: number, delta: number) => {
    cancelPendingCheckout();
    setBag((prev) => {
      const next = [...prev];
      const updatedQty = next[idx].qty + delta;
      if (updatedQty <= 0) {
        next.splice(idx, 1);
      } else {
        next[idx] = { ...next[idx], qty: updatedQty };
      }
      return next;
    });
  };

  const handleCheckout = () => {
    if (checkedOut) return;
    if (checkoutTimerRef.current !== null) {
      window.clearTimeout(checkoutTimerRef.current);
    }
    setCheckedOut(true);
    checkoutTimerRef.current = window.setTimeout(() => {
      checkoutTimerRef.current = null;
      setBag([]);
      setCheckedOut(false);
      setDrawerOpen(false);
    }, 1200);
  };

  const totalQty = bag.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = bag.reduce((sum, item) => sum + item.price * item.qty, 0);
  const activeSizeMeta =
    SIZE_OPTIONS.find((s) => s.size === size) ?? SIZE_OPTIONS[3];
  const activeColorMeta = COLORWAY_META[colorway];

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />

      <header className="site-header" id="site-header">
        <div className="container header-inner">
          <a href="#hero" className="brand-lockup" aria-label="Aerostreet Beranda">
            <svg
              className="brand-mark"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 3L21 19H15.8L12 12L8.2 19H3L12 3Z"
                fill="currentColor"
              />
            </svg>
            <span className="brand-wordmark">Aerostreet</span>
          </a>

          <nav className="header-nav" aria-label="Navigasi utama">
            <a href="#showcase" className="nav-link">
              Showcase
            </a>
            <a href="#perbandingan" className="nav-link">
              Perbandingan
            </a>
            <a href="#spesifikasi" className="nav-link">
              Spesifikasi
            </a>
            <a href="#pesan" className="nav-link">
              Pesan
            </a>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="icon-btn theme-toggle"
              id="theme-toggle"
              aria-label="Ubah tema terang atau gelap"
              title="Ubah tema terang atau gelap"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <svg
                id="theme-icon-sun"
                width="19"
                height="19"
                viewBox="0 0 256 256"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="128" cy="128" r="56" stroke="currentColor" strokeWidth="18" />
                <line x1="128" y1="24" x2="128" y2="44" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="128" y1="212" x2="128" y2="232" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="24" y1="128" x2="44" y2="128" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="212" y1="128" x2="232" y2="128" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="54" y1="54" x2="68" y2="68" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="188" y1="188" x2="202" y2="202" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="54" y1="202" x2="68" y2="188" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="188" y1="68" x2="202" y2="54" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
              </svg>
              <svg
                id="theme-icon-moon"
                width="19"
                height="19"
                viewBox="0 0 256 256"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M210.69 158.18A96.78 96.78 0 0 1 192 160 96.11 96.11 0 0 1 96 64a96.78 96.78 0 0 1 1.82-18.69A96.04 96.04 0 1 0 210.69 158.18Z"
                  stroke="currentColor"
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="icon-btn bag-trigger"
              id="bag-trigger"
              aria-label="Buka tas belanja"
              onClick={() => setDrawerOpen(true)}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 256 256"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="32"
                  y="72"
                  width="192"
                  height="144"
                  rx="16"
                  stroke="currentColor"
                  strokeWidth="18"
                />
                <path
                  d="M88 72V64a40 40 0 0 1 80 0v8"
                  stroke="currentColor"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
              </svg>
              <span className="bag-count" id="bag-count">
                {totalQty}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* SECTION 1: Asymmetric Split Hero */}
        <section id="hero" className="hero">
          <canvas
            ref={heroCanvasRef}
            id="hero-gl-canvas"
            className="hero-canvas"
            aria-hidden="true"
          />

          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="hero-kicker tabular-nums">
                <span>Aerostreet Maximo</span>
                <span aria-hidden="true">·</span>
                <span>{formatIDR(MAXIMO_PRICE)}</span>
              </div>
              <h1 className="hero-title">Langkah kokoh tanpa lem.</h1>
              <p className="hero-sub">
                Sneakers kasual harian dari Aerostreet dengan teknologi Shoes
                Injection Mould bertekanan tinggi—membuat sol menyatu permanen,
                tahan dicuci, dan ringan dipakai sepanjang hari.
              </p>

              <div className="hero-actions">
                <a href="#pesan" className="btn btn-primary magnetic-btn">
                  Pilih Ukuran
                </a>
                <a href="#showcase" className="btn btn-ghost">
                  Lihat Detail
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 256 256"
                    fill="none"
                    aria-hidden="true"
                  >
                    <line
                      x1="64"
                      y1="64"
                      x2="192"
                      y2="192"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    <polyline
                      points="88 192 192 192 192 88"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="hero-stage" ref={heroStageRef} id="hero-stage">
              <div
                className="shoe-tilt-wrap"
                ref={tiltWrapRef}
                id="shoe-tilt-wrap"
              >
                <img
                  src={activeColorMeta.src}
                  alt={activeColorMeta.alt}
                  className="shoe-hero-img"
                  id="hero-shoe-img"
                  referrerPolicy="no-referrer"
                  width={1024}
                  height={1024}
                />
              </div>
              <div className="shoe-shadow" ref={shadowRef} aria-hidden="true" />

              <div
                className="hero-swatches"
                role="radiogroup"
                aria-label="Pilih varian warna Maximo"
              >
                {(Object.keys(COLORWAY_META) as ColorwayId[]).map((key) => {
                  const meta = COLORWAY_META[key];
                  const isActive = colorway === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      className={`swatch-btn${isActive ? ' is-active' : ''}`}
                      data-colorway={key}
                      aria-checked={isActive}
                      aria-label={`Varian ${meta.name}`}
                      onClick={() => selectColorway(key)}
                    >
                      <span
                        className="swatch-dot"
                        style={{ background: meta.dot }}
                      />
                      <span className="swatch-label">{meta.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Pinned 4-Stage Detail & Silhouette Showcase */}
        <section id="showcase" ref={showcaseRef} className="showcase-pin">
          <div className="showcase-viewport" id="showcase-viewport">
            <div className="showcase-frames" id="showcase-frames">
              {SHOWCASE_STAGES.map((stage, i) => (
                <figure
                  key={stage.title}
                  ref={(el: HTMLElement | null) => {
                    frameRefs.current[i] = el;
                  }}
                  className={`showcase-frame${i === 0 ? ' is-active' : ''}`}
                  data-index={i}
                  data-crop={stage.crop}
                >
                  <img
                    src={stage.src}
                    alt={stage.alt}
                    className="showcase-img"
                    referrerPolicy="no-referrer"
                  />
                </figure>
              ))}
            </div>

            <div className="showcase-hud">
              <div
                className={`showcase-caption${captionBlur ? ' is-blurring' : ''}`}
                id="showcase-caption"
              >
                <h2 className="caption-title" id="caption-title">
                  {SHOWCASE_STAGES[activeStage].title}
                </h2>
                <p className="caption-sub" id="caption-sub">
                  {SHOWCASE_STAGES[activeStage].sub}
                </p>
              </div>

              <div
                className="showcase-dots"
                role="tablist"
                aria-label="Sudut pandang showcase"
              >
                {SHOWCASE_STAGES.map((stage, i) => (
                  <button
                    key={stage.title}
                    type="button"
                    role="tab"
                    aria-selected={activeStage === i}
                    className={`stage-dot${activeStage === i ? ' is-active' : ''}`}
                    aria-label={`Tampilan ${i + 1}: ${stage.title}`}
                    onClick={() => selectStage(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Interactive Colorway Comparison Slider */}
        <section id="perbandingan" className="comparison-section">
          <div className="container comparison-grid">
            <div
              className="comparison-wrap"
              ref={compWrapRef}
              id="comparison-wrap"
              onPointerDown={handleCompPointerDown}
              onPointerMove={handleCompPointerMove}
              onPointerUp={handleCompPointerUp}
              onPointerCancel={handleCompPointerUp}
            >
              <div className="comparison-layer comparison-right">
                <img
                  src={COLORWAY_META['black-white'].src}
                  alt={COLORWAY_META['black-white'].alt}
                  className="comparison-img"
                  referrerPolicy="no-referrer"
                />
                <span className="comparison-tag comparison-tag-right">
                  Black White
                </span>
              </div>

              <div
                className="comparison-layer comparison-left"
                id="comparison-left"
                style={{
                  clipPath: `inset(0 ${100 - splitPct}% 0 0)`,
                  transition: splitAnimate
                    ? 'clip-path 380ms var(--ease-out)'
                    : 'none',
                }}
              >
                <img
                  src={COLORWAY_META['all-black'].src}
                  alt={COLORWAY_META['all-black'].alt}
                  className="comparison-img"
                  referrerPolicy="no-referrer"
                />
                <span className="comparison-tag comparison-tag-left">
                  All Black
                </span>
              </div>

              <div
                className={`comparison-handle${
                  splitPct <= 2 || splitPct >= 98 ? ' is-edge' : ''
                }`}
                id="comparison-handle"
                role="slider"
                tabIndex={0}
                aria-label="Bandingkan varian All Black dan Black White"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(splitPct)}
                style={{
                  left: `clamp(22px, ${splitPct}%, calc(100% - 22px))`,
                  transition: splitAnimate
                    ? 'left 380ms var(--ease-out)'
                    : 'none',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft') updateSplit(splitPct - 8, true);
                  if (e.key === 'ArrowRight') updateSplit(splitPct + 8, true);
                }}
              >
                <div className="handle-line" />
                <div className="handle-knob">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 256 256"
                    fill="none"
                    aria-hidden="true"
                  >
                    <polyline
                      points="176 144 208 176 176 208"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="48"
                      y1="176"
                      x2="208"
                      y2="176"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    <polyline
                      points="80 112 48 80 80 48"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="208"
                      y1="80"
                      x2="48"
                      y2="80"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="comparison-copy">
              <h2 className="section-title">Dua karakter, satu konstruksi.</h2>
              <p className="section-sub">
                Geser tuas untuk membandingkan langsung tampilan All Black yang
                tegas dengan Black White yang kontras pada siluet yang sama.
              </p>

              <div
                className="segmented-control"
                role="tablist"
                aria-label="Fokus varian perbandingan"
              >
                <button
                  type="button"
                  role="tab"
                  className={`seg-btn${splitPct >= 98 ? ' is-active' : ''}`}
                  aria-selected={splitPct >= 98}
                  onClick={() => updateSplit(100, true)}
                >
                  All Black
                </button>
                <button
                  type="button"
                  role="tab"
                  className={`seg-btn${splitPct <= 2 ? ' is-active' : ''}`}
                  aria-selected={splitPct <= 2}
                  onClick={() => updateSplit(0, true)}
                >
                  Black White
                </button>
              </div>

              <div className="comparison-metrics">
                <div className="metric-item">
                  <span className="metric-value">0% Lem</span>
                  <span className="metric-label">Teknologi Injection Mould</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">340 g</span>
                  <span className="metric-label">Bobot ringan per sepatu</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Asymmetric 3-Tile Editorial Bento */}
        <section id="spesifikasi" className="bento-section">
          <div className="container">
            <div className="section-header-stack">
              <h2 className="section-title">Dirancang untuk langkah harian.</h2>
            </div>

            <div className="bento-grid" ref={bentoGridRef}>
              <article className="bento-tile bento-tall reveal-tile">
                <img
                  src="/interactive-sneakers-landing-page/assets/aistudio/image_82e62bae.png"
                  alt="Detail sol cetak Injection Mould Aerostreet Maximo Black White"
                  className="bento-img bento-img-sole"
                  referrerPolicy="no-referrer"
                />
                <div className="bento-footer">
                  <h3 className="bento-title">Tanpa Proses Lem</h3>
                  <p className="bento-sub">
                    Pemanasan sol bertekanan tinggi menyatukan outsole dengan
                    upper secara permanen
                  </p>
                </div>
              </article>

              <article className="bento-tile bento-top reveal-tile">
                <img
                  src="/interactive-sneakers-landing-page/assets/aistudio/image_36b3b630.png"
                  alt="Detail jaring mesh dan panel kulit sintetis Aerostreet Maximo All Black"
                  className="bento-img bento-img-upper"
                  referrerPolicy="no-referrer"
                />
                <div className="bento-footer">
                  <h3 className="bento-title">Mesh &amp; Kulit Sintetis</h3>
                  <p className="bento-sub">
                    Sirkulasi udara lega dengan panel samping kokoh dan mudah
                    dibersihkan
                  </p>
                </div>
              </article>

              <article className="bento-tile bento-bottom reveal-tile">
                <canvas
                  ref={specsCanvasRef}
                  id="specs-gl-canvas"
                  className="specs-canvas"
                  aria-hidden="true"
                />
                <div className="bento-footer bento-footer-specs">
                  <div>
                    <h3 className="bento-title">Tahan Air &amp; Cuci</h3>
                    <p className="bento-sub">Aman dipakai saat hujan deras</p>
                  </div>
                  <span className="spec-meta">EU 38–44</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* SECTION 5: Interactive Colorway & Size Configurator + Order */}
        <section id="pesan" className="order-section">
          <div className="container order-grid">
            <div className="order-preview" id="order-preview">
              <div className="order-plinth" aria-hidden="true" />
              <img
                src={activeColorMeta.src}
                alt={`Pratinjau Aerostreet Maximo varian ${activeColorMeta.name} ukuran ${size}`}
                className="order-shoe-img"
                id="order-shoe-img"
                referrerPolicy="no-referrer"
                width={1024}
                height={1024}
                style={{ transform: `scale(${activeSizeMeta.scale})` }}
              />
            </div>

            <div className="order-panel">
              <h2 className="section-title">Aerostreet Maximo</h2>
              <p className="order-price tabular-nums" id="order-price">
                {formatIDR(MAXIMO_PRICE)}
              </p>

              <div className="config-group">
                <div className="config-label-row">
                  <span className="config-label">Varian Warna</span>
                  <span className="config-insole-note">
                    {activeColorMeta.name}
                  </span>
                </div>
                <div className="option-row" id="order-colorway-row">
                  {(Object.keys(COLORWAY_META) as ColorwayId[]).map((key) => {
                    const meta = COLORWAY_META[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        className={`pill-option${
                          colorway === key ? ' is-active' : ''
                        }`}
                        onClick={() => selectColorway(key)}
                      >
                        <span
                          className="dot"
                          style={{ background: meta.dot }}
                        />
                        {meta.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="config-group">
                <div className="config-label-row">
                  <span className="config-label">Ukuran (EU)</span>
                  <span className="config-insole-note">
                    Insole {activeSizeMeta.insole}
                  </span>
                </div>
                <div className="option-row" id="order-size-row">
                  {SIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt.size}
                      type="button"
                      className={`pill-option pill-option-size${
                        size === opt.size ? ' is-active' : ''
                      }`}
                      onClick={() => {
                        selectSize(opt.size, opt.insole);
                      }}
                    >
                      {opt.size.replace('EU ', '')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="spec-list">
                <div className="spec-row">
                  <span className="spec-key">Konstruksi</span>
                  <span className="spec-val">
                    Shoes Injection Mould (Tanpa Lem)
                  </span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">Material Upper</span>
                  <span className="spec-val">
                    Kanvas Mesh &amp; Kulit Sintetis
                  </span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">Panjang Insole</span>
                  <span className="spec-val tabular-nums">
                    {size} · {activeSizeMeta.insole}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-full magnetic-btn"
                id="add-to-bag-btn"
                onClick={addToBag}
              >
                <span className="btn-label tabular-nums" id="add-to-bag-label">
                  Tambah ke Tas — {formatIDR(MAXIMO_PRICE)}
                </span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span className="footer-brand">Aerostreet</span>
          <span className="footer-tag">Maximo Series · Shoes Injection Mould.</span>
          <span className="footer-copy">© 2026 Aerostreet</span>
        </div>
      </footer>

      {/* Slide-Over Order Bag Drawer */}
      <div
        className="drawer-backdrop"
        id="drawer-backdrop"
        hidden={!drawerOpen}
        onClick={() => setDrawerOpen(false)}
      />
      <aside
        className="bag-drawer"
        id="bag-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        hidden={!drawerOpen}
      >
        <div className="drawer-header">
          <h2 id="drawer-title" className="drawer-title">
            Tas Belanja
          </h2>
          <button
            type="button"
            className="icon-btn"
            id="drawer-close"
            aria-label="Tutup tas belanja"
            onClick={() => setDrawerOpen(false)}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 256 256"
              fill="none"
              aria-hidden="true"
            >
              <line
                x1="200"
                y1="56"
                x2="56"
                y2="200"
                stroke="currentColor"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <line
                x1="200"
                y1="200"
                x2="56"
                y2="56"
                stroke="currentColor"
                strokeWidth="20"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="drawer-body" id="drawer-body">
          <div className="drawer-empty" id="drawer-empty" hidden={bag.length > 0}>
            <p>Tas belanja Anda masih kosong.</p>
            <a
              href="#pesan"
              className="btn btn-primary btn-sm"
              id="drawer-empty-cta"
              onClick={() => setDrawerOpen(false)}
            >
              Pilih Maximo
            </a>
          </div>

          <div className="drawer-items" id="drawer-items" hidden={bag.length === 0}>
            {bag.map((item, idx) => (
              <div key={`${item.colorway}-${item.size}`} className="bag-item">
                <img
                  src={COLORWAY_META[item.colorway].src}
                  alt={`Aerostreet Maximo ${COLORWAY_META[item.colorway].name}`}
                  className="bag-item-thumb"
                  referrerPolicy="no-referrer"
                />
                <div className="bag-item-info">
                  <div className="bag-item-name">Aerostreet Maximo</div>
                  <div className="bag-item-meta">
                    {COLORWAY_META[item.colorway].name} · {item.size} ({item.insole})
                  </div>
                  <div className="bag-item-price">
                    {formatIDR(item.price * item.qty)}
                  </div>
                  <div className="bag-qty-row">
                    <button
                      type="button"
                      className="qty-btn"
                      aria-label="Kurangi jumlah"
                      onClick={() => updateBagQty(idx, -1)}
                    >
                      -
                    </button>
                    <span className="bag-qty">{item.qty}</span>
                    <button
                      type="button"
                      className="qty-btn"
                      aria-label="Tambah jumlah"
                      onClick={() => updateBagQty(idx, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="drawer-footer" id="drawer-footer" hidden={bag.length === 0}>
          <div className="drawer-total-row">
            <span>Total</span>
            <span className="drawer-total" id="drawer-total">
              {formatIDR(totalPrice)}
            </span>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-full"
            id="checkout-btn"
            disabled={checkedOut}
            onClick={handleCheckout}
          >
            {checkedOut ? 'Pesanan Dikonfirmasi' : 'Pesan Sekarang'}
          </button>
        </div>
      </aside>
    </>
  );
}
