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

  async function intentarEnvio() {
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
      throw new Error(`wwebjs error: ${err}`);
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Error al enviar mensaje');
    }
    return data;
  }

  try {
    let data;
    try {
      data = await intentarEnvio();
    } catch (firstErr) {
      // Reintento único tras 3s (cubre el race condition de getChat en contactos nuevos)
      await new Promise(r => setTimeout(r, 3000));
      data = await intentarEnvio();
    }
    res.status(200).json({ ok: true, data });
  } catch (err) {
    res.status(502).json({ error: err.message || 'Error de red al contactar wwebjs' });
  }
}
