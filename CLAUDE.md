# Liferay Design Website

Public website for Liferay Design (design.liferay.com). Content-driven Gatsby site with articles, handbook, blueprints, Lexicon design system docs, careers, events, and team pages.

## Critical constraints

- **Node 12.x required** (ideally 12.14.1) — will not work on modern Node
- **Gatsby 2.32.13** + **React 16.14.0** — do not assume modern Gatsby/React patterns
- **node-sass 4.14.1** — do not replace with modern Sass without explicit migration task
- **Netlify** deployment, pinned to Node 12
- Stability > modernization. Do not upgrade packages unless migration is the explicit goal

## Local development

```bash
nvm use 12.14.1
npm install
npm run dev      # starts on http://0.0.0.0:7777
```

- `src/utils/generateEnv.js` auto-creates `.env.development` if missing
- Some sections need API keys (Mailchimp, Google APIs, Firebase) — site degrades gracefully without them

## Project structure

- `src/markdown/` — 98% of site content (articles, handbook, blueprints, lexicon, careers, events, team)
- `src/markdown/*.yaml` — data files (Authors, Changelog, Countries, Offices)
- `src/components/` — atomic design: atoms, molecules, organisms, templates
- `src/pages/` — page entry points and yearly sections (2018-2021)
- `src/utils/` — helpers (generateEnv, generateIcons, typography, logRocket)
- `static/` — public assets (images, icons, files, videos, admin)

## How content becomes pages

1. MDX/Markdown files in `src/markdown/{section}/` get slugs via `createFilePath()` with `/markdown/` stripped
2. First slug segment maps to template: `/articles/...` → `src/components/templates/Articles/index.js`
3. Tag pages auto-generated at `/tags/<kebab-case-tag>/`
4. Newsletter pages at `/newsletter/YYYY-MM` (requires MAILCHIMP_KEY)

## Styling

Mixed model — check local area before changing:
- `gatsby-browser.js` imports `theme/global.scss`
- SCSS modules (`.module.scss`) per component
- Theme UI config in `src/gatsby-plugin-theme-ui/`
- Typography in `src/utils/typography.js`

## Icons

SVGs in `static/images/icons/` → auto-generated React map via `npm run icons` → output at `src/components/atoms/Icon/icons.js`. Do not hand-edit generated output.

## Working in this repo

### Content changes
1. Check `src/markdown/` first
2. Then YAML data files
3. Only edit React components if content is hardcoded

### Fixing a page
1. `src/pages/` entry point
2. `src/components/templates/` for the matching template
3. `src/markdown/` for the content
4. Utility code used by that page

### Adding a new content section
- Confirm if it fits an existing slug-to-template convention
- If not: new template in `src/components/templates/`, matching markdown folder, and navigation updates

### Do not
- Upgrade Gatsby, React, Node, or node-sass as part of a small task
- Move content from markdown into React components
- Apply Gatsby 4/5 or React 18 patterns
- Remove odd-looking code without checking if it protects builds in no-key environments
- Hand-edit generated icon files
