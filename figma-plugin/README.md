# Lexicon Docs Sync — Figma plugin

Lets a designer push the Lexicon **tokens** from Figma to the docs site **as a
pull request**, with no terminal, no git and no token handling.

```
Designer in Figma → "Sync Foundations → open PR"
   → plugin reads the variables (native API, no REST token)
   → UI POSTs the generated JSON to the figma-sync Netlify function
   → function commits the files on a branch and opens a PR   (GitHub token stays server-side)
   → Netlify builds → merge → live
```

The plugin reads design variables with the Figma API directly, so it needs **no
REST token and no Enterprise plan** (which is what blocks the headless scripts).

## Pieces

| Where | What |
|---|---|
| `figma-plugin/` | the plugin: `manifest.json`, `code.js` (reads variables, builds the files), `ui.html` (settings + Sync button + PR link) |
| `netlify/functions/figma-sync.js` | the endpoint: validates a secret, commits the files, opens a PR. No deps (uses `fetch` + the GitHub API). |

## One-time setup (technical, done once)

**1. Netlify environment variables** (Site settings → Environment variables):

| Var | Value |
|---|---|
| `GITHUB_TOKEN` | a token with `repo` scope (contents + pull requests) on `liferay-design/liferay.design` — ideally a **GitHub App** installation token or a fine-grained PAT |
| `SYNC_SECRET` | any random string; the plugin must send the same value |
| `GITHUB_BASE` | base branch for the PR. **Set to `migration-to-astro`** until the Astro migration is merged (that's where the docs data lives); then `master`. Defaults to `master`. |
| `GITHUB_REPO` | optional, defaults to `liferay-design/liferay.design` |

The function deploys with the site at:
`https://<your-netlify-site>/.netlify/functions/figma-sync`
(on a deploy preview it's `https://<deploy-preview-url>/.netlify/functions/figma-sync`).

**2. Plugin connection** (each designer, once): open the plugin → **Connection**
→ paste the endpoint URL + the `SYNC_SECRET` → **Save connection** (stored in
Figma's `clientStorage`, never committed).

## Use it

1. Figma desktop → open the **Lexicon Foundations** file.
2. **Plugins → Development → Import plugin from manifest…** → `figma-plugin/manifest.json` (first time only).
3. Run the plugin → **↑ Sync Foundations → open PR**.
4. Follow the **review it ↗** link to the PR. Merge it → Netlify deploys.

(**Preview** shows what it will extract without sending anything.)

## Security

- The GitHub token lives only in Netlify env vars — never in the plugin.
- The function rejects requests without the right `SYNC_SECRET`, and only writes
  paths under `astro/src/data/figma-foundations/`, `astro/src/data/figma-components/`
  and `static/images/lexicon/figma/`.
- It always opens a **PR** (never pushes to the base branch), so changes are
  reviewed before they reach the public site.

## Scope & next step

- **Done:** Foundations tokens (colors, typography, spacing, border-radius,
  opacity, shadow) — produces the 6 `figma-foundations/*.json` files.
- **Next:** Figma Components — same flow plus component-set variants and **image
  export** (`node.exportAsync` → committed as base64; the function already
  accepts `contentBase64`). The function is generic, so this is mostly plugin
  work.
