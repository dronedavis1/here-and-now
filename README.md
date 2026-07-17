# Here and Now — brand website

Static site for the "Here and Now" wellness brand, built around Fran Chandler's guided journal, *Here and Now: Movement, Breath, and Self-Reflection for Growth and Happiness Within*.

Plain HTML/CSS/JS. No framework, no build step, no npm dependencies. Deploys to Cloudflare Pages by pointing it at this repo with an empty build command and this directory as the output/root.

## File structure

```
/index.html      Home page
/journal.html    The Journal — flagship product detail page
/about.html      About Fran — bio, philosophy, pull quote
/additional.html Additional — Fran's videos, Insight Timer, and newsletter
/css/style.css   Shared stylesheet — all colors/fonts as CSS custom properties
/js/main.js      Shared vanilla JS — mobile nav, scroll-reveal, newsletter stub
/images/         Placeholder asset folder (empty until real imagery is ready)
```

## Brand system

- **Colors** — defined as CSS custom properties at the top of `css/style.css` (`--color-cream`, `--color-text`, `--color-accent`, `--color-sage`, plus small derived tints/shades of those four). Accent orange `#F5821F` is sourced directly from the book's designer, Katie Ryder.
- **Fonts** — Fraunces (display, standing in for "Modern Line" — see TODO below), Merriweather (body/reading copy), Raleway (nav, buttons, labels, UI text). Loaded via Google Fonts in each page's `<head>`.
- **Motion** — gentle fade/slide-up reveals on scroll via `IntersectionObserver`, disabled automatically for `prefers-reduced-motion`.

## Local preview

No build step needed. Open `index.html` directly in a browser, or serve the folder with any static server, e.g.:

```
npx serve .
```

## Before launch

See the consolidated checklist at the end of the build summary (or search the codebase for `TODO` / `PLACEHOLDER`) for everything that needs real content before this goes live — the Amazon URL, real imagery, real testimonials, the newsletter integration, and the actual "Modern Line" font file if Katie Ryder provides one.
