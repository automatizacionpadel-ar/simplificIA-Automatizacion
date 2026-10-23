
import React from 'react';

interface LocalWebsProps {
  onStartAudit: () => void;
}

const FEATURES = [
  {
    icon: 'storefront',
    title: 'Web de una página',
    description: 'Servicios, precios y botón de WhatsApp directo para que te contacten sin vueltas.'
  },
  {
    icon: 'location_on',
    title: 'Ficha de Google optimizada',
    description: 'Horarios, fotos, categorías y descripción para aparecer mejor en las búsquedas locales.'
  },
  {
    icon: 'calendar_month',
    title: 'Agenda online',
    description: 'Tus clientes reservan solos e integrada a tu Calendario, sin llamadas ni mensajes.'
  }
];

const PLANS = [
  {
    name: 'Plan Base',
    price: 'ARS 120.000',
    featured: false,
    icon: 'language',
    features: ['Web de una página', 'Ficha de Google optimizada', 'Botón de WhatsApp directo']
  },
  {
    name: 'Plan Base + Agenda',
    price: 'ARS 150.000',
    featured: true,
    icon: 'event_available',
    features: ['Todo lo del Plan Base', 'Reserva de turnos online', 'Integrada a tu Calendario']
  }
];

export const LocalWebs: React.FC<LocalWebsProps> = ({ onStartAudit }) => {
  return (
    <section id="webs-locales" className="px-6 py-24 bg-white/50 dark:bg-slate-950/20">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center space-y-4 mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Negocios locales</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Webs con turnos online para negocios locales</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            Para peluquerías, barberías, veterinarias y consultorios que atienden con turno y todavía no tienen presencia online, o la tienen desordenada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="glass-card rounded-[2.5rem] bg-emerald-soft/10 p-8 hover:border-primary/40 transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          {PLANS.map((plan, idx) => (
            <div
              key={idx}
              className={
                plan.featured
                  ? 'bg-primary p-10 rounded-super text-white flex flex-col shadow-2xl shadow-primary/30 relative overflow-hidden group'
                  : 'bg-white dark:bg-slate-900 p-10 rounded-super border border-slate-100 dark:border-white/5 flex flex-col hover:shadow-xl dark:hover:border-primary/20 transition-all group'
              }
            >
              {plan.featured && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />}
              <div className="relative z-10 flex flex-col flex-1">
                <div
                  className={
                    plan.featured
                      ? 'w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6'
                      : 'w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors'
                  }
                >
                  <span className={`material-symbols-outlined text-3xl ${plan.featured ? 'text-white' : ''}`}>{plan.icon}</span>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${plan.featured ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{plan.name}</h3>
                <div className={`text-4xl font-black mb-6 ${plan.featured ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{plan.price}</div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.featured ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                        <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                      </div>
                      <span className={`text-sm font-medium ${plan.featured ? 'text-white/90' : 'text-slate-600 dark:text-slate-400'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onStartAudit}
                  className={
                    plan.featured
                      ? 'w-full bg-white text-primary hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-95 px-8 py-4 rounded-2xl font-black text-lg'
                      : 'w-full bg-primary hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-95 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20'
                  }
                >
                  Pedí tu ejemplo gratis
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-10">
          Setup único. Entrega en 5 días desde la confirmación.
        </p>
      </div>
    </section>
  );
};
