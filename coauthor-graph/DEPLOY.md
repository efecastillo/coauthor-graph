# Deploy to Railway or Render

## Option A — Railway (recommended, free tier)

1. Push this folder to a GitHub repo (public or private).
2. Go to railway.app → New Project → Deploy from GitHub repo.
3. Select your repo — Railway auto-detects Node.js and runs `npm start`.
4. Click the generated URL and share it with conference participants.

No extra configuration needed. The `PORT` env variable is set automatically.

---

## Option B — Render (also free)

1. Push this folder to a GitHub repo.
2. Go to render.com → New → Web Service → connect your repo.
3. Set:
   - **Build command:** `npm install`
   - **Start command:** `node server.js`
4. Free tier spins down after 15 min of inactivity — upgrade to Starter ($7/mo)
   for always-on during the conference, or just open the URL a minute early.

---

## Option C — Run locally (for testing)

```bash
npm install
node server.js
# Open http://localhost:3000
```

---

## How to use at the conference

- Share the URL with all participants.
- Each person clicks **+ Add Me**, types their name, picks a color, and clicks OK.
- To draw a collaboration edge: click **Connect**, then click two nodes.
- Double-click any node to rename it or change its color.
- Right-click an edge to delete it.
- Select one or more nodes/edges and click **Delete Selected** (or press Delete/Backspace).
- **Export PNG** saves a snapshot of the current graph.
- The graph is shared live — everyone sees changes instantly.
