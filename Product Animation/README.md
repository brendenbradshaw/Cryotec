# CryoTec — Scroll-driven Product Visualization

A self-contained section that replaces the existing **Three Modes** + product hero on cryotec.ca. As the visitor scrolls, the section pins to the viewport and transitions Cold → Heat → Contrast, with the device flipping between front and rear views and synchronized spec callouts (pocket-sized, therapy plate, 20-minute session).

---

## Files in this package

```
handoff/
├── README.md                              ← this file
├── cryotec-product-visualization.html     ← the section, fully self-contained
└── assets/
    ├── cryotec-front.png                  ← device front (transparent PNG)
    └── cryotec-rear.png                   ← device rear (transparent PNG)
```

The HTML file is **fully self-contained**: all CSS, JS, and React (CDN) live inline. The only external dependencies are:
- Two product images (provided in `assets/`)
- Google Fonts: Inter + JetBrains Mono (loaded from `fonts.googleapis.com`)
- React 18.3.1 + Babel standalone (loaded from `unpkg.com`)

---

## What this section does

1. **Sticky scroll track** — the section is ~320vh tall. The card pins to viewport center while the visitor scrolls.
2. **Three scroll segments** drive mode + spec changes:
   - **Cold** → "Pocket-sized" copy + front-face dimensions ruler (8.6 × 5.6 × 2.8 cm)
   - **Heat** → "Therapy plate" copy + rear-face plate ruler (6.9 × 3.6 cm), device auto-flips to rear
   - **Contrast** → "20-minute session" copy, device shown front, no ruler
3. **Mode transitions** include a radial flash sweep, color tween of the glow halo, and particle rebuild (snowflakes / heat shimmer / mixed).
4. **Contrast mode** auto-cycles the temperature reading between cold and heat (3 s count → 2 s hold → 3 s count back → 2 s hold), with the entire color palette lerping in lockstep.
5. **Intensity selector** (bottom-right) lets users pick L1 / L2 / L3 — temperatures swap to the correct value (16/12/8 °C cold, 36/38/41 °C heat).

---

## Integration paths

### Option A — Drop in as a full-page replacement section

Copy the entire `<section id="cryotec-product-visualization">` block (and its scoped `<style>` + `<script>`) into the page where the current "Three Modes" / product hero lives, and remove the old markup it's replacing.

All CSS is scoped under `#ct-page` and `#cryotec-product-visualization` so it will not collide with the rest of the cryotec.ca stylesheet. **Do not** strip the wrapping IDs.

### Option B — Embed via iframe

If you'd rather not merge inline, host `cryotec-product-visualization.html` at e.g. `/embeds/product-vis.html` and embed:

```html
<iframe
  src="/embeds/product-vis.html"
  style="width:100%; height:320vh; border:0; display:block;"
  loading="lazy"
  title="CryoTec product visualization"
></iframe>
```

The 320vh height matches the internal sticky track. Iframe is the safest option for a Shopify / managed CMS — zero risk of style or script collision.

### Option C — Convert to a React component

The current file uses inline Babel transpilation (fine for a static drop-in, slow for production). For a real React app:

1. Move the `<script type="text/babel">` body into a `.jsx` file.
2. Replace CDN React with the project's installed React.
3. Move the `<style>` block into a CSS module or styled-component.
4. Replace the inline `<link>` font loads with the project's font pipeline.
5. Image paths are currently `assets/cryotec-front.png` and `assets/cryotec-rear.png` (relative). Update to whatever the project's static asset import pattern is.

---

## Asset paths to update

The HTML references images at:

```html
<img src="assets/cryotec-front.png" />
<img src="assets/cryotec-rear.png" />
```

Update these two `src` values to match wherever the production site serves them (e.g. `/cdn/shop/files/cryotec-front.png` on Shopify, `/static/img/cryotec-front.png` on a static host, etc.).

---

## Brand tokens used

All colors and spacing match the existing CryoTec design system. Key values:

| Token | Value | Usage |
|---|---|---|
| `--c-blue` | `#0066FF` | Eyebrow accent, blue italic em on H2 |
| `--c-cold` | `#60c8ff` | Cold mode glow, cold accent text |
| `--c-heat` | `#ff6420` | Heat mode glow, heat accent text |
| `--c-ink` | `#111` | Headings + dark card surface |
| `--c-body` | `#555` | Body copy |
| `--c-muted` | `#8a8a8a` | Eyebrow labels, captions |
| `--c-bg-soft` | `#f7f7f5` | Section background (off-white) |
| Inter | 300/400/500/600/700 | All marketing copy |
| JetBrains Mono | 400/500/600 | Temperature readouts, dimensional labels |

If the production site already has these as CSS variables, you can delete the `:root` redeclarations inside the section's `<style>` block — they're duplicated locally only so the file works standalone.

---

## Tunable knobs (for designer fine-tuning later)

These CSS custom properties are at the top of the `:root` block. They control the position of the therapy-plate glow over the device:

```css
--plate-x: 25%;       /* left offset within the device frame */
--plate-y: 25%;       /* top offset within the device frame */
--plate-w: 50%;       /* glow width as % of device width */
--plate-h: 59%;       /* glow height as % of device height */
--plate-radius: 12px; /* corner roundness of the glow */
```

The rear-view ruler labels (6.9 cm / 3.6 cm) bind to these same vars, so nudging the glow moves the labels with it.

---

## Browser support

- Modern evergreen browsers (Chrome, Safari, Firefox, Edge — last 2 versions)
- Requires `position: sticky`, CSS custom properties, `mix-blend-mode`, `backdrop-filter`
- Honors `prefers-reduced-motion` — particles and continuous animations stop

---

## Performance notes

- Particle layers are CSS-only (no canvas), throttled with `will-change` only on transforming layers.
- The scroll handler is wrapped in `requestAnimationFrame` and only recalculates when the section is in viewport.
- Images are PNGs (~700 KB total). Consider serving as WebP for production.
- The Babel-in-browser transpilation adds ~150 ms of startup. **For production, pre-compile the JSX** (Option C above).

---

## QA checklist before pushing live

- [ ] Both image paths resolve in the production environment
- [ ] Inter and JetBrains Mono load (or production fonts are swapped in)
- [ ] Section sits in the page where the old "Three Modes" was
- [ ] On mobile, scroll-pinning still feels good (test iPhone Safari + Android Chrome)
- [ ] Cold → Heat → Contrast transitions trigger at the expected scroll positions
- [ ] Contrast mode temperature counter cycles 8 ↔ 41 °C smoothly
- [ ] Intensity pills (L1/L2/L3) update the temperature readout correctly
