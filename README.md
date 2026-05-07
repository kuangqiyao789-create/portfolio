# AIGC Portfolio Interaction Build

Fresh working directory for the current task.

## Run

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173` from this directory.

## Deploy

This is a static site. Push this directory to a GitHub repository on the `main` branch.
The included GitHub Actions workflow in `.github/workflows/pages.yml` deploys the root
of the repository to GitHub Pages.

After pushing, open the repository on GitHub and set **Settings → Pages → Build and
deployment → Source** to **GitHub Actions** if it is not selected automatically.

## Structure

- `data/figma-scenes.json` is the Figma-derived JSON scene source used by the frontend renderer.
- `index.html` contains empty view roots; static layers are generated from JSON.
- `src/main.js` renders JSON layers, then owns view switching, focus management, screen-reader announcements, hotspots, and video autoplay control.
- `src/styles.css` owns transition timing, reduced-motion removal, and responsive scaling.
- `assets/videos/` contains the supplied video assets. Videos are muted, looped, and only play while visible in the active view.
- Vector charts/icons are rendered from Figma JSON `fillGeometry` / `strokeGeometry` as SVG paths.

Large original videos were compressed for GitHub deployment. The local originals are
backed up outside the repository at:

`/Users/bytedance/Documents/New project/fresh_figma_interaction_video_originals_20260508/`

## JSON Refresh

When the Figma JSON needs to be regenerated:

```bash
cd ..
./scripts/prepare-figma-images.sh
node ./scripts/figma-json-to-scenes.mjs
```

The current `data/figma-scenes.json` was generated from the user-supplied full Figma REST JSON files copied into `analysis/figma-json/`.
