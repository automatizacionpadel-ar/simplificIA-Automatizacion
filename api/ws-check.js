export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { telefono } = req.body;
  if (!telefono) return res.status(400).json({ error: 'Falta telefono' });

  let tel = String(telefono).replace(/\D/g, '');
  if (tel.length === 10) tel = '549' + tel;

  try {
    const response = await fetch('http://76.13.127.2:3001/client/isRegisteredUser/default', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.WWEBJS_API_KEY
      },
      body: JSON.stringify({ number: tel }),
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'Error consultando wwebjs' });
    }

    const data = await response.json();
    res.status(200).json({ hasWhatsapp: data.result === true, telefono: tel });
  } catch (err) {
    res.status(502).json({ error: err.message || 'Error de red' });
  }
}
