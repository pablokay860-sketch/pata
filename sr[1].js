// api/sr.js — Sportradar CORS Proxy for PataPata Betting
// Deployed on Vercel. Forwards requests server-side so browser CORS is bypassed.
//
// Usage from app:  GET /api/sr?sport=football&path=/schedules/2025-06-06/schedule.json
// Supported sports: football | basketball | rugby | cricket

const SR_BASES = {
  football:   'https://api.sportradar.com/soccer/trial/v4/en',
  basketball: 'https://api.sportradar.com/nba/trial/v8/en',
  rugby:      'https://api.sportradar.com/rugby-union/trial/v3/en',
  cricket:    'https://api.sportradar.com/cricket-t2/trial/v2/en',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  const { sport = 'football', path, key } = req.query;

  // Validate sport
  const base = SR_BASES[sport];
  if (!base) {
    return res.status(400).json({ error: `Unknown sport: ${sport}. Use football|basketball|rugby|cricket` });
  }

  // Validate path
  if (!path) {
    return res.status(400).json({ error: 'Missing path parameter' });
  }

  // Sanitize path — only allow alphanumeric, slashes, hyphens, dots, underscores
  const cleanPath = path.replace(/[^a-zA-Z0-9\/\-\_\.]/g, '');
  if (!cleanPath.startsWith('/')) {
    return res.status(400).json({ error: 'Path must start with /' });
  }

  // Get API key — from query param, or from env var (recommended for production)
  const apiKey = key || process.env.SPORTRADAR_API_KEY;
  if (!apiKey) {
    return res.status(401).json({ error: 'No API key provided. Pass ?key=YOUR_KEY or set SPORTRADAR_API_KEY env var.' });
  }

  const targetUrl = `${base}${cleanPath}?api_key=${apiKey}`;

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PataPata-Proxy/1.0',
      },
    });

    // Forward status + body
    const contentType = upstream.headers.get('content-type') || 'application/json';
    res.setHeader('Content-Type', contentType);

    // Cache successful responses briefly to save quota
    if (upstream.ok) {
      res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    }

    res.status(upstream.status);
    const text = await upstream.text();
    return res.send(text);

  } catch (err) {
    console.error('Proxy fetch error:', err.message);
    return res.status(502).json({ error: 'Upstream fetch failed', detail: err.message });
  }
}
