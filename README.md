# Archcell

Website for **Archcell**, a Lahore-based architecture and interior design practice.

The site is a hand-built static multi-page site: no framework, no bundler, no runtime
dependencies. `dist/` is the deployable output and `pages/` holds the source fragments.

> **Design preview.** Projects, drawings and photography are illustrative placeholders.
> The drawings are diagrams, not construction documents.

## Structure

```
build-pages.mjs    Page generator — injects shared header/footer, writes dist routes
pages/             Source fragments, one per supporting route
  studio.html
  services.html
  process.html
  projects.html
  drawings.html
  contact.html
  privacy.html
  404.html
dist/              Deployable output (generated — do not hand-edit)
  index.html       Homepage (hand-authored, also the template the generator reads)
  <route>/index.html
  404.html
  app.js           Project data, hash routing, drawing viewer
  pages.js         Archive list, enquiry form, active-nav marking
  style.css        Global styles
  pages.css        Interior-page styles
  assets/          Photography, logo, credits
  .openai/hosting.json   Declares `dist` as the static directory
```

## Build

`dist/index.html` is the homepage **and** the template the generator reads. The generator
takes the homepage, swaps in the shared header/footer, and replaces `<main>` with each
fragment from `pages/` to produce the eight routes.

```bash
node build-pages.mjs
```

Expected output:

```
Updated homepage and generated 8 complete supporting pages.
```

The script is idempotent — running it repeatedly produces the same result.

## Preview locally

The HTML uses root-absolute paths (`/style.css`, `/assets/...`), so it must be served over
HTTP. Opening `dist/index.html` via `file://` will load unstyled.

```bash
python3 -m http.server 5500 --bind 127.0.0.1 --directory dist
```

Then open <http://127.0.0.1:5500/>.

## Routes

| Route | Page |
| --- | --- |
| `/` | Homepage |
| `/projects/` | Selected work — also hosts the `#project/<id>` detail views |
| `/studio/` | The Studio |
| `/services/` | Services |
| `/process/` | Our Process |
| `/drawings/` | The Drawing Room |
| `/contact/` | Start Your Project |
| `/privacy/` | About This Preview |
| `/404.html` | Not found |

### Hash routes

Project detail views are client-side routes rendered into `#project-view`:

- `#project/<id>` — project story (`/projects/#project/courtyard-house`)
- `#project/<id>/drawings` — its drawing catalogue (`/projects/#project/courtyard-house/drawings`)

## Design system

All colour and type decisions live as tokens in `style.css` `:root`. Neither stylesheet
contains an ad-hoc hex value — every colour resolves through a token.

### Colour

| Token | Value | Role |
| --- | --- | --- |
| `--ink` | `#141613` | Page background; text on light surfaces |
| `--panel` | `#1c1f1a` | Raised dark surfaces |
| `--paper` | `#f0f0e9` | Light section background |
| `--sheet` | `#e8eadd` | Drawing-sheet paper (matches the generated SVG) |
| `--gold` | `#c8a76a` | **Accent on dark surfaces** |
| `--gold-deep` | `#7d6134` | **Accent on light surfaces** (4.2:1 on paper) |
| `--gold-hover` | `#b3924f` | Solid-button hover |
| `--gold-soft` | `#f5efe0` | Selected/highlighted tint on paper |
| `--muted` | `#a5a89d` | Secondary text on dark |
| `--muted-deep` | `#5f6456` | Secondary text on light |
| `--line` | `rgba(255,255,255,.19)` | Rules on dark |
| `--line-deep` | `#d5d1c2` | Rules on light |
| `--paper-soft` | `#d3d4c8` | Tertiary text on dark |
| `--danger` | `#963c2e` | Form validation errors |

**The accent rule:** `<em>` inside a heading is the brand's signature italic highlight.
It is **always `--gold` on a dark surface and `--gold-deep` on a light surface.** The
deeper tone exists because brand gold only reaches 2.0:1 on paper, which is unreadable.

### Type scale

Section headings use one of three tokens so the whole site shares a single rhythm:

| Token | Value | Used by |
| --- | --- | --- |
| `--h2-section` | `clamp(40px, 4.4vw, 68px)` | Every content-section heading |
| `--h2-item` | `clamp(26px, 2.4vw, 36px)` | Headings that repeat or sit inside a panel |
| `--h2-display` | `clamp(60px, 7.7vw, 120px)` | The single full-bleed statement section |

`clamp()` handles all responsive scaling, so breakpoints no longer override heading sizes.

### Surface rhythm

Interior pages follow one pattern: **dark hero and content, closing on a single light
`--paper` section.** Every page ends on that light note — the FAQ, drawing guide and
studio story all sit on `--paper`.

### Component rules

- `.solid-button` is the only solid CTA: `--gold` fill with `--ink` text.
- Accordions (`.service-item`, `.faq-list`) share a 17px `summary`; only their row
  dividers differ (`.service-item` uses rules, `.faq-list` uses a border).
- `style.css` owns global chrome (header, footer, mobile nav). `pages.css` styles
  interior-page content and never re-declares those global components.

## Note on canonical URLs


`build-pages.mjs` writes a canonical tag pointing at the original host:

```
https://archcell-atelier.aunabbas572.chatgpt.site
```

Update the `origin` constant in `build-pages.mjs` and rebuild before publishing to a
different domain.
