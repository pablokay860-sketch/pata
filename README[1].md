# PataPata Sportradar Proxy

A lightweight Vercel serverless proxy that bypasses CORS for Sportradar API calls
from the PataPata Betting app.

## 🚀 Deploy in 2 Minutes

### Step 1 — Get the files
You already have them. This folder (`patapata-proxy/`) is your project.

### Step 2 — Deploy to Vercel

**Option A: Vercel CLI (fastest)**
```bash
npm install -g vercel
cd patapata-proxy
vercel
```
Follow the prompts. When asked "Set up and deploy?" → Yes.
Your URL will look like: `https://patapata-proxy-xyz.vercel.app`

**Option B: Vercel Dashboard (no CLI)**
1. Go to https://vercel.com and sign in (free account)
2. Click "Add New Project" → "Import Git Repository"
   OR drag-and-drop this folder into the deploy box
3. Click Deploy — done in ~30 seconds

### Step 3 — Set your Sportradar key as env var (recommended)
In Vercel dashboard → your project → Settings → Environment Variables:
```
SPORTRADAR_API_KEY = diP6HEgrmTyu2Js90KnlT4B0TRPZSzbCVKdteII5
```
This keeps your key off the URL. If you skip this, the app passes the key as a query param.

### Step 4 — Connect the app
1. Open PataPata Betting → ⚙ Data Source
2. Paste your Vercel URL into the **Vercel Proxy URL** field
3. Tap **🔍 Test** — should say "✅ Proxy online"
4. Done — all Sportradar calls now route through the proxy

---

## 📡 API Reference

### Health check
```
GET /api/health
```

### Sportradar proxy
```
GET /api/sr?sport=football&path=/schedules/2025-06-06/schedule.json
GET /api/sr?sport=football&path=/schedules/live/schedule.json
GET /api/sr?sport=basketball&path=/games/live/schedule.json
GET /api/sr?sport=rugby&path=/schedules/live/schedule.json
GET /api/sr?sport=cricket&path=/schedules/live/schedule.json
```

Sports: `football` | `basketball` | `rugby` | `cricket`

If `SPORTRADAR_API_KEY` env var is set, no `key` param needed.
Otherwise pass `&key=YOUR_KEY`.

---

## 🔒 Security Notes

- The proxy only allows GET requests
- Paths are sanitized (alphanumeric + `/-._ ` only)
- Responses are cached for 30s to protect your API quota
- Set `SPORTRADAR_API_KEY` as an env var rather than hardcoding it

## 💰 Cost
Vercel free tier: 100GB bandwidth/month, unlimited serverless function calls.
More than enough for a betting app — **completely free**.
