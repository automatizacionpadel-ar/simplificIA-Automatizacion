export default async function handler(req, res) {
  const response = await fetch('http://76.13.127.2:3001/session/status/default', {
    headers: { 'x-api-key': process.env.WWEBJS_API_KEY }
  });

  if (!response.ok) {
    return res.status(200).json({ connected: false, state: 'UNKNOWN' });
  }

  const data = await response.json();
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    connected: data.state === 'CONNECTED',
    state: data.state || 'UNKNOWN'
  });
}
