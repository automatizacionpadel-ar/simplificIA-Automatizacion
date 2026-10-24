import React, { useState } from 'react';
import {
  fidelizacionPlans,
  FIDELIZACION_HIGHLIGHT_LABEL,
  BILLING_CYCLES,
  getBillingCycle,
  getPlanBillingPrice,
  formatArs,
  type BillingCycleId,
} from './fidelizacionPlans';

export type PlanSolicitud = 'Inicial' | 'Pro' | 'Empresa';

export interface SolicitudTarjetaData {
  nombre: string;
  email: string;
  empresa: string;
  direccion: string;
  telefono: string;
  rubro: string;
  plan: PlanSolicitud | '';
  billingCycle: BillingCycleId;
}

interface SolicitudTarjetaProps {
  planInicial?: string | null;
  billingCycleInicial?: BillingCycleId | null;
  onBack: () => void;
  onHome: () => void;
}

const RUBROS = [
  'Peluquería / Barbería',
  'Cafetería / Panadería',
  'Gimnasio / Entrenamiento',
  'Cancha de pádel / Fútbol',
  'Centro de estética',
  'Veterinaria / Peluquería canina',
  'Óptica',
  'Lavadero',
  'Gastronomía / Bar',
  'Indumentaria / Comercio minorista',
  'Otro',
];

const isValidPlan = (value?: string | null): value is PlanSolicitud =>
  value === 'Pro' || value === 'Inicial' || value === 'Empresa';

const initialData = (
  planInicial?: string | null,
  billingCycleInicial?: BillingCycleId | null
): SolicitudTarjetaData => ({
  nombre: '',
  email: '',
  empresa: '',
  direccion: '',
  telefono: '',
  rubro: '',
  plan: isValidPlan(planInicial) ? planInicial : '',
  billingCycle: billingCycleInicial ?? 'monthly',
});

const inputClass =
  'w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium text-[15px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all';

const labelClass =
  'block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2';

export const SolicitudTarjeta: React.FC<SolicitudTarjetaProps> = ({
  planInicial,
  billingCycleInicial,
  onBack,
  onHome,
}) => {
  const [form, setForm] = useState<SolicitudTarjetaData>(() => initialData(planInicial, billingCycleInicial));
  const [errors, setErrors] = useState<Partial<Record<keyof SolicitudTarjetaData, string>>>({});
  const [enviado, setEnviado] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [editingSelection, setEditingSelection] = useState(() => !isValidPlan(planInicial));

  const selectedPlan = fidelizacionPlans.find((plan) => plan.name === form.plan);
  const selectedCycle = getBillingCycle(form.billingCycle);
  const selectedPricing =
    selectedPlan?.monthlyPrice !== undefined
      ? getPlanBillingPrice(selectedPlan.monthlyPrice, form.billingCycle)
      : null;

  const set = (field: keyof SolicitudTarjetaData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const setBillingCycle = (billingCycle: BillingCycleId) => {
    setForm((prev) => ({ ...prev, billingCycle }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof SolicitudTarjetaData, string>> = {};
    if (form.nombre.trim().length < 2) next.nombre = 'Contanos tu nombre.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = 'Ingresá un email válido.';
    if (form.empresa.trim().length < 2) next.empresa = 'Contanos el nombre de tu negocio.';
    if (form.direccion.trim().length < 3) next.direccion = 'Necesitamos la dirección del local.';
    const tel = form.telefono.replace(/[^\d+]/g, '');
    if (tel.replace(/\D/g, '').length < 8) next.telefono = 'Revisá el teléfono (solo números, con código de área).';
    if (!form.rubro) next.rubro = 'Elegí el rubro de tu negocio.';
    if (!form.plan) next.plan = 'Elegí un plan.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorEnvio(null);
    if (!validate()) return;

    setEnviando(true);
    try {
      const resp = await fetch('/api/solicitud-tarjeta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          email: form.email.trim(),
          empresa: form.empresa.trim(),
          direccion: form.direccion.trim(),
          telefono: form.telefono.trim(),
          rubro: form.rubro,
          plan: form.plan,
          billingCycle: form.billingCycle,
        }),
      });
      const data = await resp.json().catch(() => null);
      if (!resp.ok || !data?.ok) {
        throw new Error(data?.error || 'No se pudo enviar la solicitud. Probá de nuevo.');
      }
      setEnviado(true);
      setModalAbierto(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorEnvio(err instanceof Error ? err.message : 'No se pudo enviar la solicitud. Probá de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#111827] flex flex-col">
        <main className="flex-1 w-[95%] md:w-[80%] mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
          <div className="bg-white dark:bg-slate-900 rounded-super border border-slate-100 dark:border-white/5 shadow-2xl p-10 md:p-14 space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-5xl">check_circle</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
              ¡Solicitud recibida, {form.nombre.split(' ')[0]}!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
              Gracias por elegir el plan <span className="font-bold text-primary">{form.plan}</span> con pago{' '}
              <span className="font-bold text-primary">{selectedCycle.label.toLowerCase()}</span> para{' '}
              <span className="font-bold text-slate-700 dark:text-slate-200">{form.empresa}</span>.
              Te vamos a contactar al <span className="font-bold">{form.telefono}</span> o a{' '}
              <span className="font-bold">{form.email}</span> para mostrarte cómo quedaría tu tarjeta.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 text-left text-sm space-y-2 text-slate-600 dark:text-slate-300">
              <p><span className="font-bold">Email:</span> {form.email}</p>
              <p><span className="font-bold">Empresa:</span> {form.empresa}</p>
              <p><span className="font-bold">Dirección:</span> {form.direccion}</p>
              <p><span className="font-bold">Rubro:</span> {form.rubro}</p>
              <p><span className="font-bold">Plan:</span> {form.plan}</p>
              <p>
                <span className="font-bold">Forma de pago:</span> {selectedCycle.label}
                {selectedPricing
                  ? ` — ${formatArs(selectedPricing.total)} ${selectedPricing.cycle.periodLabel}`
                  : ' — a cotizar'}
              </p>
              {selectedPricing && selectedPricing.discount > 0 && (
                <p>
                  <span className="font-bold">Descuento por pago adelantado:</span>{' '}
                  {formatArs(selectedPricing.discount)}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <button
                onClick={onBack}
                className="bg-primary hover:bg-primary-dark transition-all text-white px-8 py-4 rounded-2xl font-black text-base shadow-xl shadow-primary/20"
              >
                Volver a fidelización
              </button>
              <button
                onClick={onHome}
                className="border border-slate-200 dark:border-white/15 hover:border-primary hover:text-primary transition-all text-slate-700 dark:text-white px-8 py-4 rounded-2xl font-bold text-base"
              >
                Ir al inicio
              </button>
            </div>
          </div>
        </main>

        {modalAbierto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6"
            onClick={() => setModalAbierto(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="solicitud-modal-title"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-super border border-slate-100 dark:border-white/10 shadow-2xl p-8 md:p-10 text-center space-y-4"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-4xl">support_agent</span>
              </div>
              <h2 id="solicitud-modal-title" className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                ¡Solicitud recibida!
              </h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Alguien de nuestro equipo se va a contactar con vos en breves momentos
                {form.email ? <> a <span className="font-bold text-slate-700 dark:text-slate-200">{form.email}</span></> : null}.
              </p>
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => setModalAbierto(false)}
                  className="w-full bg-primary hover:bg-primary-dark transition-all text-white px-8 py-4 rounded-2xl font-black text-base shadow-xl shadow-primary/20"
                >
                  Entendido
                </button>
                <button
                  onClick={onBack}
                  className="w-full border border-slate-200 dark:border-white/15 hover:border-primary hover:text-primary transition-all text-slate-700 dark:text-white px-8 py-3.5 rounded-2xl font-bold text-sm"
                >
                  Volver a fidelización
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#111827] flex flex-col">
      <main className="flex-1 w-[95%] md:w-[80%] mx-auto px-4 sm:px-6 py-12 md:py-20">
        <button
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Volver
        </button>

        <div className="space-y-4 mb-10 text-center sm:text-left">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-widest border border-primary/10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Solicitud de tarjeta digital
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Pedí tu tarjeta digital
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
            Completá tus datos y te mostramos cómo quedaría la tarjeta de tu comercio. Sin compromiso.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white dark:bg-slate-900 rounded-super border border-slate-100 dark:border-white/5 shadow-2xl p-8 md:p-10 space-y-6"
        >
          <div>
            <label htmlFor="solicitud-nombre" className={labelClass}>Nombre</label>
            <input
              id="solicitud-nombre"
              type="text"
              autoComplete="name"
              placeholder="Ej.: María Gómez"
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              className={inputClass}
              aria-invalid={!!errors.nombre}
            />
            {errors.nombre && <p className="mt-2 text-sm font-semibold text-red-500">{errors.nombre}</p>}
          </div>

          <div>
            <label htmlFor="solicitud-email" className={labelClass}>Email</label>
            <input
              id="solicitud-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="Ej.: maria@cafecentral.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className={inputClass}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="mt-2 text-sm font-semibold text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="solicitud-empresa" className={labelClass}>Empresa</label>
            <input
              id="solicitud-empresa"
              type="text"
              autoComplete="organization"
              placeholder="Ej.: Café Central"
              value={form.empresa}
              onChange={(e) => set('empresa', e.target.value)}
              className={inputClass}
              aria-invalid={!!errors.empresa}
            />
            {errors.empresa && <p className="mt-2 text-sm font-semibold text-red-500">{errors.empresa}</p>}
          </div>

          <div>
            <label htmlFor="solicitud-direccion" className={labelClass}>Dirección</label>
            <input
              id="solicitud-direccion"
              type="text"
              autoComplete="street-address"
              placeholder="Ej.: Av. San Martín 123, Mendoza"
              value={form.direccion}
              onChange={(e) => set('direccion', e.target.value)}
              className={inputClass}
              aria-invalid={!!errors.direccion}
            />
            {errors.direccion && <p className="mt-2 text-sm font-semibold text-red-500">{errors.direccion}</p>}
          </div>

          <div>
            <label htmlFor="solicitud-telefono" className={labelClass}>Teléfono</label>
            <input
              id="solicitud-telefono"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="Ej.: 261 123 4567"
              value={form.telefono}
              onChange={(e) => set('telefono', e.target.value)}
              className={inputClass}
              aria-invalid={!!errors.telefono}
            />
            {errors.telefono && <p className="mt-2 text-sm font-semibold text-red-500">{errors.telefono}</p>}
          </div>

          <div>
            <label htmlFor="solicitud-rubro" className={labelClass}>Rubro</label>
            <select
              id="solicitud-rubro"
              value={form.rubro}
              onChange={(e) => set('rubro', e.target.value)}
              className={`${inputClass} ${form.rubro ? '' : 'text-slate-400 dark:text-slate-500'}`}
              aria-invalid={!!errors.rubro}
            >
              <option value="" disabled>Seleccioná el rubro de tu negocio</option>
              {RUBROS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors.rubro && <p className="mt-2 text-sm font-semibold text-red-500">{errors.rubro}</p>}
          </div>

          {editingSelection || !selectedPlan ? (
            <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
              <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Tu plan</p>
                  <h2 className="mt-1 font-display text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Elegí plan y forma de pago
                  </h2>
                </div>
                {selectedPlan && (
                  <button
                    type="button"
                    onClick={() => setEditingSelection(false)}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:border-primary hover:text-primary dark:border-white/15 dark:text-slate-300"
                  >
                    Listo
                  </button>
                )}
              </div>

              <div
                className="divide-y divide-slate-100 border-y border-slate-100 dark:divide-white/5 dark:border-white/5"
                role="radiogroup"
                aria-label="Plan"
              >
                {fidelizacionPlans.map((plan) => {
                  const selected = form.plan === plan.name;
                  const pricing =
                    plan.monthlyPrice !== undefined
                      ? getPlanBillingPrice(plan.monthlyPrice, form.billingCycle)
                      : null;
                  return (
                    <button
                      key={plan.name}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => set('plan', plan.name)}
                      className={`flex w-full items-center gap-4 px-6 py-4 text-left transition-colors ${
                        selected ? 'bg-primary/[0.06]' : 'hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                    >
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all ${
                          selected
                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[22px]">{plan.icon}</span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="font-display font-extrabold text-slate-900 dark:text-white">
                            {plan.name}
                          </span>
                          {plan.highlighted && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-primary">
                              {FIDELIZACION_HIGHLIGHT_LABEL}
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
                          {plan.description}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block text-sm font-black text-slate-900 dark:text-white">
                          {pricing ? formatArs(pricing.total) : 'A medida'}
                        </span>
                        <span className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                          {pricing ? pricing.cycle.periodLabel : 'Cotización'}
                        </span>
                      </span>
                      <span
                        className={`ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                          selected
                            ? 'border-primary bg-primary text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {selected && <span className="material-symbols-outlined text-[14px]">check</span>}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3 px-6 py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Forma de pago</p>
                  <div
                    className="inline-flex w-full rounded-xl bg-slate-100 p-1 dark:bg-slate-800 sm:w-auto"
                    role="radiogroup"
                    aria-label="Forma de pago"
                  >
                    {BILLING_CYCLES.map((cycle) => {
                      const selected = form.billingCycle === cycle.id;
                      return (
                        <button
                          key={cycle.id}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setBillingCycle(cycle.id)}
                          className={`flex-1 rounded-lg px-4 py-2 text-xs font-bold transition-all sm:flex-none ${
                            selected
                              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                          }`}
                        >
                          {cycle.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {selectedPricing && selectedPricing.discount > 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Con pago {selectedCycle.label.toLowerCase()} ahorrás{' '}
                    <span className="font-bold text-primary">{formatArs(selectedPricing.discount)}</span>.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/[0.09] via-white to-white p-6 shadow-sm dark:from-primary/15 dark:via-slate-900 dark:to-slate-900 md:p-8">
              <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 left-10 h-40 w-40 rounded-full bg-emerald-soft/10 blur-3xl" />
              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/25">
                    <span className="material-symbols-outlined text-[28px]">{selectedPlan.icon}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Plan elegido</p>
                    <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {selectedPlan.name}
                    </h2>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-white/70 px-3 py-1 text-[11px] font-bold text-slate-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                      <span className="material-symbols-outlined text-[15px] text-primary">calendar_month</span>
                      Pago {selectedCycle.label.toLowerCase()} · {selectedCycle.months}{' '}
                      {selectedCycle.months === 1 ? 'mes' : 'meses'}
                    </div>
                  </div>
                </div>
                <div className="md:border-l md:border-primary/15 md:pl-8 md:text-right">
                  <p className="font-display text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    {selectedPricing ? formatArs(selectedPricing.total) : 'A medida'}
                    {selectedPricing && (
                      <span className="ml-1 text-sm font-bold text-slate-400 dark:text-slate-500">
                        {selectedPricing.cycle.periodLabel}
                      </span>
                    )}
                  </p>
                  {selectedPricing && selectedPricing.discount > 0 ? (
                    <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-primary">
                      <span className="material-symbols-outlined text-[15px]">savings</span>
                      Ahorrás {formatArs(selectedPricing.discount)}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs font-semibold text-slate-400 dark:text-slate-500">
                      {selectedPlan.quoteOnly ? 'Se define en la cotización' : 'Facturado mes a mes'}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setEditingSelection(true)}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
                  >
                    <span className="material-symbols-outlined text-[16px]">tune</span>
                    Cambiar plan o pago
                  </button>
                </div>
              </div>
            </div>
          )}
          {errors.plan && <p className="mt-2 text-sm font-semibold text-red-500">{errors.plan}</p>}

          {errorEnvio && (
            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/30 px-5 py-4 text-sm font-semibold text-red-600 dark:text-red-300">
              {errorEnvio}
            </div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="block w-full sm:w-auto sm:ml-auto bg-primary hover:bg-primary-dark transition-all hover:scale-[1.01] active:scale-[0.99] text-white px-8 py-3.5 rounded-2xl font-black text-base shadow-xl shadow-primary/20 disabled:opacity-60 disabled:cursor-wait disabled:hover:scale-100"
          >
            {enviando ? 'Enviando…' : 'Solicitar mi tarjeta'}
          </button>
        </form>
      </main>
    </div>
  );
};
