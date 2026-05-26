const UPSTASH_URL = 'https://true-piglet-112527.upstash.io';
const UPSTASH_TOKEN = 'gQAAAAAAAbePAAIgcDJkMmQ0ZGYyMmI0NGY0YzNmOWI3ZDU0ZDllN2EyOGNiZA';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action, key, value } = req.body || {};

  try {
    if (action === 'get') {
      const response = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
        headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}` }
      });
      const data = await response.json();
      const result = data.result ? JSON.parse(data.result) : null;
      return res.status(200).json({ result });
    }

    if (action === 'set') {
      await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${UPSTASH_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([JSON.stringify(value)])
      });
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch(err) {
    return res.status(500).json({ error: err.message });
  }
}
