# H2B

A single-page layout that files three disciplines under one wordmark — the `H`, the `2` and the `B` are the sections.

[![Live demo](https://img.shields.io/badge/demo-h2b.wib.digital-2ea44f)](https://h2b.wib.digital)
[![Hire me on Fiverr](https://img.shields.io/badge/Hire%20me%20on-Fiverr-1DBF73?style=for-the-badge&logo=fiverr&logoColor=white)](https://www.fiverr.com/pablonietop)
![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
![Build step](https://img.shields.io/badge/build%20step-none-lightgrey)

## Description

Three kinds of work — photography, art direction and accountancy — that would look
unfocused in a single grid. The wordmark solves it: each letter becomes a panel, and
each panel carries one discipline.

On screens 1024px and wider the three panels sit side by side and stay collapsed,
showing only their topic list. Moving the pointer across a panel expands it: the topics
give way to the full description and the panel takes roughly half the row. The arrow
button in each panel does the same thing on click, and pins the panel open so it
survives the pointer leaving. `Escape` collapses everything.

Below 1024px there is nothing to expand — every panel shows its full text at once and
the arrow buttons are removed from the page. Below 768px the header nav collapses into
a menu sheet that traps focus, locks background scroll, and closes on `Escape`, on a
link, or on the backdrop.

It is static: one page, no CMS, no project detail pages. The only outbound links are
the repository and wib.digital.

## Tech stack

| Layer | Technology | Role in project |
|---|---|---|
| Markup | HTML5 | `index.html` and `404.html` |
| Styling | CSS3 | Custom properties, flexbox, mobile-first media queries |
| Scripting | JavaScript (ES5 syntax, no modules) | Menu sheet and panel expansion, ~150 lines |
| Typeface | Inter, from Google Fonts | Weights 400/500/700, `font-display: swap` |

No dependencies, no package manager, no build step. The JavaScript is a classic script
rather than an ES module so the page also works when `index.html` is opened straight
from disk.

## Project structure

```
.
├── index.html                  # The three panels
├── 404.html                    # Not-found page, links back home
├── assets/
│   ├── css/
│   │   ├── base.css            # Tokens, reset, typography, utilities
│   │   ├── layout.css          # Page shell, header, panel grid, footer
│   │   └── components.css      # Wordmark, pills, menu sheet, panels
│   ├── js/
│   │   └── main.js             # Menu sheet + panel expansion, no dependencies
│   └── img/
│       ├── content/
│       │   └── architecture-glass-facade.jpg   # Photography panel
│       └── logo/
│           ├── favicon-32.png                  # Browser tab
│           ├── apple-touch-icon.png            # iOS home screen
│           └── h2b-logo.png                    # Open Graph card
├── docs/
│   ├── auditoria.md            # State of the project before the reorganisation
│   └── cambios.md              # Change log, grouped by phase
├── robots.txt
├── sitemap.xml
└── .gitignore
```

## Running it locally

Clone and open `index.html` in a browser. That is enough — everything is relative and
there is nothing to compile.

```bash
git clone https://github.com/pabloWIB/H2B-Portfolio.git
cd H2B-Portfolio
```

To serve it over HTTP instead, so that `404.html` and the absolute canonical URLs behave
the way they will in production:

```bash
npx serve .
```

## Design tokens

Colour, spacing, type and timing all live in `:root` in `assets/css/base.css`. The
palette comes from the three panels themselves:

| Token | Value | Used for |
|---|---|---|
| `--color-ink` | `#111111` | Text, borders, the art direction panel |
| `--color-lime` | `#c3da37` | The accountancy panel |
| `--color-muted` | `#6e6e6e` | Secondary text, the menu icon |
| `--color-surface` | `#ffffff` | Page background, text on dark panels |
| `--color-focus` | `--color-ink` | Focus ring; flipped to white inside dark panels |

Spacing runs on a 4 / 8 / 16 / 24 / 32 / 48 / 64 / 96 scale, and breakpoints are
480 / 768 / 1024 / 1440, all `min-width`.

## Accessibility

- Every panel is a named region, labelled by its own heading.
- Panel expansion is reachable by keyboard through the arrow buttons, which carry
  `aria-expanded` and `aria-controls`.
- The menu sheet is a modal dialog: focus moves into it, the rest of the page is made
  `inert`, and focus returns to the button that opened it.
- All text clears 4.5:1. The photograph carries a scrim so white type over it holds at
  7.4:1 against the brightest pixel behind it.
- Interactive targets are at least 44×44px.
- `prefers-reduced-motion` cuts every transition.

## Deployment

Deployed on Vercel at [h2b.wib.digital](https://h2b.wib.digital). Upload the repository
root as-is: no build command, no output directory, no configuration file.

Every internal path is relative and lowercase, so the site is equally safe on a
case-sensitive host such as nginx on Linux or GitHub Pages.

## Author

**Pablo Nieto Pérez** — [wib.digital](https://wib.digital)
GitHub: [@pabloWIB](https://github.com/pabloWIB)

## Hire me

I build **custom internal tools, CRMs and dashboards** for small teams, and
**conversion-focused websites** for businesses.

- [Custom internal tool, CRM or dashboard](https://www.fiverr.com/pablonietop/build-a-custom-internal-app-for-your-business) — from $45
- [Conversion-focused website](https://www.fiverr.com/pablonietop/convert-your-landing-page-design-to-code) — from $80
- [All my services on Fiverr](https://www.fiverr.com/pablonietop)
- [wib.digital](https://wib.digital)
