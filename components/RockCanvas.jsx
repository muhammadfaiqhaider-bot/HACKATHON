'use client';
import { useEffect, useRef } from 'react';

// Procedural point-cloud "rock": a noisy sphere drawn as thousands of lit dots.
// On load the dots fly in from scatter and settle; afterwards it sways gently and tilts toward the cursor.
function hash(x, y, z) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 2147483647);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
const sm = (t) => t * t * (3 - 2 * t);
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = sm(x - xi), yf = sm(y - yi), zf = sm(z - zi);
  const l = (a, b, t) => a + (b - a) * t;
  const c = (dx, dy, dz) => hash(xi + dx, yi + dy, zi + dz);
  return l(
    l(l(c(0, 0, 0), c(1, 0, 0), xf), l(c(0, 1, 0), c(1, 1, 0), xf), yf),
    l(l(c(0, 0, 1), c(1, 0, 1), xf), l(c(0, 1, 1), c(1, 1, 1), xf), yf),
    zf
  );
}
// Rock = intersection of random half-spaces (flat fractured faces) plus fine ridged noise on top.
const PLANES = Array.from({ length: 15 }, (_, i) => {
  const u = hash(i, 11, 5) * 2 - 1, th = hash(i, 3, 9) * Math.PI * 2, r = Math.sqrt(1 - u * u);
  return { n: [Math.cos(th) * r, u, Math.sin(th) * r], h: 0.74 + hash(i, 21, 2) * 0.3 };
});
function radius(x, y, z) {
  let r = 1.5;
  for (const p of PLANES) {
    const d = x * p.n[0] + y * p.n[1] + z * p.n[2];
    if (d > 0.001) r = Math.min(r, p.h / d);
  }
  const rg = 1 - Math.abs(vnoise(x * 5, y * 5, z * 5) * 2 - 1);
  return r * (0.93 + rg * 0.07 + vnoise(x * 14, y * 14, z * 14) * 0.02);
}

export default function RockCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    const SIZE = 800;
    cv.width = SIZE; cv.height = SIZE;
    const ctx = cv.getContext('2d');
    const img = ctx.createImageData(SIZE, SIZE);
    const px = new Uint32Array(img.data.buffer);
    const zb = new Float32Array(SIZE * SIZE);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const N = 80000;
    const P = new Float32Array(N * 3), Nn = new Float32Array(N * 3), G = new Float32Array(N);
    const Sx = new Float32Array(N * 3), delay = new Float32Array(N);
        for (let i = 0; i < N; i++) {
      const y = Math.random() * 2 - 1, rr = Math.sqrt(1 - y * y), th = Math.random() * Math.PI * 2;
      const d = [Math.cos(th) * rr, y, Math.sin(th) * rr];
      const R0 = radius(d[0], d[1], d[2]);
      const e = 0.015;
      const t1 = [-d[2], 0, d[0]]; const tl = Math.hypot(t1[0], t1[2]) || 1; t1[0] /= tl; t1[2] /= tl;
      const t2 = [d[1] * t1[2], d[2] * t1[0] - d[0] * t1[2], -d[1] * t1[0]];
      const dir = (t) => { const v = [d[0] + t[0] * e, d[1] + t[1] * e, d[2] + t[2] * e]; const l = Math.hypot(...v); return v.map((c) => c / l); };
      const a = dir(t1), b = dir(t2);
      const p0 = d.map((c) => c * R0), p1 = a.map((c) => c * radius(...a)), p2 = b.map((c) => c * radius(...b));
      const u = p1.map((c, k) => c - p0[k]), v = p2.map((c, k) => c - p0[k]);
      let n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      const nl = Math.hypot(...n) || 1; n = n.map((c) => c / nl);
      if (n[0] * d[0] + n[1] * d[1] + n[2] * d[2] < 0) n = n.map((c) => -c);
      P.set(p0, i * 3); Nn.set(n, i * 3);
      G[i] = hash(i, 7, 3);
      const sd = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5];
      const sl = Math.hypot(...sd) || 1; const sr = 2.2 + Math.random() * 2;
      Sx.set(sd.map((c) => (c / sl) * sr), i * 3);
      delay[i] = Math.random() * 0.45;
    }
    // drifting dust
    const M = 420, dust = Array.from({ length: M }, () => ({ a: Math.random() * 6.28, s: 0.2 + Math.random() * 0.8, o: Math.random() }));

    const light = [-0.45, 0.75, 0.5]; const ll = Math.hypot(...light); light.forEach((c, i) => (light[i] = c / ll));
    let mx = 0, my = 0, tx = 0, ty = 0;
    const onMove = (e) => { tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2; };
    window.addEventListener('pointermove', onMove);

    const start = performance.now();
    let raf, visible = true;
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) loop(); }, { threshold: 0 });
    io.observe(cv);

    const put = (x, y, z, g, a = 255) => {
      const ix = x | 0, iy = y | 0;
      if (ix < 1 || iy < 1 || ix >= SIZE - 1 || iy >= SIZE - 1) return;
      const c = (a << 24) | (g << 16) | (g << 8) | g; // ABGR little endian, gray
      for (let oy = 0; oy < 2; oy++) for (let ox = 0; ox < 2; ox++) {
        const k = (iy + oy) * SIZE + ix + ox;
        if (z > zb[k]) { zb[k] = z; px[k] = c; }
      }
    };

    function frame(now) {
      const t = (now - start) / 1000;
      mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
      const sway = reduce ? 0 : Math.sin(t * 0.35) * 0.45;
      const ry = -0.5 + sway + mx * 0.35, rx = 0.18 + my * 0.2;
      const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
      px.fill(0); zb.fill(-9);
      const S = SIZE * 0.3;
      const lx = light[0], ly = light[1], lz = light[2];
      for (let i = 0; i < N; i++) {
        const k = i * 3;
        const prog = reduce ? 1 : Math.min(1, Math.max(0, (t - delay[i]) / 1.7));
        const e = 1 - Math.pow(1 - prog, 3);
        let x = Sx[k] + (P[k] - Sx[k]) * e, y = Sx[k + 1] + (P[k + 1] - Sx[k + 1]) * e, z = Sx[k + 2] + (P[k + 2] - Sx[k + 2]) * e;
        // rotate Y then X
        let x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
        let y1 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
        let nx = Nn[k] * cy + Nn[k + 2] * sy, nz = -Nn[k] * sy + Nn[k + 2] * cy;
        let ny = Nn[k + 1] * cx - nz * sx, nz2 = Nn[k + 1] * sx + nz * cx;
        if (prog >= 1 && nz2 < 0.02) continue; // back-face cull once settled
        const dif = Math.max(0, nx * lx + ny * ly + nz2 * lz);
        let g = 30 + Math.pow(dif, 0.8) * 235 + (G[i] - 0.5) * 80;
        if (prog < 1) g = 40 + 120 * prog;
        g = g < 0 ? 0 : g > 255 ? 255 : g | 0;
        put(SIZE / 2 + x1 * S, SIZE / 2 - y1 * S, z2, g);
      }
      // dust sprays off the upper right
      for (let i = 0; i < M; i++) {
        const d = dust[i]; const life = ((t * 0.12 * d.s + d.o) % 1);
        const ang = -0.9 + d.a * 0.1; const dist = 0.55 + life * 0.55 + d.o * 0.1;
        const fade = (1 - life) * Math.min(1, t / 2);
        const dx = SIZE / 2 + Math.cos(ang + (d.o - 0.5) * 0.9) * dist * S * 1.2 * 0.9;
        const dy = SIZE / 2 - 40 + Math.sin(ang + (d.o - 0.5) * 0.9) * dist * S * 1.2;
        put(dx, dy, 5, (60 + fade * 150) | 0, (fade * 255) | 0);
      }
      ctx.putImageData(img, 0, 0);
    }
    function loop(now = performance.now()) {
      if (!visible) return;
      frame(now);
      if (!reduce || performance.now() - start < 300) raf = requestAnimationFrame(loop);
    }
    loop();
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('pointermove', onMove); };
  }, []);

  return <canvas ref={ref} aria-hidden="true" />;
}
