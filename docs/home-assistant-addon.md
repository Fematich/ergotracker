# Home Assistant add-on: Ergotracker

This add-on packages the React UI together with a small Express + SQLite API so you can run the tracker entirely inside Home Assistant with ingress.

## What the add-on does
- Serves the built UI on port `8099` (ingress enabled).
- Stores data in a local SQLite database at `/data/ergotracker/ergotracker.db`.
- Uses a per-browser/device ID (stored in localStorage) to keep progress separate across clients.

## Files to care about
- `home-assistant-addon/config.yaml` – add-on metadata.
- `home-assistant-addon/Dockerfile` – builds the UI then ships a Node runtime with SQLite.
- `home-assistant-addon/rootfs/` – s6 init + data directory setup scripts.
- `server/index.js` – Express API + static file server (used both locally and in the add-on).

## Building/installing in Home Assistant
1) Copy the `home-assistant-addon` folder to your Home Assistant host add-ons directory (e.g. `/addons/ergotracker`).
2) In the add-on, ensure the full project contents are present (the Docker build copies the root of this repo).
3) In Home Assistant UI: **Settings → Add-ons → Add-on Store → ⋮ → Repositories → Add** and point to your Git repo or local dev add-on path.
4) Install the `Ergotracker` add-on, start it, and enable ingress. The UI will be available via the sidebar; direct access is on port `8099` if you expose it.

## Local testing (outside HA)
```bash
# Terminal 1: start the API with SQLite persistence in ./data
npm run api

# Terminal 2: start Vite dev server (proxies /api to the API above)
npm run dev
```

- Build the production bundle + API: `npm run build` then `npm start` (serves `dist/` and API on port `8099`).
- Environment variables:
  - `PORT` (default `8099`)
  - `DATABASE_PATH` (default `./data/ergotracker.db`)
  - `VITE_API_BASE_URL` (frontend). Dev defaults to `/api`; production defaults to relative `api` for ingress.
