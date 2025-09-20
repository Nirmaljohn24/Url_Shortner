const API_BASE = import.meta.env.VITE_API_BASE || 'https://url-shortner-chi-ochre.vercel.app/';

export async function createShortUrl(originalUrl) {
  const res = await fetch(`${API_BASE}/api/url/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalUrl })
  });
  return res.json();
}

export async function getStats(code) {
  const res = await fetch(`${API_BASE}/api/url/${code}/stats`);
  return res.json();
}
