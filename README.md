# aenimalabs

Public site for **aenima labs**. Served via GitHub Pages at [aenimalabs.com](https://aenimalabs.com). `www.aenimalabs.com` is an HTTP 301 to that apex. [aenima.io](https://aenima.io) is a client-side redirect to this canonical domain.

## What's here

- `index.html` — the landing page
- `styles.css` — hand-written CSS, no build step
- `main.js` — nav state, mobile menu, current-section highlight, reveal-on-scroll, stardust around the Kodama tree
- `404.html` — the not-found page GitHub Pages serves for unknown paths
- `assets/tree.svg` — the Kodama bonsai (shared with [kodama.house](https://kodama.house)), used as a CSS mask
- `assets/og.png` — 1200×630 link-preview image
- `CNAME` — tells GitHub Pages the custom domain
- `favicon.svg`

## What was here before

The pre-rebrand Rust prototype lives on branch [`archive/anima-scaffold`](https://github.com/aenima-labs/aenima-redirect/tree/archive/anima-scaffold). It was never shipped; kept as a record.

## Deploying

Pushes to `main` are deployed automatically by GitHub Pages.
