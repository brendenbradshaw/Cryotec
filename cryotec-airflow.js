/* ============================================================
   CryoTec interactive airflow + thermal plate
   ============================================================ */

const stage = document.getElementById('stage');
const productImg = document.getElementById('productImg');
const pcBehind = document.getElementById('pcBehind');
const pcFront = document.getElementById('pcFront');
const markersEl = document.getElementById('markers');
const tooltip = document.getElementById('tooltip');
const plateOverlay = document.getElementById('plateOverlay');
const plateGradient = document.getElementById('plateGradient');
const plateHaze = document.getElementById('plateHaze');
const headline = document.getElementById('headline');
const subline = document.getElementById('subline');
const caption = document.getElementById('caption');
const btnPlay = null;
const btnReset = null;
const speedRange = null;
const speedVal = null;
const densityRange = null;
const densityVal = null;

const state = {
  view: 'front',            // 'front' | 'back'
  mode: 'cool',             // 'cool' | 'warm'
  playing: true,
  speed: 0.65,              // 0..1
  densityMul: 1.0,          // particle density multiplier
  t0: performance.now(),
  lastTick: performance.now(),
};

/* --- Vent geometry (normalized to stage 0..1) --------------------
   Derived from the Front Transparent image (aspect 686x1186).
   Top intake = honeycomb mesh area across the top. Side exhausts =
   tall vertical slots on the left and right. Values tuned visually.
------------------------------------------------------------------- */
const FRONT_VENTS = {
  // Top intake zone: cold air goes DOWN into this area
  intake: {
    x0: 0.22, x1: 0.80,   // horizontal extent
    y0: 0.38, y1: 0.44,   // band inside which particles enter product (~40% from top)
    spawnY: -0.05,        // spawn above the stage
  },
  // Left exhaust slot
  exhaustL: {
    x0: 0.085, x1: 0.12,
    y0: 0.23, y1: 0.57,
    outX: -0.03,          // drift to left off the device
    label: 'L',
  },
  // Right exhaust slot
  exhaustR: {
    x0: 0.876, x1: 0.915,
    y0: 0.23, y1: 0.57,
    outX: 1.03,
    label: 'R',
  },
  // Top exhaust — warm air leaving through the top of the device.
  // Two streams spawn near the top of the image (~40px/0.05 from top)
  // and diverge upward-outward, moving vertically away from horizontal center.
  exhaustTopL: {
    x: 0.42, y: 0.05,      // spawn x,y in normalized coords
    outX: 0.05, outY: -0.25, // end-point (up-left of frame)
    label: 'TOP-L',
  },
  exhaustTopR: {
    x: 0.58, y: 0.05,
    outX: 0.95, outY: -0.25,
    label: 'TOP-R',
  },
};

/* ---------- Canvas setup ---------- */
function resizeCanvases() {
  const r = stage.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  for (const c of [pcBehind, pcFront]) {
    c.width = r.width * dpr;
    c.height = r.height * dpr;
    c.style.width = r.width + 'px';
    c.style.height = r.height + 'px';
    const ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
}
window.addEventListener('resize', resizeCanvases);

/* ---------- Streamline airflow system (front view) -----------
   Replaces the old particle cloud with flowing ribbons of air that
   curve down into the top intake mesh. Matches the "AC unit wind
   streaks" aesthetic: thin, semi‑transparent cyan arcs with bright
   pulses traveling along them.

   Each Streamline is a cubic Bezier from a spawn point well above
   the device down to a point inside the intake band. We sample the
   curve into a polyline at init, then render:
     1. A faint base stroke (the ribbon itself)
     2. 1–3 bright "pulses" sliding along the polyline from tail→head

   Colour is a single neutral cool cyan everywhere (airflow is unified). */

const AIR_HUE = 212;       // light blue
const AIR_SAT = 82;
const AIR_LIGHT = 76;

function airColor(alpha) {
  return `hsla(${AIR_HUE}, ${AIR_SAT}%, ${AIR_LIGHT}%, ${alpha})`;
}

function cubicPoint(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const b0 = u*u*u, b1 = 3*u*u*t, b2 = 3*u*t*t, b3 = t*t*t;
  return [
    b0*p0[0] + b1*p1[0] + b2*p2[0] + b3*p3[0],
    b0*p0[1] + b1*p1[1] + b2*p2[1] + b3*p3[1],
  ];
}

class Streamline {
  constructor(kind, opts = {}) {
    this.kind = kind; // 'intake' | 'sideL' | 'sideR'
    this.opts = opts;
    this.rebuild();
    // pulse phase offset for this ribbon — staggered start
    this.phase = Math.random();
    // ribbon strength 0..1 (some ribbons glow brighter than others)
    this.strength = 0.55 + Math.random() * 0.45;
    // individual pulse speed multiplier
    this.pulseSpeed = 0.55 + Math.random() * 0.45;
    // number of pulses riding this ribbon
    this.pulses = 1 + (Math.random() < 0.55 ? 1 : 0);
  }
  rebuild() {
    const r = stage.getBoundingClientRect();
    const W = r.width, H = r.height;
    const v = FRONT_VENTS.intake;
    if (this.kind === 'intake') {
      // Target inside the intake band (where the spinning fan consumes air).
      // We distribute targets across the mesh so multiple ribbons arrive
      // at different points of the fan.
      const laneX = this.opts.lane ?? Math.random();
      const ex = (v.x0 + laneX * (v.x1 - v.x0)) * W;
      const ey = ((v.y0 + v.y1) / 2) * H;

      // Fan center (for spiral math) — middle of mesh
      const fx = ((v.x0 + v.x1) / 2) * W;
      const fy = ((v.y0 + v.y1) / 2) * H;

      // Each ribbon spawns somewhere on a ring AROUND the fan. Angle
      // distributed around the top half (−10° … 190°) so air is pulled
      // in from above AND both sides — not just straight down.
      // angle measured in standard math convention (0 = right, 90 = up)
      const angFrac = this.opts.angleFrac ?? Math.random();
      // Map angFrac 0..1 to angle 200°..-20° (sweep over the top half
      // with a bit of overhang on each side so air can come from the sides).
      const angDeg = 200 - angFrac * 220;
      const ang = angDeg * Math.PI / 180;

      // Spawn radius: reduced ∼30% so ribbons appear shorter and fade out sooner,
      // while still converging on the same fan center.
      const radius = Math.min(W, H) * (0.385 + Math.random() * 0.175);
      const sx = fx + Math.cos(ang) * radius;
      // NB: canvas y grows downward, so "up" is negative y
      const sy = fy - Math.sin(ang) * radius;

      // To create a swirling/circular approach, control points are placed
      // tangentially to the ring rather than on the straight line from
      // start to fan. We pick a tangent direction (perpendicular to the
      // radius vector) and pull the first control point along it — this
      // gives each ribbon the curved "swept into the fan" shape.
      const rvx = sx - fx, rvy = sy - fy;
      const rlen = Math.hypot(rvx, rvy) || 1;
      // tangent = 90° CCW rotation of radius vector (gives consistent swirl)
      const tx = -rvy / rlen, ty = rvx / rlen;
      // all ribbons swirl in the same rotational direction (CCW from viewer)
      const swirl = 1;
      const c1x = sx + tx * rlen * 0.45 * swirl;
      const c1y = sy + ty * rlen * 0.45 * swirl;
      // Second control point pulls the curve gently toward the fan target,
      // maintaining the spiral inward
      const c2x = fx + (sx - fx) * 0.18 + tx * rlen * 0.22 * swirl;
      const c2y = fy + (sy - fy) * 0.18 + ty * rlen * 0.22 * swirl;

      this.p0 = [sx, sy];
      this.p1 = [c1x, c1y];
      this.p2 = [c2x, c2y];
      this.p3 = [ex, ey];
    } else if (this.kind === 'topExL' || this.kind === 'topExR') {
      // Warm air exiting the TOP of the device (~40px from top of image).
      // The stream starts at the device top and curves upward-outward,
      // moving vertically away from the horizontal center of the image.
      const vent = this.kind === 'topExL' ? FRONT_VENTS.exhaustTopL : FRONT_VENTS.exhaustTopR;
      const side = this.kind === 'topExL' ? -1 : 1;
      // small jitter around the anchor point
      const sx = (vent.x + (Math.random() - 0.5) * 0.04) * W;
      const sy = (vent.y + (Math.random() - 0.5) * 0.01) * H;
      const ex = vent.outX * W + side * (Math.random() - 0.5) * W * 0.04;
      const ey = vent.outY * H + (Math.random() - 0.5) * H * 0.06;
      // Control points: first goes mostly vertically up (air leaves top),
      // second leans outward so the stream bends away from center
      const c1x = sx + side * W * 0.02;
      const c1y = sy - H * 0.12;
      const c2x = ex - side * W * 0.12;
      const c2y = ey + H * 0.1;
      this.p0 = [sx, sy];
      this.p1 = [c1x, c1y];
      this.p2 = [c2x, c2y];
      this.p3 = [ex, ey];
    } else if (this.kind === 'sideL' || this.kind === 'sideR') {
      // Subtle side-exhaust wisps — short curving arcs from the slot
      // that fade outward. Kept in the SAME cyan so airflow feels unified.
      const vent = this.kind === 'sideL' ? FRONT_VENTS.exhaustL : FRONT_VENTS.exhaustR;
      const side = this.kind === 'sideL' ? -1 : 1;
      const sy = (vent.y0 + Math.random() * (vent.y1 - vent.y0)) * H;
      const sx = ((vent.x0 + vent.x1) / 2) * W;
      const ex = sx + side * W * (0.18 + Math.random() * 0.12);
      const ey = sy - H * (0.08 + Math.random() * 0.1);
      this.p0 = [sx, sy];
      this.p1 = [sx + side * W * 0.06, sy - H * 0.01];
      this.p2 = [ex - side * W * 0.04, ey + H * 0.03];
      this.p3 = [ex, ey];
    }
    // Sample curve into a polyline for easy pulse positioning
    this.samples = [];
    const N = 48;
    for (let i = 0; i <= N; i++) {
      this.samples.push(cubicPoint(this.p0, this.p1, this.p2, this.p3, i / N));
    }
  }
  draw(ctx, t) {
    // t: seconds since start, used to animate pulses
    const s = this.samples;
    if (!s.length) return;
    const nSeg = s.length - 1;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // ---- Compute offset polylines for the "bundled wave" look.
    // We create N_LAYERS parallel copies of the base curve, offset along
    // the local normal. The offset amount swells in the middle of the
    // curve (big wave body) and tapers at both ends (pointed tails) —
    // this matches the reference image: bundled layered curves that
    // taper to feathered points at their ends.
    const N_LAYERS = 14;
    const MAX_OFFSET = 14; // px — wave thickness at midspan

    // Precompute normals + per-sample thickness envelope
    const normals = [];
    const thickEnv = [];
    for (let i = 0; i <= nSeg; i++) {
      const prev = s[Math.max(0, i - 1)];
      const next = s[Math.min(nSeg, i + 1)];
      const tx = next[0] - prev[0];
      const ty = next[1] - prev[1];
      const L = Math.hypot(tx, ty) || 1;
      normals.push([-ty / L, tx / L]);
      const u = i / nSeg;
      // Bell shape: 0 at ends, 1 in middle. sin^0.8 gives feathered tails.
      const env = Math.pow(Math.sin(u * Math.PI), 0.7);
      thickEnv.push(env);
    }

    // ---- Base layer alpha envelope (fades at both ends like the reference)
    const layerAlpha = (u) => {
      // fade-in at start, fade-out at end — all kinds use the same bell
      const startFade = Math.min(1, u / 0.18);
      const endFade = 1 - Math.max(0, (u - 0.78) / 0.22);
      return startFade * endFade;
    };

    // ---- Draw stacked layers (bundled ribbon)
    for (let layer = 0; layer < N_LAYERS; layer++) {
      // layerFrac -1..+1 across the bundle
      const layerFrac = (layer / (N_LAYERS - 1)) * 2 - 1;
      // A subtle per-layer phase so inner layers breathe differently
      const layerPhase = layerFrac * 0.4;

      // Layer alpha: inner layers brightest, outer layers wispy
      const layerBaseA = (1 - Math.abs(layerFrac) * 0.75) * 0.11 * this.strength;

      ctx.lineWidth = 0.9;
      for (let i = 0; i < nSeg; i++) {
        const u1 = i / nSeg;
        const u2 = (i + 1) / nSeg;
        const env1 = thickEnv[i];
        const env2 = thickEnv[i + 1];
        const off1 = layerFrac * MAX_OFFSET * env1;
        const off2 = layerFrac * MAX_OFFSET * env2;
        const n1 = normals[i], n2 = normals[i + 1];
        const a = layerBaseA * layerAlpha(u1);
        if (a <= 0.003) continue;

        // Slight wavering per layer so the bundle feels fluid, not rigid
        const wav = Math.sin(t * 0.9 + layerPhase * 4 + u1 * 6) * 1.1;
        const p = [s[i][0] + n1[0] * (off1 + wav), s[i][1] + n1[1] * (off1 + wav)];
        const q = [s[i + 1][0] + n2[0] * (off2 + wav), s[i + 1][1] + n2[1] * (off2 + wav)];

        ctx.strokeStyle = airColor(a);
        ctx.beginPath();
        ctx.moveTo(p[0], p[1]);
        ctx.lineTo(q[0], q[1]);
        ctx.stroke();
      }
    }

    // ---- Bright traveling pulse (single brighter sheet moving along the wave)
    const speed = 0.35 * this.pulseSpeed * state.speed;
    for (let pi = 0; pi < this.pulses; pi++) {
      const u = ((t * speed) + this.phase + pi / this.pulses) % 1;
      const pulseLen = 0.28;
      const segStart = Math.max(0, Math.floor((u - pulseLen) * nSeg));
      const segEnd   = Math.min(nSeg, Math.ceil(u * nSeg));
      for (let i = segStart; i < segEnd; i++) {
        const localT = i / nSeg;
        const d = (u - localT) / pulseLen;
        if (d < 0 || d > 1) continue;
        const shape = Math.sin((1 - d) * Math.PI);
        let a = shape * 0.35 * this.strength * layerAlpha(localT);
        if (a <= 0.01) continue;

        // Draw pulse across a few inner layers so it reads as a "wash" of light
        for (let L = -2; L <= 2; L++) {
          const env = thickEnv[i];
          const off = (L / 2) * MAX_OFFSET * 0.6 * env;
          const n = normals[i];
          const p = [s[i][0] + n[0] * off, s[i][1] + n[1] * off];
          const q = [s[i + 1][0] + n[0] * off, s[i + 1][1] + n[1] * off];
          ctx.lineWidth = 1.4;
          ctx.strokeStyle = `hsla(${AIR_HUE}, ${AIR_SAT}%, 92%, ${a * (1 - Math.abs(L) * 0.25)})`;
          ctx.beginPath();
          ctx.moveTo(p[0], p[1]);
          ctx.lineTo(q[0], q[1]);
          ctx.stroke();
        }
      }
    }
  }
}

/* Build the ribbon set. We distribute intake ribbons across the mesh
   so they fan out visually, plus a few side wisps for context. */
let streamlines = [];
function buildStreamlines() {
  streamlines = [];
  // 8 intake ribbons distributed around the top half of the device —
  // some come from above, some sweep in from left and right (mimics a
  // spinning fan pulling ambient air in from every direction).
  const N_INTAKE = 8;
  for (let i = 0; i < N_INTAKE; i++) {
    const angleFrac = (i + 0.5) / N_INTAKE + (Math.random() - 0.5) * 0.04;
    const lane = 0.15 + Math.random() * 0.7; // where on the mesh this ribbon lands
    streamlines.push(new Streamline('intake', { angleFrac, lane }));
  }
}
window.addEventListener('resize', () => { resizeCanvases(); buildStreamlines(); });

/* ---------- Particle system (legacy) ---------- */
class Particle {
  constructor(type) { this.init(type); }
  init(type) {
    const r = stage.getBoundingClientRect();
    this.type = type;
    this.life = 0;
    this.alive = true;
    if (type === 'intake') {
      // spawn above the intake band, moving DOWN
      const v = FRONT_VENTS.intake;
      this.x = (v.x0 + Math.random()*(v.x1 - v.x0)) * r.width;
      this.y = v.spawnY * r.height + Math.random() * 40;
      this.vx = (Math.random() - 0.5) * 0.15;
      this.vy = 1.4 + Math.random()*0.9;
      this.maxLife = 1.0 + Math.random()*0.6; // seconds to live
      this.size = 1.3 + Math.random()*1.8;
      this.hot = false;
    } else {
      // exhaust: spawn inside one of the side slots, moving outward + up
      const v = Math.random() < 0.5 ? FRONT_VENTS.exhaustL : FRONT_VENTS.exhaustR;
      this.ventLeft = v === FRONT_VENTS.exhaustL;
      const sx = v.x0 + Math.random()*(v.x1 - v.x0);
      const sy = v.y0 + Math.random()*(v.y1 - v.y0);
      this.x = sx * r.width;
      this.y = sy * r.height;
      // move outward from product side
      this.vx = (this.ventLeft ? -1 : 1) * (0.6 + Math.random()*0.5);
      this.vy = -0.25 - Math.random()*0.45; // warm air rises
      this.maxLife = 1.2 + Math.random()*0.8;
      this.size = 1.6 + Math.random()*2.2;
      this.hot = true;
    }
  }
  step(dt, speed) {
    this.life += dt;
    const k = 60 * speed * dt; // pixels per sec-ish, scaled by speed
    this.x += this.vx * k;
    this.y += this.vy * k;
    // warm rising acceleration
    if (this.hot) this.vy -= 0.0015 * k;
    // intake particles accelerate slightly
    else this.vy += 0.0008 * k;

    if (this.life > this.maxLife) this.alive = false;
    const r = stage.getBoundingClientRect();
    if (this.x < -40 || this.x > r.width + 40 || this.y < -80 || this.y > r.height + 40) this.alive = false;
  }
  draw(ctx, mode) {
    const lifeT = this.life / this.maxLife; // 0..1
    const fadeIn = Math.min(1, this.life * 4);
    const fadeOut = 1 - Math.max(0, lifeT - 0.6) / 0.4;
    const alpha = fadeIn * fadeOut;
    // Colour mapping depends on mode:
    //  - cool mode: intake=cold, exhaust=warm
    //  - warm mode: intake=warm, exhaust=cold
    let hue, sat, light;
    if (this.type === 'intake') {
      if (mode === 'cool') { hue = 225; light = 78; }
      else { hue = 30; light = 72; }
    } else {
      if (mode === 'cool') { hue = 30; light = 72; }
      else { hue = 225; light = 78; }
    }
    sat = 90;
    // Glow
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 6);
    grad.addColorStop(0, `hsla(${hue}, ${sat}%, ${light}%, ${0.9 * alpha})`);
    grad.addColorStop(0.4, `hsla(${hue}, ${sat}%, ${light}%, ${0.25 * alpha})`);
    grad.addColorStop(1, `hsla(${hue}, ${sat}%, ${light}%, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 6, 0, Math.PI * 2);
    ctx.fill();
    // Core
    ctx.fillStyle = `hsla(${hue}, ${sat}%, ${Math.min(95, light + 10)}%, ${alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Trail streak (short line along motion)
    const len = Math.hypot(this.vx, this.vy);
    if (len > 0.2) {
      ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${light}%, ${0.35 * alpha})`;
      ctx.lineWidth = this.size * 0.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(this.x - this.vx * 10, this.y - this.vy * 10);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
    }
  }
}

/* two pools: intake (in front of product), exhaust (behind product so
   the side-vent mesh sits in front visually — actually the product
   image is opaque at the slot, so we put exhaust on FRONT layer too
   but slightly inside). We'll keep one combined array. */
const particles = [];
const MAX_PARTICLES = 260;

function spawn(dt) {
  if (!state.playing || state.view !== 'front') return;
  const baseIntakeRate = 90 * state.speed * state.densityMul; // particles/sec
  const baseExhaustRate = 70 * state.speed * state.densityMul;
  const iN = baseIntakeRate * dt;
  const eN = baseExhaustRate * dt;
  const addInt = Math.floor(iN) + (Math.random() < (iN % 1) ? 1 : 0);
  const addExh = Math.floor(eN) + (Math.random() < (eN % 1) ? 1 : 0);
  for (let i = 0; i < addInt && particles.length < MAX_PARTICLES; i++) particles.push(new Particle('intake'));
  for (let i = 0; i < addExh && particles.length < MAX_PARTICLES; i++) particles.push(new Particle('exhaust'));
}

/* ---------- Main loop ---------- */
function tick() {
  const now = performance.now();
  const dt = Math.min(0.05, (now - state.lastTick) / 1000);
  state.lastTick = now;

  if (state.view === 'front') {
    // Render streamlines (replaces particle cloud)
    const r = stage.getBoundingClientRect();
    const ctxB = pcBehind.getContext('2d');
    const ctxF = pcFront.getContext('2d');
    ctxB.clearRect(0, 0, r.width, r.height);
    ctxF.clearRect(0, 0, r.width, r.height);
    ctxF.globalCompositeOperation = 'lighter';

    if (state.playing) state.flowT = (state.flowT || 0) + dt;
    const t = state.flowT || 0;
    for (const sl of streamlines) sl.draw(ctxF, t);
  } else {
    // Back view — clear canvases (plate animation handled via CSS)
    const r = stage.getBoundingClientRect();
    pcBehind.getContext('2d').clearRect(0, 0, r.width, r.height);
    pcFront.getContext('2d').clearRect(0, 0, r.width, r.height);
    updatePlate(now);
  }

  // Plate temperature readout (marker label)
  updatePlateReadout();

  requestAnimationFrame(tick);
}

/* ---------- Plate thermal animation (back view) ---------- */
let plateState = {
  // temperature in arbitrary units; -1 = very cold, +1 = very hot
  value: -0.8,
  target: -0.8,
};

function plateColorAtT(t) {
  // t in -1..+1
  // cold end: deep blue
  // hot end: #ff7927 orange family (hue ~45)
  if (t < 0) {
    const k = -t; // 0..1 how cold
    return {
      main:   `oklch(${0.55 - k*0.12} ${0.08 + k*0.1} 230)`,
      accent: `oklch(${0.45 - k*0.1} ${0.1 + k*0.08} 220)`,
      accent2:`oklch(${0.5 - k*0.1} ${0.12 + k*0.08} 240)`,
      alpha: Math.min(1, 0.15 + k*0.85),
    };
  } else {
    const k = t;
    return {
      main:   `oklch(${0.58 + k*0.12} ${0.13 + k*0.07} 48)`,
      accent: `oklch(${0.55 + k*0.1} ${0.15 + k*0.06} 45)`,
      accent2:`oklch(${0.6 + k*0.08} ${0.14 + k*0.07} 52)`,
      alpha: Math.min(1, 0.15 + k*0.85),
    };
  }
}

/* Plate temperature model
   ----------------------------------
   `plateState.value` is mapped linearly:
     -1.0 => 8°C  (coldest)
     +1.0 => 41°C (hottest)
   cool mode target  = -1  (8°C)
   warm mode target  = +1  (41°C)
   contrast mode     = ping-pong between -1 and +1 on a 5s ease per leg. */
function valueToTempC(v) {
  // -1 -> 8, +1 -> 41 ; linear
  return 8 + (v + 1) * 0.5 * (41 - 8);
}

function updatePlate(now) {
  if (state.view !== 'back') return;

  // CONTRAST mode: 10s full cycle (5s cool->warm, 5s warm->cool) — using
  // a smooth easing so the transit feels like a long thermal soak.
  if (state.mode === 'contrast') {
    if (state.playing) {
      const period = 10000; // ms full cycle (5s + 5s)
      const phase = ((now - state.t0) % period) / period; // 0..1
      // sinusoidal between -1 and +1
      plateState.target = Math.sin(phase * Math.PI * 2 - Math.PI/2);
      // Note: at phase 0 -> -1 (cold), phase 0.5 -> +1 (hot), back at 1 -> -1.
    }
    // smooth ease toward target
    const easeK = 0.08;
    plateState.value += (plateState.target - plateState.value) * easeK;
  } else {
    const modeTarget = state.mode === 'cool' ? -1 : 1;
    let shimmer = 0;
    if (state.playing) {
      const t = (now - state.t0) / 1000;
      shimmer = Math.sin(t * 1.2) * 0.05;
    }
    plateState.target = modeTarget + shimmer;
    const easeK = 0.06;
    plateState.value += (plateState.target - plateState.value) * easeK;
  }

  const c = plateColorAtT(plateState.value);
  plateOverlay.style.setProperty('--plate-color', c.main);
  plateOverlay.style.setProperty('--plate-accent', c.accent);
  plateOverlay.style.setProperty('--plate-accent2', c.accent2);
  plateOverlay.style.opacity = c.alpha.toFixed(3);
  // propagate to outer halo too
  const halo = document.querySelector('.plate-halo');
  if (halo) halo.style.setProperty('--plate-color', c.main);
  // heat haze visible only when hot
  if (plateState.value > 0.3) plateHaze.classList.add('active');
  else plateHaze.classList.remove('active');
}

/* ---------- Plate temperature readout (shown under marker label) ---------- */
function updatePlateReadout() {
  const el = document.getElementById('plateTemp');
  if (!el || state.view !== 'back') return;
  const v = plateState.value;
  let tempC = valueToTempC(v);
  // Cool-side fluctuation: when the plate is at/near the cold floor,
  // show a gentle 8.0–9.0°C waver so the readout feels "live".
  if (v < -0.9) {
    const t = performance.now() / 1000;
    // Two-sine drift so it doesn't look like a pure sine wave
    const drift = (Math.sin(t * 0.9) + Math.sin(t * 1.7 + 1.2)) * 0.25; // ~-0.5..+0.5
    tempC = 8.5 + drift; // clamps inside 8.0..9.0
    tempC = Math.max(8.0, Math.min(9.0, tempC));
  }
  el.textContent = tempC.toFixed(1) + '°C';
  el.classList.remove('cold', 'warm', 'hot');
  if (v < -0.2) el.classList.add('cold');
  else if (v > 0.4) el.classList.add('hot');
  else el.classList.add('warm');
}

/* ---------- Markers (labels on vents) ---------- */
function buildMarkers() {
  markersEl.innerHTML = '';
  if (state.view === 'front') {
    // No markers on front view — airflow ribbons speak for themselves
  } else {
    // Plate marker: dot positioned left of plate, label + temp to right of dot.
    // Label class 'plate-marker' shifts text 5px further left than the default 20px.
    const m = document.createElement('div');
    m.className = 'marker intake plate-marker right';
    m.style.left = `calc(50% - 5px)`;
    m.style.top = `calc(42% - 5px)`;
    m.innerHTML = `<div class="dot"></div>
                   <div class="label">THERAPY PLATE
                     <span class="temp" id="plateTemp">—</span>
                   </div>`;
    m.addEventListener('mouseenter', e => showTip(e, 'Peltier contact surface — reverses between cold & hot'));
    m.addEventListener('mousemove',  e => showTip(e, 'Peltier contact surface — reverses between cold & hot'));
    m.addEventListener('mouseleave', hideTip);
    markersEl.appendChild(m);
  }
}

function showTip(e, text) {
  const r = stage.getBoundingClientRect();
  tooltip.textContent = text;
  tooltip.style.left = (e.clientX - r.left + 14) + 'px';
  tooltip.style.top = (e.clientY - r.top + 14) + 'px';
  tooltip.classList.add('show');
}
function hideTip() { tooltip.classList.remove('show'); }

/* ---------- UI wiring ---------- */
document.querySelectorAll('.sc-row.sc-view .sc-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.sc-row.sc-view .sc-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    setView(b.dataset.view);
  });
});
document.querySelectorAll('.sc-row.sc-mode .sc-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.sc-row.sc-mode .sc-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    setMode(b.dataset.mode);
  });
});
// Legacy panel controls removed — floating stage controls handle view + mode.
/* btnPlay / btnReset / speed / density panel wiring deleted; all controls now
   live in the floating .stage-controls bar. */

function setView(v) {
  state.view = v;
  stage.classList.toggle('view-front', v === 'front');
  stage.classList.toggle('view-back', v === 'back');
  if (v === 'front') {
    productImg.src = 'assets/cryotec-front.png';
    plateOverlay.classList.remove('show');
    if (headline) headline.innerHTML = 'Cold air <em>in</em>. Warm air out.';
    if (subline) subline.textContent = 'Ambient air is pulled through the honeycomb intake at the top. Heat from the internal exchanger is expelled through the tall side vents.';
    if (caption) caption.textContent = 'INTAKE 0.48 m³/min · Δt 23°C · FRONT VIEW';
    // reset intake/warm
    updateColorVars();
  } else {
    productImg.src = 'assets/cryotec-back.png';
    plateOverlay.classList.add('show');
    if (headline) headline.innerHTML = 'Therapy plate, <em>reversible</em>.';
    if (subline) subline.textContent = 'The rear contact plate glows cool blue when cooling, warm amber when heating, and gently cycles between both in Contrast mode.';
    if (caption) caption.textContent = 'PLATE RANGE 8–41°C · PELTIER · BACK VIEW';
    // clear particles so switch feels clean
    particles.length = 0;
    // snap plate toward new mode target immediately on view change
    plateState.target = state.mode === 'cool' ? -1 : (state.mode === 'warm' ? 1 : plateState.value);
  }
  buildMarkers();
  updateMode();
}

function setMode(m) {
  state.mode = m;
  // Restart the contrast cycle timer when entering contrast, so it
  // begins from the cold end on a fresh 5s leg.
  if (m === 'contrast') {
    state.t0 = performance.now();
  }
  updateMode();
}
function updateMode() {
  stage.classList.toggle('mode-cool', state.mode === 'cool');
  stage.classList.toggle('mode-warm', state.mode === 'warm');
  stage.classList.toggle('mode-contrast', state.mode === 'contrast');
  updateColorVars();
}
function updateColorVars() {
  // tint the LED on the mode badge (done via CSS based on .mode-warm)
}

/* init */
resizeCanvases();
buildStreamlines();
// wait for product image before sizing (use natural aspect from CSS)
productImg.addEventListener('load', () => { resizeCanvases(); buildStreamlines(); });
buildMarkers();
updateMode();
requestAnimationFrame(tick);

/* Observe size changes (e.g. layout reflow) */
const ro = new ResizeObserver(() => { resizeCanvases(); buildStreamlines(); });
ro.observe(stage);