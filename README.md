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

## Note on canonical URLs

`build-pages.mjs` writes a canonical tag pointing at the original host:

```
https://archcell-atelier.aunabbas572.chatgpt.site
```

Update the `origin` constant in `build-pages.mjs` and rebuild before publishing to a
different domain.
