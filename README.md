# Smart Dustbin Simulation

Full-stack Smart Dustbin monitor with real-time WebSocket updates, animated dustbin visual, and a polished light/dark theme.

## Local Development

```bash
npm ci
npm run dev
```

- App serves API and client at `http://localhost:5000`
- If `DATABASE_URL` is not set, it runs in memory-only mode for dev

## Build

```bash
npm run build
npm start
```

- Client is built to `dist/public`
- Server bundle is in `dist/index.js`

## Deploy to Render (1-click Docker)

This repo includes a `Dockerfile` and `render.yaml`.

1. Push this repo to GitHub
2. On Render.com, create a new Web Service → “Build & deploy from a Git repository”
3. Choose this repo; Render will detect the Dockerfile
4. Set environment variables as needed (e.g., `DATABASE_URL`, optional)
5. Deploy. Service listens on `$PORT` (default 5000)

## Deploy with Docker (any host)

```bash
# Build image
docker build -t smart-dustbin-sim .

# Run container
docker run -p 5000:5000 -e NODE_ENV=production --name smart-dustbin smart-dustbin-sim
```

Now open `http://localhost:5000`.

## GitHub Actions CI

- On pushes/PRs to `main`, the workflow builds and runs type-checks.

## Environment Variables

- `PORT` (optional): server port (default `5000`)
- `HOST` (optional): host binding (default `localhost` on Windows, `0.0.0.0` elsewhere)
- `DATABASE_URL` (optional): PostgreSQL URL for Drizzle/Neon; if unset, app runs in memory mode

## Notes

- Theme toggle is in the header; supports Light/Dark/System with persistence.
- If you see Tailwind ambiguity for `duration-[2000ms]`, replace with a standard duration utility.
