# CryoTec — Hero Final · WordPress install

Four files. Drop them onto your WordPress site in whatever order fits your
workflow (Elementor / WPCode snippets / Custom HTML block / theme files).

## Files in this folder

| File                | What it is                                    |
| ------------------- | --------------------------------------------- |
| `hero.html`         | The hero markup. Paste into a Custom HTML block, an Elementor HTML widget, or your page template. |
| `hero.css`          | All styles, scoped to `.mf`. Load on the homepage only. |
| `hero.js`           | ~50 lines of vanilla JS for the dropdown + mobile trust rotator. |
| `track-calf-final.png` | The hero photo. Upload to Media Library. |

## Install (the fast way — WPCode / Code Snippets)

1. **Upload the photo.** Media Library → Add New → upload `track-calf-final.png`.
   Copy the file URL Wordpress shows you (e.g. `https://cryotec.ca/wp-content/uploads/2026/05/track-calf-final.png`).
2. **In `hero.html`**, replace `/wp-content/uploads/2026/05/track-calf-final.png`
   with that URL.
3. **Add the CSS.** WPCode → Add Snippet → CSS Snippet → paste `hero.css` →
   Location: *Site-Wide Header* → Conditional Logic: *Page is Home* → Save & Activate.
4. **Add the JS.** WPCode → Add Snippet → JS Snippet → paste `hero.js` →
   Location: *Site-Wide Footer* → Conditional Logic: *Page is Home* → Save & Activate.
5. **Add the HTML.** Edit your homepage → at the top, add a Custom HTML block
   → paste `hero.html` → Update.

## Fonts

The hero uses three Google Fonts: **Unna** (headline serif),
**Inter** (UI sans), **JetBrains Mono** (eyebrows). If your theme doesn't
already load them, add this once in your `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Unna:ital,wght@0,400;0,700;1,400;1,700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
```

In WPCode that's: *Add Snippet → HTML Snippet → Location: Site-Wide Header*.

## Wiring the "Claim Launch Offer" form

By default the form just shows a "you're on the list" success state — no
emails are stored anywhere. Open `hero.js` and find this block:

```js
form.addEventListener('submit', function (e) {
  e.preventDefault();
  // === Wire your email-capture here ===
  showThanks();
});
```

Replace `showThanks()` with a `fetch()` POST to your Brevo / Mailchimp /
Klaviyo endpoint. The form posts a single `email` field.

## Tweaks you'll probably want

- **CTA link** — `hero.html`, search for `/product/cryotec/` and replace
  with your real product URL.
- **Headline copy** — three `<span class="line">`s in `hero.html`. The
  italic blue word is `l3`.
- **Price** — `mf-price-now` and `mf-price-was` in `hero.html`.
- **Scarcity number** — `mf-scarcity-num` (the `500`).
- **Trust bar items** — four `mf-tb-item`s, plus the matching `mf-tb-m`s
  used by the mobile rotator. Keep them in sync.

## Removing things

The hero is self-contained inside the `<section class="mf">` element. To
remove it, delete that whole block. To remove the trust bar specifically,
delete the `<div class="mf-trust">…</div>` block. To remove the scarcity
stamp, delete the `<div class="mf-scarcity">…</div>` block.
