export interface FidelizacionPlanFeature {
  label: string;
  comingSoon?: boolean;
  included?: boolean;
}

export interface FidelizacionPlan {
  name: string;
  monthlyPrice?: number;
  price?: string;
  period?: string;
  quoteOnly?: boolean;
  description: string;
  icon: string;
  highlighted: boolean;
  ctaLabel: string;
  features: FidelizacionPlanFeature[];
}

export type BillingCycleId = 'monthly' | 'semestral' | 'annual';

export interface BillingCycle {
  id: BillingCycleId;
  label: string;
  months: number;
  discountMonths: number;
  periodLabel: string;
}

export interface PlanBillingPrice {
  cycle: BillingCycle;
  total: number;
  monthlyEquivalent: number;
  discount: number;
  savingsMonths: number;
}

export const formatArs = (value: number): string =>
  `ARS ${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(value)}`;

export const BILLING_CYCLES: BillingCycle[] = [
  { id: 'monthly', label: 'Mensual', months: 1, discountMonths: 0, periodLabel: '/ mes' },
  { id: 'semestral', label: 'Semestral', months: 6, discountMonths: 1, periodLabel: '/ semestre' },
  { id: 'annual', label: 'Anual', months: 12, discountMonths: 2, periodLabel: '/ año' },
];

export const getBillingCycle = (cycleId: BillingCycleId): BillingCycle =>
  BILLING_CYCLES.find((item) => item.id === cycleId) ?? BILLING_CYCLES[0];

export const getPlanBillingPrice = (monthlyPrice: number, cycleId: BillingCycleId): PlanBillingPrice => {
  const cycle = getBillingCycle(cycleId);
  const billedMonths = cycle.months - cycle.discountMonths;
  const total = monthlyPrice * billedMonths;

  return {
    cycle,
    total,
    monthlyEquivalent: total / cycle.months,
    discount: monthlyPrice * cycle.discountMonths,
    savingsMonths: cycle.discountMonths,
  };
};

// Precios definidos con el dueño del proyecto (ARS, por mes).
// Para cambiar precios o nombres, editar solo este archivo.
const planDefinitions: FidelizacionPlan[] = [
  {
    name: 'Inicial',
    monthlyPrice: 30000,
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
    monthlyPrice: 55000,
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

export const fidelizacionPlans: FidelizacionPlan[] = planDefinitions.map((plan) => ({
  ...plan,
  price: plan.monthlyPrice !== undefined ? formatArs(plan.monthlyPrice) : undefined,
  period: plan.monthlyPrice !== undefined ? '/ mes' : undefined,
}));

export const FIDELIZACION_HIGHLIGHT_LABEL = 'Más elegido';
