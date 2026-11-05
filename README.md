# Plastika Medved, redesign pitch

Static site (no build step) for Plastika Medved d.o.o., Dragonja vas.

- Pages: `index.html`, `izdelki.html`, `proizvodnja.html`, `o-nas.html`, `kontakt.html`
- Product data: `assets/js/products.js` (76 products, cut-outs in `assets/products/`)
- Motion: GSAP + ScrollTrigger + Lenis, vendored in `assets/js/vendor/`
- Font: Messina Sans (Luzi Type), needs a licence for production
- Generated stills (Higgsfield, Nano Banana 2): `machine`, `mould`, `warehouse`, `granules`, `solar`, `dusk`, `flame` in `assets/img/`

Run locally: `python3 -m http.server 4880` in this folder.

Deployed on Vercel (`plastika-medved-redesign`, AKEO team) behind basic auth via `middleware.js`
(env vars `PITCH_USER` / `PITCH_PASS`) and `X-Robots-Tag: noindex`.
