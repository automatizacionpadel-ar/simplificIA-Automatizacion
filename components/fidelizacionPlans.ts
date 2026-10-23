export interface FidelizacionPlanFeature {
  label: string;
  comingSoon?: boolean;
  included?: boolean;
}

export interface FidelizacionPlan {
  name: string;
  price?: string;
  period?: string;
  quoteOnly?: boolean;
  description: string;
  icon: string;
  highlighted: boolean;
  ctaLabel: string;
  features: FidelizacionPlanFeature[];
}

// Precios definidos con el dueño del proyecto (ARS, por mes).
// Para cambiar precios o nombres, editar solo este archivo.
export const fidelizacionPlans: FidelizacionPlan[] = [
  {
    name: 'Inicial',
    price: 'ARS 30.000',
    period: '/ mes',
    description: 'Para arrancar a fidelizar sin vueltas.',
    icon: 'loyalty',
    highlighted: false,
    ctaLabel: 'Quiero el plan Inicial',
    features: [
      { label: 'Tarjeta de sellos y/o puntos digital' },
      { label: 'Personalización con tu logo y colores' },
      { label: 'Código QR descargable para tu local' },
      { label: 'Escaneo de tarjetas desde el celular' },
      { label: 'Base de clientes' },
      { label: 'Estadísticas básicas' },
    ],
  },
  {
    name: 'Pro',
    price: 'ARS 55.000',
    period: '/ mes',
    description: 'Para locales que quieren ir más a fondo.',
    icon: 'workspace_premium',
    highlighted: true,
    ctaLabel: 'Quiero el plan Pro',
    features: [
      { label: 'Todo lo del plan Inicial' },
      { label: 'Más de un programa de fidelización activo' },
      { label: 'Tarjetas de cupones', comingSoon: true },
      { label: 'Notificaciones push a tus clientes', comingSoon: true },
      { label: 'Recordatorios automáticos para pedir reseñas en Google', comingSoon: true },
      { label: 'Soporte prioritario' },
    ],
  },
  {
    name: 'Empresa',
    quoteOnly: true,
    description: 'Para marcas con varias sucursales que quieren fidelizar en todas.',
    icon: 'storefront',
    highlighted: false,
    ctaLabel: 'Cotizar plan Empresa',
    features: [
      { label: 'Tarjetas por sucursal, una para cada local' },
      { label: 'Un programa de fidelización por sucursal' },
      { label: 'Panel centralizado con métricas por local' },
      { label: 'Personalización con el logo y los colores de cada sucursal' },
      { label: 'Alta de nuevas sucursales cuando quieras' },
      { label: 'Soporte dedicado' },
    ],
  },
];

export const FIDELIZACION_HIGHLIGHT_LABEL = 'Más elegido';
