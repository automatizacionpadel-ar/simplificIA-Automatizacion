import React from 'react';

const STEPS = [
  {
    icon: 'visibility',
    title: 'Te mostramos un ejemplo gratis',
    description: 'Vemos tu negocio y te mostramos cómo quedaría tu web o tu tarjeta. Sin compromiso y sin pagar nada.',
  },
  {
    icon: 'rocket_launch',
    title: 'Lo armamos en 5 días',
    description: 'Nos encargamos de todo y lo dejamos funcionando. Vos solo aprobás y empezás a usarlo.',
  },
  {
    icon: 'repeat',
    title: 'Tus clientes vuelven',
    description: 'Empezás a ver quién vuelve, quién canjea y qué te está funcionando de verdad.',
  },
];

export const Process: React.FC = () => {
  return (
    <section id="proceso" className="px-6 py-24 bg-white/50 dark:bg-slate-950/20 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center space-y-4 mb-20">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Cómo funciona</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Simple y sin vueltas</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            Tres pasos para que tu negocio empiece a fidelizar sin complicarte.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 hidden lg:block opacity-20 dark:opacity-40 pointer-events-none text-primary">
            <svg viewBox="0 0 1000 200" className="w-full" aria-hidden="true">
              <path
                d="M 0 100 Q 250 10 500 100 T 1000 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="curved-path"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative z-10">
            {STEPS.map((step, idx) => (
              <div key={step.title} className={`group ${idx === 1 ? 'lg:pt-20' : ''}`}>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-super p-10 shadow-xl shadow-slate-100 dark:shadow-none transition-all duration-500 hover:-translate-y-4 group-hover:border-primary/20">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
                    <span className="material-symbols-outlined text-4xl">{step.icon}</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                      <div className="h-[2px] w-8 bg-primary" /> Paso 0{idx + 1}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{step.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
