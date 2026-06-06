// api/health.js — simple health check
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'ok',
    service: 'PataPata Sportradar Proxy',
    version: '1.0.0',
    sports: ['football', 'basketball', 'rugby', 'cricket'],
    usage: 'GET /api/sr?sport=football&path=/schedules/YYYY-MM-DD/schedule.json&key=YOUR_KEY',
    tip: 'Set SPORTRADAR_API_KEY env var in Vercel to avoid passing key in URL',
    timestamp: new Date().toISOString(),
  });
}
