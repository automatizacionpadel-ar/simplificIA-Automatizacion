
import React from 'react';

export const Process: React.FC = () => {
  return (
    <section id="proceso" className="px-6 py-24 bg-white/50 dark:bg-slate-950/20">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center space-y-4 mb-20">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Metodología</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Nuestro Proceso</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            Un camino claro y estructurado para transformar la operativa de tu negocio.
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Animated curved background line for desktop */}
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 hidden lg:block opacity-20 dark:opacity-40 pointer-events-none">
            <svg viewBox="0 0 1000 200" className="w-full">
              <path 
                d="M 0 100 Q 250 10 500 100 T 1000 100" 
                fill="none" 
                stroke="#16A34A" 
                strokeWidth="4" 
                className="curved-path"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative z-10">
            {/* Step 1 */}
            <div className="group">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-super p-10 shadow-xl shadow-slate-100 dark:shadow-none transition-all duration-500 hover:-translate-y-4 group-hover:border-primary/20">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
                  <span className="material-symbols-outlined text-4xl">search_insights</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                    <div className="h-[2px] w-8 bg-primary" /> Paso 01
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Diagnóstico</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Analizamos tus flujos actuales para identificar cuellos de botella y oportunidades críticas.</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group lg:pt-20">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-super p-10 shadow-xl shadow-slate-100 dark:shadow-none transition-all duration-500 hover:-translate-y-4 group-hover:border-primary/20">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
                  <span className="material-symbols-outlined text-4xl">integration_instructions</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                    <div className="h-[2px] w-8 bg-primary" /> Paso 02
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Implementación</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Desarrollamos e integramos tus nuevos sistemas de IA sin interrumpir tu operativa diaria.</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-super p-10 shadow-xl shadow-slate-100 dark:shadow-none transition-all duration-500 hover:-translate-y-4 group-hover:border-primary/20">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
                  <span className="material-symbols-outlined text-4xl">rocket_launch</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                    <div className="h-[2px] w-8 bg-primary" /> Paso 03
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Optimización</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Monitoreamos el rendimiento y ajustamos los flujos para garantizar un ROI máximo.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
