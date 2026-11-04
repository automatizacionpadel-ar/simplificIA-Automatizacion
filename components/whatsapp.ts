export const WHATSAPP_NUMBER = '5491133680235';

export const buildWhatsAppLink = (message: string): string =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const WHATSAPP_MESSAGES = {
  fidelizacion: 'Hola, quiero probar la tarjeta de fidelización',
  ejemploWeb: 'Hola, quiero mi ejemplo gratis de web con turnos',
  empresas: 'Hola, quiero consultar por automatizaciones para mi empresa',
  consulta: 'Hola, quiero hacer una consulta',
} as const;
