import React, { useState } from 'react';
import { fidelizacionPlans, FIDELIZACION_HIGHLIGHT_LABEL } from './fidelizacionPlans';

export type PlanSolicitud = 'Inicial' | 'Pro' | 'Empresa';

export interface SolicitudTarjetaData {
  nombre: string;
  empresa: string;
  direccion: string;
  telefono: string;
  rubro: string;
  plan: PlanSolicitud | '';
}

interface SolicitudTarjetaProps {
  planInicial?: string | null;
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

const initialData = (planInicial?: string | null): SolicitudTarjetaData => ({
  nombre: '',
  empresa: '',
  direccion: '',
  telefono: '',
  rubro: '',
  plan: planInicial === 'Pro' || planInicial === 'Inicial' || planInicial === 'Empresa' ? planInicial : '',
});

const inputClass =
  'w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium text-[15px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all';

const labelClass =
  'block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2';

export const SolicitudTarjeta: React.FC<SolicitudTarjetaProps> = ({ planInicial, onBack, onHome }) => {
  const [form, setForm] = useState<SolicitudTarjetaData>(() => initialData(planInicial));
  const [errors, setErrors] = useState<Partial<Record<keyof SolicitudTarjetaData, string>>>({});
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

  const set = (field: keyof SolicitudTarjetaData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof SolicitudTarjetaData, string>> = {};
    if (form.nombre.trim().length < 2) next.nombre = 'Contanos tu nombre.';
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
          empresa: form.empresa.trim(),
          direccion: form.direccion.trim(),
          telefono: form.telefono.trim(),
          rubro: form.rubro,
          plan: form.plan,
        }),
      });
      const data = await resp.json().catch(() => null);
      if (!resp.ok || !data?.ok) {
        throw new Error(data?.error || 'No se pudo enviar la solicitud. Probá de nuevo.');
      }
      setEnviado(true);
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
              Gracias por elegir el plan <span className="font-bold text-primary">{form.plan}</span> para{' '}
              <span className="font-bold text-slate-700 dark:text-slate-200">{form.empresa}</span>.
              Te vamos a contactar al <span className="font-bold">{form.telefono}</span> para mostrarte cómo quedaría tu tarjeta.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 text-left text-sm space-y-2 text-slate-600 dark:text-slate-300">
              <p><span className="font-bold">Empresa:</span> {form.empresa}</p>
              <p><span className="font-bold">Dirección:</span> {form.direccion}</p>
              <p><span className="font-bold">Rubro:</span> {form.rubro}</p>
              <p><span className="font-bold">Plan:</span> {form.plan}</p>
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

          <fieldset>
            <legend className={labelClass}>Plan a elegir</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="radiogroup" aria-label="Plan a elegir">
              {fidelizacionPlans.map((plan) => {
                const selected = form.plan === plan.name;
                return (
                  <label
                    key={plan.name}
                    className={`cursor-pointer rounded-2xl border-2 p-5 flex items-start gap-4 transition-all ${
                      selected
                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                        : 'border-slate-200 dark:border-white/10 hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={plan.name}
                      checked={selected}
                      onChange={() => set('plan', plan.name)}
                      className="mt-1 accent-[#96bd45] w-5 h-5"
                    />
                    <span>
                      <span className="flex items-center gap-2 font-black text-lg text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined text-primary">
                          {plan.icon}
                        </span>
                        {plan.name}
                        {plan.highlighted && (
                          <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                            {FIDELIZACION_HIGHLIGHT_LABEL}
                          </span>
                        )}
                      </span>
                      <span className="block text-base font-black text-primary mt-1">
                        {plan.quoteOnly ? (
                          'Cotización a medida'
                        ) : (
                          <>
                            {plan.price} <span className="text-sm font-bold">{plan.period}</span>
                          </>
                        )}
                      </span>
                      <span className="block text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {plan.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.plan && <p className="mt-2 text-sm font-semibold text-red-500">{errors.plan}</p>}
          </fieldset>

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
