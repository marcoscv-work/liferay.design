# Lexicon Docs Sync — Figma plugin (proof of concept)

A proof of concept for letting **non-technical users refresh the Lexicon docs
straight from Figma**, instead of running the Node import scripts from a
terminal.

## Why a plugin

A plugin runs inside Figma with the designer's session, so it reads the data
the docs need **natively** — and crucially, it can read **design variables
without a REST token or an Enterprise plan**, which is exactly what forces the
current token extraction through the desktop MCP. It also reads component-set
variants and can export images.

This PoC does the **extract + preview** half: it shows the JSON it would
produce. It does **not** yet write to the repo — that next step is a GitHub App
/ serverless endpoint that turns this JSON into a pull request, after which
Netlify rebuilds.

## What it extracts

- **Tokens** — every local variable as `"Group/name": value` (colors → hex,
  numbers → value), grouped for display. Run it in the **Lexicon Foundations**
  file to see the full token set.
- **Component variants** — every component set on the current page with its
  variant axes and count, parsed from the `Prop=Value` names. Run it on a
  **Lexicon Components** page to see them.
- A **Copy JSON** button with the combined result (the same shape the docs data
  files use).

## Try it

1. Open the **Figma desktop app** and the Lexicon Foundations (or Components) file.
2. Menu → **Plugins → Development → Import plugin from manifest…**
3. Pick `figma-plugin/manifest.json` from this repo.
4. Run **Plugins → Development → Lexicon Docs Sync (PoC)**.
5. Click **Extract from this file** → review the grouped summary + JSON, **Copy JSON**.

## Files

| File | Role |
|---|---|
| `manifest.json` | plugin metadata (no network access in the PoC) |
| `code.js` | sandbox code — reads variables / component sets via the Figma API |
| `ui.html` | the panel UI — runs Extract, renders the preview + Copy JSON |

## Next step (not in this PoC)

Add `networkAccess.allowedDomains` + a "Sync to docs" button that POSTs the JSON
to a small **GitHub App / serverless** endpoint, which commits the generated
`src/data/figma-components/*.json`, `src/data/figma-foundations/*.json` and the
exported images on a branch and opens a **PR** (so changes are reviewed before
they hit the public site). The export images would use `node.exportAsync()`.
