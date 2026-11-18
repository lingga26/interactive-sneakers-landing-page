// Interactive 3D Rotating Wireframe Outsole & Anatomical Silhouette of Aerostreet Maximo
export function initSpecsCanvas(canvas: HTMLCanvasElement | null): () => void {
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let angle = 0.45;
  const targetSpeed = 0.007;
  let hoverBoost = 0;
  let rafId = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  };

  const onEnter = () => {
    hoverBoost = 0.016;
  };
  const onLeave = () => {
    hoverBoost = 0;
  };

  const parent = canvas.parentElement;
  parent?.addEventListener('pointerenter', onEnter);
  parent?.addEventListener('pointerleave', onLeave);
  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Parametric anatomical sneaker outsole & sculpted midsole contour slices
  // Each slice defines length (lx), width (wz), and vertical elevation (y)
  const slices = [
    { y: -0.34, lx: 1.0, wz: 0.38, shiftX: 0.0 },    // Bottom tread outsole
    { y: -0.22, lx: 1.02, wz: 0.4, shiftX: 0.0 },    // Midsole lower ridge (Injection Mould)
    { y: -0.1, lx: 0.99, wz: 0.38, shiftX: -0.02 },  // Midsole upper collar seam
    { y: 0.02, lx: 0.94, wz: 0.35, shiftX: -0.04 },  // Mudguard & toe vamp
    { y: 0.16, lx: 0.72, wz: 0.3, shiftX: -0.18 },   // Eyestay & midfoot mesh
    { y: 0.32, lx: 0.44, wz: 0.25, shiftX: -0.34 },  // Padded ankle collar & tongue
  ];

  const samples = 28;

  const getSlicePoint = (
    slice: { y: number; lx: number; wz: number; shiftX: number },
    t: number
  ) => {
    const cosA = Math.cos(t);
    const sinA = Math.sin(t);
    // Taper toe slightly narrower than midfoot, fuller heel
    const archFactor = 1.0 - 0.16 * Math.exp(-Math.pow(cosA * 2.2, 2));
    const toeTaper = cosA > 0 ? 1.0 - 0.14 * Math.pow(cosA, 2) : 1.0;
    const x = cosA * slice.lx + slice.shiftX;
    const z = sinA * slice.wz * archFactor * toeTaper;
    const y = slice.y;
    return { x, y, z };
  };

  const draw = () => {
    resize();
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const strokeMain = isDark
      ? 'rgba(241, 242, 244, 0.24)'
      : 'rgba(17, 18, 20, 0.2)';
    const strokeStrong = isDark
      ? 'rgba(241, 242, 244, 0.62)'
      : 'rgba(17, 18, 20, 0.58)';

    const cx = w * 0.58;
    const cy = h * 0.46;
    const scale = Math.min(w, h) * 0.42;

    if (!prefersReduced) {
      angle += targetSpeed + hoverBoost;
    }

    const cosY = Math.cos(angle);
    const sinY = Math.sin(angle);
    const tiltX = 0.42;
    const cosX = Math.cos(tiltX);
    const sinX = Math.sin(tiltX);

    const project = (pt: { x: number; y: number; z: number }) => {
      const rx = pt.x * cosY - pt.z * sinY;
      const rz = pt.x * sinY + pt.z * cosY;
      const ry = pt.y * cosX - rz * sinX;
      const depth = rz * cosX + pt.y * sinX;
      const persp = 1.0 / (1.0 - depth * 0.16);
      return {
        px: cx + rx * scale * persp,
        py: cy - ry * scale * persp,
      };
    };

    ctx.lineWidth = Math.max(1.1, w / 460);

    // Horizontal anatomical contour rings (highlighting the Injection Mould seam)
    for (let s = 0; s < slices.length; s++) {
      const slice = slices[s];
      ctx.beginPath();
      ctx.strokeStyle = s === 1 || s === 2 ? strokeStrong : strokeMain;
      for (let i = 0; i <= samples; i++) {
        const t = (i / samples) * Math.PI * 2;
        const { px, py } = project(getSlicePoint(slice, t));
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Vertical structural ribs linking outsole to ankle collar
    const ribCount = 14;
    for (let r = 0; r < ribCount; r++) {
      const t = (r / ribCount) * Math.PI * 2;
      ctx.beginPath();
      ctx.strokeStyle = r % 4 === 0 ? strokeStrong : strokeMain;
      for (let s = 0; s < slices.length; s++) {
        const { px, py } = project(getSlicePoint(slices[s], t));
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Tread cross-ribs underneath outsole (slice 0)
    ctx.beginPath();
    ctx.strokeStyle = strokeMain;
    for (let k = -4; k <= 4; k++) {
      const tTop = Math.acos(Math.max(-0.92, Math.min(0.92, k * 0.22)));
      const p1 = project(getSlicePoint(slices[0], tTop));
      const p2 = project(getSlicePoint(slices[0], -tTop));
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);
    }
    ctx.stroke();

    if (!prefersReduced) {
      rafId = requestAnimationFrame(draw);
    }
  };

  rafId = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(rafId);
    parent?.removeEventListener('pointerenter', onEnter);
    parent?.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('resize', resize);
  };
}
