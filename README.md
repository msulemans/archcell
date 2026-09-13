# Archcell

Website for **Archcell**, a Lahore-based architecture and interior design practice.

Built with **Astro** as a fully static site: pages render at build time (project pages are
server-rendered from data), and a small amount of vanilla JavaScript enhances the
interactive pieces (menu, catalogue viewer, enquiry form).

> **Design preview.** Projects, drawings and photography are illustrative placeholders.
> The drawings are diagrams, not construction documents.

> **Migration in progress.** See [MIGRATION-PLAN.md](MIGRATION-PLAN.md): content is moving
> into Sanity (studio embedded at `/admin`) and the site deploys to Cloudflare.

## Structure

```
src/
  layouts/BaseLayout.astro     Document shell: head, canonical, header, footer, dialogs
  components/
    SiteHeader.astro           Brand, main nav, mobile menu
    SiteFooter.astro           Footer navigation and fine print
    ProjectCard.astro          Portfolio card (home + collection)
    ProjectDetail.astro        Full project article: story + drawing catalogue
    DrawingDialog.astro        Drawing viewer shell (viewer.js fills it)
    CreditsDialog.astro        Photography credits dialog
  pages/
    index.astro                Homepage
    studio|services|process|drawings|contact|privacy.astro
    404.astro
    projects/index.astro       The project collection
    projects/[slug]/index.astro      Project story
    projects/[slug]/drawings.astro   Drawing catalogue (deep-links to the grid)
  lib/
    data.js                    Projects, drawings, credits (Sanity replaces this)
    drawings.js                Build-time SVG generator for the 18 sheets
    nav.js                     Current-section helper for navigation
  scripts/
    site.js                    Menu, reveals, dialogs, transition, parallax
    viewer.js                  Drawing viewer: open, zoom, next/prev, download
    filters.js                 Portfolio + catalogue filters
    contact.js                 Demo enquiry form state machine
  styles/
    global.css                 Global chrome + design tokens
    interior.css               Interior-page styles
public/assets/                 Photography and logo (served at /assets/…)
```

## Commands

```bash
npm install        # once
npm run dev        # dev server at http://localhost:4321
npm run build      # static build to dist/
npm run preview    # serve the built dist/
```

## Preview locally

The built site uses root-absolute paths (`/assets/...`), so it must be served over HTTP.
Opening `dist/index.html` via `file://` will load unstyled. `npm run preview` (or any static
server pointed at `dist/`) works.

## Routes

| Route | Page |
| --- | --- |
| `/` | Homepage |
| `/projects/` | The project collection (filters) |
| `/projects/<slug>/` | Project story page |
| `/projects/<slug>/drawings/` | Drawing catalogue for that project |
| `/studio/` | The Studio |
| `/services/` | Services |
| `/process/` | Our Process |
| `/drawings/` | The Drawing Room (archive) |
| `/contact/` | Start Your Project |
| `/privacy/` | About This Preview |
| `/404.html` | Not found |
| `/admin` | *(coming in Phase 2)* embedded Sanity Studio |

### Legacy hash links

Old `#project/<id>` links (shared or bookmarked) redirect automatically to the new URLs;
a small inline script in `BaseLayout.astro` handles this.

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
| `--gold-deep` | `#745a30` | **Accent on light surfaces** (at least 4.5:1 on paper) |
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

## Canonical URLs

Canonical tags are derived from `site` in `astro.config.mjs`, which reads the `SITE_URL`
environment variable (falling back to the original preview host). Set `SITE_URL` in the
build environment before publishing to a different domain.

## Website audit

See [audit/AUDIT.md](audit/AUDIT.md) for the September 2026 design and usability findings,
screenshot evidence, fixes and remaining launch requirements. The audit's fixes are
included in this codebase; the Astro port targets the audit-fixed design.
