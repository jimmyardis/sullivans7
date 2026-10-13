# Fort Sullivan — version 7

Email "version 2" (jimmyardis/sullivans3 — the dated-spine design), revised to the
September 2026 direction: image-led home page, separate history page, the year spine
linking into the history chapters, and the aerial film as the hero.

- `index.html` — generated from version 2's markup by `build_index.py <path-to-sullivans3>`
  (it was then hand-checked; re-running overwrites index.html)
- `history.html`, `style.css`, `site.js` — edit directly
- `build_assets.py <path-to-sullivans3>` — copies the images both pages use and converts
  the camera-original JPGs to web-sized WebP
- `site.js` — `HERO_FILM` at the top: set `mp4: 'hero.mp4'` once the original footage
  arrives, or change `start`/`end` to re-cut the YouTube excerpt
