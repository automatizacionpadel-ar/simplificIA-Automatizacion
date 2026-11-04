import React from 'react';
import { fidelizacionPlans, formatArs, FIDELIZACION_HIGHLIGHT_LABEL } from './fidelizacionPlans';

interface HomeFidelizacionProps {
  onGoFidelizacion: () => void;
  onSolicitar: (plan?: string | null) => void;
}

const CARD_TYPES = [
  {
    icon: 'loyalty',
    title: 'Sellos',
    description: 'Comprá 10, llevate 1 gratis. Sumás un sello por compra y tu cliente vuelve por su premio.',
  },
  {
    icon: 'confirmation_number',
    title: 'Cupones',
    description: 'Descuentos que tus clientes guardan en el celular y tienen a mano cuando pasan por tu local.',
    badge: 'Próximamente',
  },
  {
    icon: 'stars',
    title: 'Puntos',
    description: 'Cada compra suma, cada premio motiva. Juntan puntos por lo que gastan y los canjean cuando quieren.',
  },
];

const BENEFITS = [
  {
    icon: 'wallet',
    title: 'Se guarda en el wallet del celular',
    description: 'No se pierde ni se olvida: tu cliente la tiene siempre a mano.',
  },
  {
    icon: 'phone_iphone',
    title: 'Sin que instalen nada',
    description: 'Tus clientes escanean un QR y listo. No tienen que descargar ninguna app.',
  },
  {
    icon: 'insights',
    title: 'Vos ves quién vuelve',
    description: 'Mirás quién vuelve, quién canjea y quién dejó de venir, sin planillas raras.',
  },
];

// QR de ejemplo: es un placeholder visual, todavía no lleva a ninguna tarjeta real.
const QrPlaceholder: React.FC = () => (
  <svg
    viewBox="0 0 100 100"
    role="img"
    aria-label="Espacio reservado para el QR de la tarjeta demo"
    className="h-40 w-40 rounded-2xl bg-white p-3 shadow-lg"
  >
    <rect width="100" height="100" fill="#ffffff" />
    <g fill="#0B2B26">
      <path d="M10 10h24v24H10V10Zm5 5v14h14V15H15Z" />
      <rect x="17" y="17" width="10" height="10" />
      <path d="M66 10h24v24H66V10Zm5 5v14h14V15H71Z" />
      <rect x="73" y="17" width="10" height="10" />
      <path d="M10 66h24v24H10V66Zm5 5v14h14V71H15Z" />
      <rect x="17" y="73" width="10" height="10" />
      <rect x="44" y="10" width="7" height="7" />
      <rect x="54" y="18" width="7" height="7" />
      <rect x="44" y="28" width="7" height="7" />
      <rect x="54" y="38" width="7" height="7" />
      <rect x="10" y="44" width="7" height="7" />
      <rect x="20" y="54" width="7" height="7" />
      <rect x="30" y="44" width="7" height="7" />
      <rect x="44" y="48" width="7" height="7" />
      <rect x="54" y="58" width="7" height="7" />
      <rect x="64" y="44" width="7" height="7" />
      <rect x="74" y="54" width="7" height="7" />
      <rect x="84" y="44" width="7" height="7" />
      <rect x="44" y="68" width="7" height="7" />
      <rect x="54" y="78" width="7" height="7" />
      <rect x="64" y="68" width="7" height="7" />
      <rect x="74" y="78" width="7" height="7" />
      <rect x="84" y="68" width="7" height="7" />
      <rect x="44" y="88" width="7" height="7" />
      <rect x="64" y="88" width="7" height="7" />
      <rect x="84" y="88" width="7" height="7" />
    </g>
  </svg>
);

const homePlans = fidelizacionPlans.filter((plan) => plan.monthlyPrice !== undefined).slice(0, 2);

export const HomeFidelizacion: React.FC<HomeFidelizacionProps> = ({ onGoFidelizacion, onSolicitar }) => {
  return (
    <section id="fidelizacion" className="px-6 py-24 bg-white/50 dark:bg-slate-950/20 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center space-y-4 mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Fidelización</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
            Que tus clientes vuelvan, sin esfuerzo.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            Una tarjeta digital que se guarda en el celular de tus clientes. Sin app, sin cartón y sin que tengas que
            acordarte de nada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {CARD_TYPES.map((card) => (
            <div
              key={card.title}
              className="glass-card rounded-[2.5rem] bg-emerald-soft/10 p-8 hover:border-primary/40 transition-all duration-300 hover:-translate-y-2 group relative"
            >
              {card.badge && (
                <span className="absolute top-6 right-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                  {card.badge}
                </span>
              )}
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">{card.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{card.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="group p-8 bg-white dark:bg-primary/10 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-4">
                <span className="material-symbols-outlined text-[20px]">{benefit.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{benefit.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="mb-20 overflow-hidden rounded-[2.5rem] bg-emerald-soft/10 p-8 md:p-12 text-slate-900 relative dark:bg-slate-900 dark:text-white">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-shrink-0">
              <QrPlaceholder />
            </div>
            <div className="flex-1 text-center md:text-left space-y-4">
              <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Probala ahora</span>
              <h3 className="text-3xl md:text-4xl font-black leading-tight">Escaneá y mirá cómo la ve tu cliente</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-xl">
                Estamos terminando la demo interactiva. Mientras tanto, escribinos y te mostramos cómo quedaría tu
                tarjeta con el nombre y los colores de tu local.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <span
                  aria-disabled="true"
                  className="w-full sm:w-auto cursor-not-allowed rounded-2xl bg-slate-900/10 px-8 py-4 text-center text-sm font-black uppercase tracking-widest text-slate-400 dark:bg-white/10 dark:text-white/50"
                >
                  Próximamente
                </span>
                <a
                  href="/solicitud-tarjeta"
                  onClick={(event) => {
                    event.preventDefault();
                    onSolicitar();
                  }}
                  className="w-full sm:w-auto rounded-2xl bg-primary px-8 py-4 text-center font-black text-primary-foreground transition-all hover:bg-primary-dark"
                >
                  Quiero ver la mía
                </a>
              </div>
              {/* TODO_URL_DEMO_TARJETA: cuando exista la URL real de la tarjeta demo, reemplazar el botón "Próximamente" por un enlace a esa URL. */}
            </div>
          </div>
        </div>

        <div id="fidelizacion-planes" className="text-center space-y-4 mb-16 scroll-mt-24">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Planes</span>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Elegí tu plan</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            Dos opciones simples para arrancar. Sin hardware especial ni instalaciones raras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          {homePlans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.highlighted
                  ? 'bg-primary p-10 rounded-super text-primary-foreground flex flex-col shadow-2xl shadow-primary/30 relative overflow-hidden group'
                  : 'bg-white dark:bg-slate-900 p-10 rounded-super border border-slate-100 dark:border-white/5 flex flex-col hover:shadow-xl dark:hover:border-primary/20 transition-all group'
              }
            >
              {plan.highlighted && (
                <div className="absolute inset-0 bg-primary-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
              <div className="relative z-10 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div
                    className={
                      plan.highlighted
                        ? 'w-14 h-14 bg-primary-foreground/20 rounded-2xl flex items-center justify-center'
                        : 'w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors'
                    }
                  >
                    <span className={`material-symbols-outlined text-3xl ${plan.highlighted ? 'text-primary-foreground' : ''}`}>
                      {plan.icon}
                    </span>
                  </div>
                  {plan.highlighted && (
                    <span className="bg-primary-foreground text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap">
                      {FIDELIZACION_HIGHLIGHT_LABEL}
                    </span>
                  )}
                </div>
                <h4 className={`text-xl font-bold mb-1 ${plan.highlighted ? 'text-primary-foreground' : 'text-slate-900 dark:text-white'}`}>
                  {plan.name}
                </h4>
                <p className={`text-sm mb-4 ${plan.highlighted ? 'text-primary-foreground/80' : 'text-slate-500 dark:text-slate-400'}`}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  <div className={`flex flex-wrap items-end gap-2 ${plan.highlighted ? 'text-primary-foreground' : 'text-slate-900 dark:text-white'}`}>
                    <span className="text-4xl font-black">{formatArs(plan.monthlyPrice ?? 0)}</span>
                    <span className="text-lg font-bold">/ mes</span>
                  </div>
                  <span
                    className={`block mt-2 text-xs font-semibold ${
                      plan.highlighted ? 'text-primary-foreground/70' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    Facturado mes a mes
                  </span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature.label} className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          plan.highlighted ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary/10 text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                      </div>
                      <span
                        className={`text-sm font-medium ${plan.highlighted ? 'text-primary-foreground/90' : 'text-slate-600 dark:text-slate-400'}`}
                      >
                        {feature.label}
                        {feature.comingSoon && (
                          <span
                            className={`ml-2 inline-block text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                              plan.highlighted
                                ? 'bg-primary-foreground/20 text-primary-foreground'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300'
                            }`}
                          >
                            Próximamente
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/solicitud-tarjeta"
                  onClick={(event) => {
                    event.preventDefault();
                    onSolicitar(plan.name);
                  }}
                  className={
                    plan.highlighted
                      ? 'w-full text-center bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-all hover:scale-[1.02] active:scale-95 px-8 py-4 rounded-2xl font-black text-lg'
                      : 'w-full text-center bg-primary hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-95 text-primary-foreground px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20'
                  }
                >
                  Quiero este plan
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-8">
          Precios en pesos argentinos. Consultanos por pago semestral o anual.
        </p>
        <div className="text-center">
          <button
            onClick={onGoFidelizacion}
            className="text-sm font-bold text-primary hover:text-primary-dark transition-colors"
          >
            Ver todos los detalles de fidelización
          </button>
        </div>
      </div>
    </section>
  );
};
