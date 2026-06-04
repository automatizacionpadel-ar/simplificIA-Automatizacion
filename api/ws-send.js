export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { telefono, nombre_empresa, mensaje } = req.body;

  if (!telefono || !nombre_empresa || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  let tel = String(telefono).replace(/\D/g, '');
  if (tel.length === 10) tel = '549' + tel;
  const chatId = tel + '@c.us';

  try {
    const response = await fetch('http://76.13.127.2:3001/client/sendMessage/default', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.WWEBJS_API_KEY
      },
      body: JSON.stringify({ chatId, content: mensaje, contentType: 'string' }),
      signal: AbortSignal.timeout(30000)
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(502).json({ error: `wwebjs error: ${err}` });
    }

    const data = await response.json();
    if (!data.success) {
      return res.status(502).json({ error: data.error || 'Error al enviar mensaje' });
    }
    res.status(200).json({ ok: true, data });
  } catch (err) {
    res.status(502).json({ error: err.message || 'Error de red al contactar wwebjs' });
  }
}
