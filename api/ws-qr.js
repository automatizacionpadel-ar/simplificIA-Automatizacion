export default async function handler(req, res) {
  const response = await fetch('http://76.13.127.2:3001/session/qr/default/image', {
    headers: { 'x-api-key': process.env.WWEBJS_API_KEY }
  });

  if (!response.ok) {
    return res.status(response.status).json({ error: 'QR no disponible aún. Esperá unos segundos.' });
  }

  const buffer = await response.arrayBuffer();
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-store');
  res.send(Buffer.from(buffer));
}
