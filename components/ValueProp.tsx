import React from 'react';
import { buildWhatsAppLink, WHATSAPP_MESSAGES } from './whatsapp';

const FACTS = [
  {
    icon: 'schedule',
    value: '5 días',
    label: 'de la confirmación a la entrega',
    description: 'Te lo dejamos funcionando en menos de una semana.',
  },
  {
    icon: 'visibility',
    value: 'Ejemplo gratis',
    label: 'antes de que pagues',
    description: 'Te mostramos cómo quedaría tu web o tu tarjeta para que decidas tranquilo.',
  },
  {
    icon: 'payments',
    value: 'Precios claros',
    label: 'sin sorpresas',
    description: 'Pago único de setup. Sabés cuánto pagás desde el primer día.',
  },
];

export const ValueProp: React.FC = () => {
  return (
    <section id="beneficios" className="px-6 py-24 max-w-[1200px] mx-auto scroll-mt-20">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <div className="lg:w-1/3 space-y-6">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Por qué elegirnos</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
            Hechos claros, sin promesas raras.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
            No te vamos a vender cifras inventadas. Esto es lo que controlamos y cumplimos en cada trabajo.
          </p>
          <div className="pt-4">
            <a
              href={buildWhatsAppLink(WHATSAPP_MESSAGES.consulta)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex bg-primary hover:bg-primary-dark transition-all text-primary-foreground px-8 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20"
            >
              Hablemos por WhatsApp
            </a>
          </div>
        </div>
        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {FACTS.map((fact) => (
            <div
              key={fact.value}
              className="group p-8 bg-white dark:bg-primary/10 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-4">
                <span className="material-symbols-outlined text-[20px]">{fact.icon}</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">{fact.value}</div>
              <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-3">{fact.label}</div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{fact.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* TODO_TESTIMONIOS: cuando haya testimonios reales, sumar una sección acá y volver a agregar el link en el menú. */}
    </section>
  );
};
