# arm.ag

Personal site of Armağan Amcalar. Static, built with [Astro](https://astro.build).

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Content

Everything is Markdown under `src/content/`:

- `talks/` — one file per talk, workshop or conversation. Frontmatter: `title`, `event`, `date`, `lang` (`en`/`tr`), `kind` (`talk`/`workshop`/`conversation`), optional `cover`, `video` (YouTube id), `slides`, `code`. The body follows the same shape on every page: abstract, then `## Slides`, `## Video`, `## Code`.
- `articles/` — essays.
- `projects/` — open source write-ups; `order` sets the listing order.
- `pages/academics.md` — the academic work page.

The About, Coyotiv, Mentoring and home pages are in `src/pages/`.

## Migration from Medium

`medium-export/export.json` is the archive of the old Medium publication. `scripts/import-medium.mjs` converts it into the Markdown above and writes `src/data/redirects.json`, which keeps every old Medium URL working as a redirect. `scripts/add-talks.mjs` holds the talks that were never on Medium. Both scripts are only needed if the import has to be repeated; re-running the import overwrites the imported files.
