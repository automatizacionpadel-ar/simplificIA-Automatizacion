import { Resend } from 'resend';

const TO_EMAIL = process.env.SOLICITUD_TO_EMAIL || 'info@simplificia.com.ar';
// Dominio ya verificado en Resend.
const FROM_EMAIL = process.env.SOLICITUD_FROM_EMAIL || 'SimplificIA <solicitudes@simplificia.com.ar>';

const PLANES_VALIDOS = ['Inicial', 'Pro', 'Empresa'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nombre, email, empresa, direccion, telefono, rubro, plan } = req.body || {};

  if (
    typeof nombre !== 'string' || nombre.trim().length < 2 ||
    typeof email !== 'string' || !EMAIL_RE.test(email.trim()) ||
    typeof empresa !== 'string' || empresa.trim().length < 2 ||
    typeof direccion !== 'string' || direccion.trim().length < 3 ||
    typeof telefono !== 'string' || telefono.replace(/\D/g, '').length < 8 ||
    typeof rubro !== 'string' || rubro.trim().length < 2 ||
    !PLANES_VALIDOS.includes(plan)
  ) {
    return res.status(400).json({ error: 'Faltan campos requeridos o son inválidos' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Falta configurar RESEND_API_KEY en el servidor' });
  }

  const data = {
    nombre: nombre.trim().slice(0, 120),
    email: email.trim().slice(0, 160),
    empresa: empresa.trim().slice(0, 120),
    direccion: direccion.trim().slice(0, 200),
    telefono: telefono.trim().slice(0, 40),
    rubro: rubro.trim().slice(0, 120),
    plan,
  };

  const resend = new Resend(process.env.RESEND_API_KEY);

  const subject = `Nueva solicitud de tarjeta (${data.plan}) — ${data.empresa}`;
  const text =
    `Nueva solicitud de tarjeta digital\n\n` +
    `Nombre: ${data.nombre}\n` +
    `Email: ${data.email}\n` +
    `Empresa: ${data.empresa}\n` +
    `Dirección: ${data.direccion}\n` +
    `Teléfono: ${data.telefono}\n` +
    `Rubro: ${data.rubro}\n` +
    `Plan: ${data.plan}\n`;
  const html = `
    <h2>Nueva solicitud de tarjeta digital</h2>
    <table cellpadding="6" cellspacing="0" style="font-family:sans-serif;font-size:14px">
      <tr><td><strong>Nombre</strong></td><td>${escapeHtml(data.nombre)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(data.email)}</td></tr>
      <tr><td><strong>Empresa</strong></td><td>${escapeHtml(data.empresa)}</td></tr>
      <tr><td><strong>Dirección</strong></td><td>${escapeHtml(data.direccion)}</td></tr>
      <tr><td><strong>Teléfono</strong></td><td>${escapeHtml(data.telefono)}</td></tr>
      <tr><td><strong>Rubro</strong></td><td>${escapeHtml(data.rubro)}</td></tr>
      <tr><td><strong>Plan</strong></td><td>${escapeHtml(data.plan)}</td></tr>
    </table>
  `;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject,
      text,
      html,
    });
    if (error) {
      return res.status(502).json({ error: error.message || 'No se pudo enviar el email' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(502).json({ error: err?.message || 'Error al enviar el email' });
  }
}
