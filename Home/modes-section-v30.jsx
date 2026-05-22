/* CryoTec — Modes Section v30 (sticky-scroll port)
   Renders the unified Cold / Heat / Contrast card with the same
   sticky-scroll behaviour as the original v30 prototype:

     • a 400vh tall outer .ct-track
     • a position:sticky inner .ct-shell that pins the card to the viewport
     • a scroll listener that swaps between cold / heat / contrast as the
       page progresses through the track
     • level pills auto-cycle (1 → 2 → 3) between mode changes
     • contrast mode auto-cycles cold↔heat stops with a colour-blend ramp

   The full v30 markup, CSS and IIFE are kept verbatim and injected into a
   React-mounted container at mount time. Because the v30 code is plain DOM
   manipulation, this keeps the original behaviour intact without porting
   each piece of state into React.

   When this lives inside a fixed-size design-canvas artboard (no page
   scroll), the scroll listener is inert; we additionally start a
   slow mode auto-advance fallback so the artboard preview still cycles
   between modes.
*/

const CT_MODES_V30_CSS = `
.ct-track {
  position: relative;
  height: 400vh;
  background: #f7f7f5;
}
.ct-shell {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  display: grid;
  align-items: center;
  overflow: hidden;
  z-index: 1;
  background: #f7f7f5;
}
.ct-section-wrap {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
}
@media (min-width: 769px) {
  .ct-card-unified {
    grid-template-columns: 320px 1.1fr 400px !important;
  }
  .ct-spec-stack { min-height: 380px !important; }
  .ct-specs-pane { padding: 22px 56px 28px 24px !important; }
  .ct-spec .lab     { font: 600 20px/1 var(--ct-font-mono) !important; }
  .ct-spec h3       { font-size: 38px !important; }
  .ct-spec .figure  { font-size: 56px !important; }
  .ct-spec p        { font-size: 26px !important; line-height: 1.4 !important; max-width: 420px !important; }
}

.ct-track {
  --mode-rgb: 96,200,255;
  --mode: rgb(96,200,255);
  --mode-2-rgb: 120,170,255;
  --mode-2: rgb(120,170,255);
  --intensity: 1;

  --plate-x: 12%;
  --plate-y: 13.25%;
  --plate-w: 75%;
  --plate-h: 84.75%;
  --plate-radius: 14px;

  --front-image-scale: 1.5;
  --rear-image-scale:  1.2;

  --rear-v-line-offset: 24%;
  --rear-v-label-offset: 28%;
  --rear-h-line-offset: 18%;
  --rear-h-label-offset: 26%;

  --front-v-right: -1%;
  --front-v-top: 10%;
  --front-v-height: 80%;
  --front-v-label-right: -6%;
  --front-v-label-top: 48%;
  --front-h-left: 10%;
  --front-h-top: 6%;
  --front-h-width: 50%;
  --front-h-label-left: 50%;
  --front-h-label-top: -1%;

  --ease-state: cubic-bezier(.4,0,.2,1);
  --ct-font-mono: 'JetBrains Mono', ui-monospace, monospace;
}

/* ─── Unified card ─── */
.ct-card-unified {
  width: 100%;
  height: min(880px, calc(100vh - 60px));
  min-height: 600px;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  isolation: isolate;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.04);
  display: grid;
  grid-template-columns: 320px 1.1fr 280px;
  grid-template-rows: auto 1fr auto;
  gap: 0;
  transition: background 0.8s var(--ease-state);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #fff;
}
.ct-card-header  { grid-column: 1 / -1; grid-row: 1; }
.ct-details-pane { grid-column: 1;       grid-row: 2; }
.ct-visual-pane  { grid-column: 2;       grid-row: 2 / 4; }
.ct-specs-pane   { grid-column: 3;       grid-row: 2 / 4; }
.ct-pills        { grid-column: 1;       grid-row: 3; }

.ct-card-unified[data-mode="cold"] {
  background:
    radial-gradient(ellipse 80% 60% at 50% 65%,
      rgba(96,200,255, calc(0.06 + 0.29 * var(--intensity))) 0%,
      rgba(96,200,255, calc(0.01 + 0.05 * var(--intensity))) 45%,
      transparent 75%),
    linear-gradient(180deg, #0a1421 0%, #050d18 50%, #02070f 100%);
}
.ct-card-unified[data-mode="heat"] {
  background:
    radial-gradient(ellipse 80% 60% at 50% 65%,
      rgba(255,100,32, calc(0.06 + 0.29 * var(--intensity))) 0%,
      rgba(255,100,32, calc(0.01 + 0.05 * var(--intensity))) 45%,
      transparent 75%),
    linear-gradient(180deg, #1a0a05 0%, #100604 50%, #080302 100%);
}
.ct-card-unified[data-mode="contrast"] {
  background:
    radial-gradient(ellipse 60% 50% at 30% 30%,
      rgba(96,200,255, calc(0.04 + 0.14 * var(--intensity))) 0%,
      transparent 55%),
    radial-gradient(ellipse 70% 60% at 70% 80%,
      rgba(255,100,32, calc(0.06 + 0.20 * var(--intensity))) 0%,
      transparent 60%),
    linear-gradient(180deg, #0a0a0a 0%, #060606 50%, #020202 100%);
}
.ct-card-unified::before {
  content: ''; position: absolute; inset: 0;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 25%);
  pointer-events: none; z-index: 1;
}

.ct-flash {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(var(--mode-rgb),0.25) 0%, transparent 60%);
  opacity: 0; z-index: 9;
}
.ct-flash.go { animation: flashOut 0.7s var(--ease-state) forwards; }
@keyframes flashOut {
  0% { opacity: 0; }
  30% { opacity: 1; }
  100% { opacity: 0; }
}

/* Header */
.ct-card-header {
  padding: 28px 48px 18px;
  position: static !important;
  z-index: 3;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32px;
}
.ct-header-text { flex: 1; min-width: 0; }
.ct-card-eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--mode);
  margin-bottom: 12px;
  transition: color 0.6s var(--ease-state);
}
.ct-card-eyebrow::before {
  content: ''; display: block;
  width: 22px; height: 1px;
  background: currentColor;
}
.ct-card-title {
  font-family: 'Unna', Georgia, serif;
  font-size: 36px; font-weight: 700;
  letter-spacing: -0.025em; line-height: 1.1;
  color: #fff; margin-bottom: 10px;
}
.ct-card-title em {
  font-style: italic;
  background: linear-gradient(135deg, var(--mode) 0%, var(--mode-2) 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: all 0.6s var(--ease-state);
}
.ct-card-subhead {
  font-size: 14px; line-height: 1.5;
  color: rgba(255,255,255,0.55);
  max-width: 540px;
}

/* Progress dots — vertical, right edge, centered */
.ct-progress {
  position: absolute !important;
  right: 18px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  flex-direction: column !important;
  align-items: center !important;
  margin: 0 !important;
  gap: 0 !important;
  pointer-events: none !important;
  z-index: 10 !important;
  display: flex;
}
.ct-progress-node {
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.20);
  transition: all 0.4s var(--ease-state);
  flex-shrink: 0;
  width: 10px !important; height: 10px !important;
}
.ct-progress-node.active {
  background: var(--mode);
  border-color: rgba(var(--mode-rgb),0.6);
  box-shadow: 0 0 14px rgba(var(--mode-rgb),0.7);
  width: 13px !important; height: 13px !important;
}
.ct-progress-node.completed { background: rgba(var(--mode-rgb),0.4); }
.ct-progress-line {
  width: 1px !important;
  height: 68px !important;
  background: rgba(255,255,255,0.12);
  flex-shrink: 0;
  transition: all 0.4s ease;
}
.ct-progress-line.filled {
  background: linear-gradient(180deg, rgba(var(--mode-rgb),0.5) 0%, rgba(var(--mode-rgb),0.7) 100%) !important;
}
.ct-progress-label { display: none !important; }

/* Details pane */
.ct-details-pane {
  padding: 22px 20px 12px 48px;
  display: flex; flex-direction: column;
  justify-content: center;
  position: relative; z-index: 3;
}
.ct-mode-word {
  font-family: 'Unna', Georgia, serif;
  font-size: 64px; font-weight: 700;
  letter-spacing: -0.04em; line-height: 1;
  margin-bottom: 18px;
  background: linear-gradient(135deg, var(--mode) 0%, var(--mode-2) 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: all 0.4s linear;
}
.ct-temp-big {
  font-family: var(--ct-font-mono);
  line-height: 1; margin-bottom: 6px;
  color: #fff;
  transition: color 0.4s linear;
  display: flex; align-items: baseline;
}
.ct-temp-big .num {
  font-size: 92px; font-weight: 700;
  letter-spacing: -0.05em;
  font-variant-numeric: tabular-nums;
}
.ct-temp-big .unit {
  font-size: 36px; font-weight: 500;
  color: rgba(255,255,255,0.5);
  margin-left: 4px;
}
.ct-temp-f {
  font-family: var(--ct-font-mono);
  font-size: 12px; font-weight: 500;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: rgba(255,255,255,0.55);
}

/* Pills — level bars */
.ct-pills {
  display: flex;
  align-items: flex-end;
  gap: 32px;
  padding: 0 20px 28px 48px;
  max-width: 320px;
  position: relative; z-index: 3;
}
.ct-pill {
  background: transparent;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 6px 4px;
  cursor: pointer;
  transition: transform 0.3s ease;
  -webkit-tap-highlight-color: transparent !important;
  user-select: none !important;
}
.ct-pill:hover { transform: translateY(-2px); }
.ct-pill:focus,
.ct-pill:focus-visible { outline: none !important; box-shadow: none !important; }
.ct-bars {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 28px;
}
.ct-bars .bar {
  width: 100%;
  height: 3px;
  border-radius: 2px;
  background: rgba(255,255,255,0.18);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}
.ct-pill[data-active="true"] .ct-bars .bar {
  background: var(--mode);
  box-shadow: 0 0 6px rgba(var(--mode-rgb),0.6);
}
.ct-pill .v {
  font: 500 13px/1 var(--ct-font-mono);
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.04em;
  transition: color 0.3s ease;
}
.ct-pill[data-active="true"] .v {
  color: var(--mode);
  font-weight: 600;
}

/* Visual pane */
.ct-visual-pane {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  padding: 8px 24px 12px;
  min-height: 0;
  overflow: visible;
}
.ct-product, .ct-flipper-wrap, .ct-flipper { overflow: visible; }
.ct-product {
  position: relative;
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
}
.ct-flipper-wrap {
  position: relative;
  height: 100%;
  aspect-ratio: 0.578;
  max-width: 100%;
  transition: height 0.6s var(--ease-state);
}
.ct-flipper-wrap[data-face="rear"] {
  height: 72%;
}
.ct-flipper {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transition: transform 1s var(--ease-state);
}
.ct-flipper[data-face="rear"] {
  transform: rotateY(180deg);
}
.ct-face {
  position: absolute; inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex; align-items: center; justify-content: center;
}
.ct-face.rear { transform: rotateY(180deg); }
.ct-face img {
  width: 100%; height: 100%;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 24px 50px rgba(0,0,0,0.5));
  transition: transform 0.6s var(--ease-state);
}
.ct-face.front img { transform: scale(var(--front-image-scale)); }
.ct-face.rear  img { transform: scale(var(--rear-image-scale));  }

.ct-plate-glow {
  position: absolute;
  left: var(--plate-x); top: var(--plate-y);
  width: var(--plate-w); height: var(--plate-h);
  border-radius: var(--plate-radius);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.6s var(--ease-state);
  z-index: 2;
}
.ct-flipper-wrap[data-face="rear"] .ct-plate-glow { opacity: 1; }
.ct-plate-glow .ring {
  position: absolute; inset: 0;
  border-radius: inherit;
  border: 1px solid rgba(var(--mode-rgb),0.6);
  box-shadow:
    0 0 calc(60px + 40px * var(--intensity)) rgba(var(--mode-rgb), calc(0.4 + 0.25 * var(--intensity))) inset,
    0 0 calc(40px + 30px * var(--intensity)) rgba(var(--mode-rgb), calc(0.3 + 0.25 * var(--intensity)));
}

/* Rear-face rulers */
.ct-rear-vline {
  position: absolute;
  right: calc(100% - var(--plate-x) - var(--plate-w) - var(--rear-v-line-offset));
  top: var(--plate-y);
  width: 1px;
  height: var(--plate-h);
  background: rgba(var(--mode-rgb),0.7);
  box-shadow: 0 0 8px rgba(var(--mode-rgb),0.4);
}
.ct-rear-vlabel {
  position: absolute;
  right: calc(100% - var(--plate-x) - var(--plate-w) - var(--rear-v-label-offset));
  top: calc(var(--plate-y) + var(--plate-h) / 2);
  transform: translate(100%,-50%);
  font: 600 10px/1 var(--ct-font-mono);
  letter-spacing: 0.08em;
  color: var(--mode);
  background: rgba(0,0,0,0.7);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(var(--mode-rgb),0.35);
  backdrop-filter: blur(8px);
  white-space: nowrap;
}
.ct-rear-hline {
  position: absolute;
  left: var(--plate-x);
  top: calc(var(--plate-y) - var(--rear-h-line-offset));
  width: var(--plate-w);
  height: 1px;
  background: rgba(var(--mode-rgb),0.7);
  box-shadow: 0 0 8px rgba(var(--mode-rgb),0.4);
}
.ct-rear-hlabel {
  position: absolute;
  left: calc(var(--plate-x) + var(--plate-w) / 2);
  top: calc(var(--plate-y) - var(--rear-h-label-offset));
  transform: translate(-50%,0);
  font: 600 10px/1 var(--ct-font-mono);
  letter-spacing: 0.08em;
  color: var(--mode);
  background: rgba(0,0,0,0.7);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(var(--mode-rgb),0.35);
  backdrop-filter: blur(8px);
  white-space: nowrap;
}
.ct-ruler {
  position: absolute; inset: 0;
  pointer-events: none; z-index: 4;
  opacity: 0;
  transition: opacity 0.5s var(--ease-state);
}
.ct-ruler[data-active="true"] { opacity: 1; }

/* Specs pane */
.ct-specs-pane {
  padding: 22px 48px 28px 16px;
  position: relative; z-index: 3;
  display: flex; align-items: center;
}
.ct-spec-stack {
  position: relative; width: 100%;
  min-height: 240px;
}
.ct-spec {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; gap: 12px;
  text-align: right;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s var(--ease-state), transform 0.5s var(--ease-state);
  pointer-events: none;
}
.ct-spec[data-active="true"] {
  opacity: 1; transform: translateY(0);
}
.ct-spec .lab {
  font: 600 10px/1 var(--ct-font-mono);
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--mode);
  transition: color 0.4s linear;
}
.ct-spec h3 {
  font-family: 'Unna', Georgia, serif;
  font-size: 19px; font-weight: 700;
  letter-spacing: -0.015em; line-height: 1.25;
  color: #fff;
  text-wrap: balance;
}
.ct-spec .figure {
  font-size: 28px; font-weight: 700;
  letter-spacing: -0.025em;
  color: #fff; line-height: 1;
  font-variant-numeric: tabular-nums;
}
.ct-spec .figure .u {
  font-size: 0.5em; font-weight: 500;
  color: rgba(255,255,255,0.6);
  margin-left: 4px; letter-spacing: 0;
}
.ct-spec p {
  font-size: 13px; line-height: 1.5;
  color: rgba(255,255,255,0.65);
  max-width: 240px;
  margin-left: auto;
}

.ct-particles {
  position: absolute; inset: 0;
  overflow: hidden; pointer-events: none;
  border-radius: 24px;
  z-index: 1;
}
.flake {
  position: absolute;
  color: rgba(var(--mode-rgb),0.55);
  animation: flakeFall var(--dur,9s) linear infinite;
  animation-delay: var(--delay,0s);
  opacity: 0;
  will-change: transform, opacity;
  text-shadow: 0 0 8px rgba(var(--mode-rgb),0.45);
}
@keyframes flakeFall {
  0% { transform: translateY(-8%) translateX(0) rotate(0); opacity: 0; }
  10% { opacity: 0.85; }
  90% { opacity: 0.65; }
  100% { transform: translateY(108%) translateX(var(--drift,8px)) rotate(360deg); opacity: 0; }
}

@media (max-width: 768px) {
  .ct-track {
    --front-image-scale: 0.9 !important;
    --rear-image-scale:  0.6 !important;
  }
  .ct-face img { transition: none !important; }
  .ct-shell {
    height: calc(100vh + 40px) !important;
    height: calc(100svh + 40px) !important;
    align-items: start !important;
    padding: 8px;
  }
  .ct-section-wrap { height: 100%; }
  .ct-card-unified {
    display: flex !important;
    flex-direction: column !important;
    grid-template-columns: none !important;
    grid-template-rows: none !important;
    height: 100% !important;
    min-height: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    border-radius: 18px;
    overflow: hidden;
    box-sizing: border-box;
  }
  .ct-card-header {
    flex: 0 0 auto;
    padding: 12px 18px 6px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .ct-header-text { width: 100%; padding-right: 60px; box-sizing: border-box; }
  .ct-card-title { font-size: 26px !important; line-height: 1.15 !important; margin: 0 !important; }
  .ct-card-subhead { display: none !important; }
  .ct-details-pane {
    flex: 0 0 auto;
    padding: 14px 10px 0 !important;
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: wrap !important;
    align-items: baseline !important;
    justify-content: center !important;
    column-gap: 12px !important;
    row-gap: 0 !important;
    text-align: center !important;
  }
  .ct-mode-word { font-size: 34px !important; line-height: 1.05 !important; margin: 0 !important; }
  .ct-temp-big .num { font-size: 34px !important; line-height: 1 !important; }
  .ct-temp-big .unit { font-size: 16px !important; }
  .ct-temp-f { display: block !important; flex-basis: 100% !important; width: 100% !important; order: 99 !important; font-size: 11px !important; margin-top: 8px !important; text-align: center !important; }
  .ct-visual-pane { flex: 1 1 0 !important; min-height: 0 !important; padding: 0 4px 4px !important; }
  .ct-flipper-wrap { width: 75% !important; max-width: none !important; height: auto !important; margin: 0 auto !important; }
  .ct-track {
    --plate-x: 31% !important;
    --plate-y: 32% !important;
    --plate-w: 37.5% !important;
    --plate-h: 42.1% !important;
    --plate-radius: 10px !important;
  }
  .ct-plate-glow { transform: none !important; }
  .ct-ruler { display: none !important; }
  .ct-pills { flex: 0 0 auto; padding: 4px 16px !important; max-width: none !important; justify-content: center !important; gap: 16px !important; }
  .ct-specs-pane { flex: 0 0 auto; padding: 4px 18px 12px !important; display: block !important; }
  .ct-spec-stack { min-height: 0 !important; position: relative; }
  .ct-spec { position: relative !important; inset: auto !important; display: none !important; align-items: center !important; text-align: center !important; gap: 4px !important; opacity: 1 !important; transform: none !important; }
  .ct-spec[data-active="true"] { display: flex !important; }
  .ct-spec h3 { display: none !important; }
  .ct-spec p  { display: none !important; }
  .ct-spec .lab    { font-size: 10px !important; }
  .ct-spec .figure { font-size: 22px !important; }
}

/* ─── Scroll-to-explore hint ───
   Lives inside the .ct-visual-pane so it always sits horizontally
   centered on the product image, regardless of how the card's outer
   column widths change between viewport sizes (the desktop layout uses
   320 / 1.1fr / 400 columns, the mobile layout collapses to flex). Uses
   a row layout so the text + animated arrow fit on a single line that
   does not intrude on the product. Fades out at contrast mode. */
.ct-scroll-hint {
  position: absolute;
  left: 50%;
  bottom: 8px;
  transform: translateX(-50%);
  z-index: 5;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 14px;
  pointer-events: none;
  font: 600 11px/1 var(--ct-font-mono);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.78);
  text-shadow: 0 2px 12px rgba(0,0,0,0.6);
  transition: opacity 0.6s var(--ease-state), transform 0.6s var(--ease-state);
  white-space: nowrap;
}
.ct-card-unified[data-mode="contrast"] .ct-scroll-hint {
  opacity: 0;
  transform: translate(-50%, 12px);
}
.ct-scroll-hint .arrow {
  width: 20px;
  height: 30px;
  border: 1.25px solid rgba(255,255,255,0.45);
  border-radius: 100px;
  position: relative;
  flex-shrink: 0;
}
.ct-scroll-hint .arrow::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 6px;
  transform: translateX(-50%);
  width: 3px;
  height: 6px;
  border-radius: 100px;
  background: rgba(255,255,255,0.9);
  animation: ctScrollDot 1.8s cubic-bezier(.6,.05,.4,.95) infinite;
}
@keyframes ctScrollDot {
  0%   { transform: translate(-50%, 0); opacity: 0; }
  25%  { opacity: 1; }
  75%  { opacity: 1; }
  100% { transform: translate(-50%, 14px); opacity: 0; }
}
@media (max-width: 768px) {
  .ct-scroll-hint { display: none !important; }
}
/* No reason to nag the user inside a non-scrolling artboard preview */
.ct-modes-v30-host[data-ct-mode="artboard"] .ct-scroll-hint { display: none !important; }

/* ─── Artboard mode ───
   Inside a design-canvas artboard there is no scrolling ancestor, so
   position:sticky degrades to position:relative and the 400vh track
   becomes 3500px of empty grey below the card. The .ct-modes-v30-host
   gets the data-ct-mode="artboard" attribute (set automatically by
   ModesSectionV30 when its parent has overflow:hidden) which collapses
   the track to a single viewport. Modes still auto-advance via the JS
   fallback so the preview keeps cycling. */
.ct-modes-v30-host[data-ct-mode="artboard"] .ct-track {
  height: 940px !important;
}
.ct-modes-v30-host[data-ct-mode="artboard"] .ct-shell {
  position: relative !important;
  height: 940px !important;
}
.ct-modes-v30-host[data-ct-mode="artboard"] .ct-card-unified {
  height: 880px !important;
}
`;

const CT_MODES_V30_HTML = `
<div class="ct-track" data-ct-track>
  <section class="ct-shell">
    <div class="ct-section-wrap">
      <article class="ct-card-unified" data-ct-card data-mode="cold">

        <div class="ct-particles" data-ct-particles></div>
        <div class="ct-flash" data-ct-flash></div>

        <header class="ct-card-header">
          <div class="ct-header-text">
            <span class="ct-card-eyebrow">The Device</span>
            <h2 class="ct-card-title">Three modes. <em>One device.</em></h2>
            <p class="ct-card-subhead">Select from Cold, Heat, or Contrast mode. Three intensity levels let you dial in the right temperature for your recovery.</p>
          </div>
          <div class="ct-progress" data-ct-progress>
            <div class="ct-progress-node active" data-step="0"></div>
            <div class="ct-progress-line"></div>
            <div class="ct-progress-node" data-step="1"></div>
            <div class="ct-progress-line"></div>
            <div class="ct-progress-node" data-step="2"></div>
            <span class="ct-progress-label" data-ct-prog-label>01 / 03</span>
          </div>
        </header>

        <div class="ct-details-pane">
          <div class="ct-mode-word" data-ct-mode-word>Cold.</div>
          <div class="ct-temp-big">
            <span class="num" data-ct-tempnum>8</span><span class="unit">°C</span>
          </div>
          <div class="ct-temp-f" data-ct-tempf>46°F · Maximum cold</div>
        </div>

        <div class="ct-visual-pane">
          <div class="ct-product" data-ct-product data-face="front">
            <div class="ct-flipper-wrap" data-ct-flipper-wrap>
              <div class="ct-flipper" data-ct-flipper data-face="front">
                <div class="ct-face front">
                  <img src="https://cryotec.ca/wp-content/uploads/2026/04/cryotec-front.png" alt="CryoTec front" />
                </div>
                <div class="ct-face rear">
                  <img src="https://cryotec.ca/wp-content/uploads/2026/04/cryotec-back.png" alt="CryoTec rear" />
                </div>
              </div>
              <div class="ct-plate-glow"><div class="ring"></div></div>
              <div class="ct-ruler" data-ct-ruler-rear>
                <div class="ct-rear-vline"></div>
                <div class="ct-rear-vlabel">6.9 cm</div>
                <div class="ct-rear-hline"></div>
                <div class="ct-rear-hlabel">3.6 cm</div>
              </div>
            </div>
          </div>
          <div class="ct-scroll-hint" aria-hidden="true">
            <span>Scroll to explore</span>
            <span class="arrow"></span>
          </div>
        </div>

        <div class="ct-specs-pane">
          <div class="ct-spec-stack">
            <div class="ct-spec" data-spec="0" data-active="true">
              <span class="lab">Pocket-sized device</span>
              <h3>Goes wherever you go in a pocket-sized device.</h3>
              <span class="figure">8.6 <span class="u">×</span> 5.6 <span class="u">×</span> 2.8 <span class="u">cm</span></span>
              <p>Fits a gym bag, your pocket, or a running vest.</p>
            </div>
            <div class="ct-spec" data-spec="1">
              <span class="lab">Therapy plate size</span>
              <h3>Right-sized for tendons, joints &amp; muscles.</h3>
              <span class="figure">6.9 <span class="u">×</span> 3.6 <span class="u">cm</span></span>
              <p>The therapy plate sits flush against your skin — knee, elbow, wrist or shins.</p>
            </div>
            <div class="ct-spec" data-spec="2">
              <span class="lab">Recommended session</span>
              <h3>Twenty Minutes. Hands-Free.</h3>
              <span class="figure">20 <span class="u">min</span></span>
              <p>Strap it on, set it, recover.</p>
            </div>
          </div>
        </div>

        <div class="ct-pills">
          <button class="ct-pill" data-level="1">
            <div class="ct-bars">
              <div class="bar"></div>
            </div>
            <span class="v" data-tv-1>16°</span>
          </button>
          <button class="ct-pill" data-level="2">
            <div class="ct-bars">
              <div class="bar"></div>
              <div class="bar"></div>
            </div>
            <span class="v" data-tv-2>12°</span>
          </button>
          <button class="ct-pill" data-level="3" data-active="true">
            <div class="ct-bars">
              <div class="bar"></div>
              <div class="bar"></div>
              <div class="bar"></div>
            </div>
            <span class="v" data-tv-3>8°</span>
          </button>
        </div>

      </article>
    </div>
  </section>
</div>
`;

/* The v30 controller. Wired up to whichever .ct-track is passed in so
   multiple instances on a page won't fight each other. */
function initCryoTecModesV30(rootEl) {
  if (!rootEl || rootEl.__ctInited) return;
  rootEl.__ctInited = true;

  const $ = (sel) => rootEl.querySelector(sel);
  const $$ = (sel) => rootEl.querySelectorAll(sel);

  const card        = $('[data-ct-card]');
  const flash       = $('[data-ct-flash]');
  const flipper     = $('[data-ct-flipper]');
  const flipperWrap = $('[data-ct-flipper-wrap]');
  const product     = $('[data-ct-product]');
  const particles   = $('[data-ct-particles]');
  const tempNum     = $('[data-ct-tempnum]');
  const tempF       = $('[data-ct-tempf]');
  const modeWord    = $('[data-ct-mode-word]');
  const rulerRear   = $('[data-ct-ruler-rear]');
  const progLabel   = $('[data-ct-prog-label]');
  const progressNodes = $$('.ct-progress-node');
  const progressLines = $$('.ct-progress-line');

  // Scope CSS-variable writes to rootEl so multiple instances stay independent.
  const setVar = (k, v) => rootEl.style.setProperty(k, v);

  const MODES = {
    cold: {
      rgb:'96,200,255', rgb2:'120,170,255', word:'Cold.', label:'Cold Therapy',
      levels:{ 1:[{c:16,f:61}], 2:[{c:12,f:54}], 3:[{c:8,f:46}] },
      kicker:{1:'Gentle cold',2:'Moderate cold',3:'Maximum cold'},
      particles:'cold', iMul:{1:.35,2:.65,3:1}
    },
    heat: {
      rgb:'255,100,32', rgb2:'255,160,80', word:'Heat.', label:'Heat Therapy',
      levels:{ 1:[{c:36,f:97}], 2:[{c:38,f:100}], 3:[{c:41,f:106}] },
      kicker:{1:'Gentle warmth',2:'Therapeutic heat',3:'Maximum heat'},
      particles:'heat', iMul:{1:.35,2:.65,3:1}
    },
    contrast: {
      word:'Contrast.', label:'Contrast Therapy',
      levels:{
        1:[{c:16,f:61,phase:'cold'},{c:36,f:97,phase:'heat'}],
        2:[{c:12,f:54,phase:'cold'},{c:38,f:100,phase:'heat'}],
        3:[{c:8,f:46,phase:'cold'},{c:41,f:106,phase:'heat'}]
      },
      kicker:{1:'Auto-cycle · 16°➔36°',2:'Auto-cycle · 12°➔38°',3:'Auto-cycle · 8°➔41°'},
      particles:'contrast', iMul:{1:.5,2:.75,3:1}
    }
  };
  const MODE_KEYS = ['cold','heat','contrast'];

  const TIMING = {
    levelInterval: 4000,
    levelTween: 900,
    contrastInterval: 5000,
    contrastTween: 3000,
    modeInterval: 12000
  };

  function lerpArr(a,b,t){ return a.map((x,i)=>Math.round(x+(b[i]-x)*t)); }
  function contrastColorForTemp(c){
    const COLD_C  = [96, 200, 255];
    const MID_C   = [155, 130, 200];
    const HEAT_C  = [255, 100, 32];
    if(c <= 16) return COLD_C;
    if(c >= 30) return HEAT_C;
    const t = (c - 16) / 14;
    if(t < 0.5) return lerpArr(COLD_C, MID_C, t * 2);
    return lerpArr(MID_C, HEAT_C, (t - 0.5) * 2);
  }
  function contrast2ColorForTemp(c){
    const COLD2 = [120, 170, 255];
    const MID2  = [185, 165, 220];
    const HEAT2 = [255, 160, 80];
    if(c <= 16) return COLD2;
    if(c >= 30) return HEAT2;
    const t = (c - 16) / 14;
    if(t < 0.5) return lerpArr(COLD2, MID2, t * 2);
    return lerpArr(MID2, HEAT2, (t - 0.5) * 2);
  }
  function applyContrastColorForTemp(c){
    const r  = contrastColorForTemp(c).join(',');
    const r2 = contrast2ColorForTemp(c).join(',');
    setVar('--mode-rgb', r);
    setVar('--mode', 'rgb(' + r + ')');
    setVar('--mode-2-rgb', r2);
    setVar('--mode-2', 'rgb(' + r2 + ')');
  }

  let mode = 'cold';
  let level = 3;
  let stopIdx = 0;
  let levelTimer = null, stopTimer = null, modeTimer = null, counterRAF = null;
  let autoPlay = true;

  function rebuildParticles(kind){
    particles.innerHTML = '';
    const count = kind==='heat'?12 : kind==='contrast'?16 : 18;
    for(let i=0;i<count;i++){
      const f = document.createElement('span');
      f.className = 'flake';
      f.style.left = (Math.random()*98+1)+'%';
      f.style.setProperty('--dur', (7+Math.random()*7)+'s');
      f.style.setProperty('--delay', (Math.random()*-9)+'s');
      f.style.setProperty('--drift', ((Math.random()-0.5)*40)+'px');
      f.textContent = '·';
      f.style.fontSize = (10+Math.random()*14)+'px';
      if(kind==='heat'){ f.style.color = 'rgba(255,180,120,0.85)'; }
      else if(kind==='contrast'){ f.style.color = i%2 ? 'rgba(96,200,255,0.7)' : 'rgba(255,140,80,0.75)'; }
      else{ f.style.color = 'rgba(180,225,255,0.85)'; }
      particles.appendChild(f);
    }
  }

  function lerp(a,b,t){ return a+(b-a)*t; }

  function animateTo(target, ms){
    cancelAnimationFrame(counterRAF);
    const startC = parseFloat(tempNum.textContent) || target.c;
    const startTime = performance.now();
    const isContrast = mode==='contrast';
    const cfg = MODES[mode];
    function frame(now){
      const t = Math.min(1,(now-startTime)/ms);
      const eased = t<.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;
      const cur = lerp(startC, target.c, eased);
      tempNum.textContent = Math.round(cur);
      if(isContrast){ applyContrastColorForTemp(cur); }
      if(t<1){ counterRAF = requestAnimationFrame(frame); }
      else{
        tempNum.textContent = target.c;
        tempF.textContent = target.f + '°F · ' + cfg.kicker[level];
        if(isContrast) applyContrastColorForTemp(target.c);
      }
    }
    counterRAF = requestAnimationFrame(frame);
  }

  function applyMode(m, opts){
    opts = opts || {};
    if(m===mode && !opts.force) return;
    mode = m;
    const cfg = MODES[m];

    if(opts.flash){
      flash.classList.remove('go');
      void flash.offsetWidth;
      flash.classList.add('go');
    }

    if(m==='contrast'){
      const startC = MODES.contrast.levels[level][0].c;
      applyContrastColorForTemp(startC);
    } else {
      setVar('--mode-rgb', cfg.rgb);
      setVar('--mode', 'rgb(' + cfg.rgb + ')');
      setVar('--mode-2-rgb', cfg.rgb2);
      setVar('--mode-2', 'rgb(' + cfg.rgb2 + ')');
    }

    card.dataset.mode = m;
    modeWord.textContent = cfg.word;

    Object.entries(cfg.levels).forEach(function(entry){
      const l = entry[0], arr = entry[1];
      const el = rootEl.querySelector('[data-tv-' + l + ']');
      if(!el) return;
      if(m==='contrast') el.textContent = arr[0].c + '°➔' + arr[1].c + '°';
      else el.textContent = arr[0].c + '°';
    });

    const newFace = (m==='cold') ? 'front' : 'rear';
    flipper.dataset.face = newFace;
    product.dataset.face = newFace;
    if(flipperWrap) flipperWrap.dataset.face = newFace;

    const segIdx = MODE_KEYS.indexOf(m);
    applySpec(segIdx);

    progressNodes.forEach(function(n, i){
      n.classList.toggle('active', i===segIdx);
      n.classList.toggle('completed', i<segIdx);
    });
    progressLines.forEach(function(l, i){
      l.classList.toggle('filled', i<segIdx);
    });
    progLabel.textContent = String(segIdx+1).padStart(2,'0') + ' / 03';

    rebuildParticles(cfg.particles);
    startCycle();
  }

  function applySpec(idx){
    $$('.ct-spec').forEach(function(el, i){
      el.dataset.active = (i===idx).toString();
    });
    rulerRear.dataset.active = (idx===1).toString();
  }

  function startCycle(){
    if(levelTimer) clearInterval(levelTimer);
    if(stopTimer) clearInterval(stopTimer);
    stopIdx = 0;
    applyLevelStop(level, 0, 0);
    if(!autoPlay) return;
    if(mode==='contrast'){
      stopTimer = setInterval(function(){
        const stops = MODES[mode].levels[level];
        stopIdx = (stopIdx+1) % stops.length;
        applyLevelStop(level, stopIdx, TIMING.contrastTween);
      }, TIMING.contrastInterval);
      return;
    }
    levelTimer = setInterval(function(){
      level = level >= 3 ? 1 : level+1;
      stopIdx = 0;
      applyLevelStop(level, 0, TIMING.levelTween);
    }, TIMING.levelInterval);
  }

  function applyLevelStop(l, sIdx, ms){
    level = l; stopIdx = sIdx;
    const cfg = MODES[mode];
    const target = cfg.levels[l][sIdx];
    $$('.ct-pill').forEach(function(b){
      b.dataset.active = (parseInt(b.dataset.level)===l).toString();
    });
    setVar('--intensity', cfg.iMul[l].toString());
    if(ms<=0){
      tempNum.textContent = target.c;
      tempF.textContent = target.f + '°F · ' + cfg.kicker[l];
      if(mode==='contrast') applyContrastColorForTemp(target.c);
    } else {
      animateTo(target, ms);
    }
  }

  function startModeAutoAdvance(){
    if(modeTimer) clearInterval(modeTimer);
    modeTimer = setInterval(function(){
      if(!autoPlay) return;
      const idx = MODE_KEYS.indexOf(mode);
      const next = MODE_KEYS[(idx+1) % MODE_KEYS.length];
      applyMode(next, {flash:true});
    }, TIMING.modeInterval);
  }

  $$('.ct-pill').forEach(function(btn){
    btn.addEventListener('click', function(){
      level = parseInt(btn.dataset.level);
      if(levelTimer) clearInterval(levelTimer);
      if(stopTimer) clearInterval(stopTimer);
      applyLevelStop(level, 0, 700);
      startCycle();
    });
  });

  applyMode('cold', {force:true});
  level = 3;
  applyLevelStop(3, 0, 0);
  startCycle();

  // Scroll-driven mode change. Only active when the track has enough vertical
  // travel for sticky scroll to engage (i.e. rendered in a normally scrolling
  // page, not inside a non-scrolling artboard). Falls back to a slow timer.
  const track = rootEl;
  const COOLDOWN_MS = 1000;
  let lastSegment = 0;
  let lockUntil = 0;
  function progress(){
    if(!track) return 0;
    const r = track.getBoundingClientRect();
    const total = track.offsetHeight - window.innerHeight;
    if(total <= 0) return 0;
    return Math.max(0, Math.min(1, -r.top / total));
  }
  function isStickyEngaged(){
    if(!track) return false;
    const r = track.getBoundingClientRect();
    return r.top <= 0 && r.bottom > window.innerHeight;
  }
  function onScroll(){
    if(Date.now() < lockUntil) return;
    const p = progress();
    const seg = p < (1/3) ? 0 : (p < (2/3) ? 1 : 2);
    if(seg !== lastSegment){
      lastSegment = seg;
      applyMode(MODE_KEYS[seg], {flash:true});
      lockUntil = Date.now() + COOLDOWN_MS;
    }
  }
  function shouldBlock(){ return isStickyEngaged() && Date.now() < lockUntil; }
  window.addEventListener('wheel', function(e){ if(shouldBlock()) e.preventDefault(); }, {passive:false});
  window.addEventListener('touchmove', function(e){ if(shouldBlock()) e.preventDefault(); }, {passive:false});
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll, {passive:true});
  onScroll();

  // Fallback: when the track has no scroll travel (e.g. inside a design-
  // canvas artboard) or the user never scrolls, auto-advance modes so the
  // preview still cycles between cold → heat → contrast.
  startModeAutoAdvance();
}

function ModesSectionV30() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    // inject CSS once globally
    if (!document.getElementById('ct-modes-v30-css')) {
      const s = document.createElement('style');
      s.id = 'ct-modes-v30-css';
      s.textContent = CT_MODES_V30_CSS;
      document.head.appendChild(s);
    }
    if (!ref.current) return;
    ref.current.innerHTML = CT_MODES_V30_HTML;

    // If any scrolling ancestor is missing (parent overflow is hidden /
    // clip), we're inside a fixed-size frame — collapse the 400vh track so
    // the preview shows just the card, not 3500px of empty grey.
    const hasScrollAncestor = (() => {
      let el = ref.current.parentElement;
      while (el && el !== document.body) {
        const o = getComputedStyle(el).overflow;
        if (o === 'hidden' || o === 'clip') return false;
        el = el.parentElement;
      }
      return true;
    })();
    if (!hasScrollAncestor) {
      ref.current.dataset.ctMode = 'artboard';
    }

    const trackEl = ref.current.querySelector('[data-ct-track]');
    initCryoTecModesV30(trackEl);
  }, []);
  return <div ref={ref} className="ct-modes-v30-host" />;
}

window.ModesSectionV30 = ModesSectionV30;
