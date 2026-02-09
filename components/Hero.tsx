
import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="relative px-6 pt-12 pb-20 max-w-[1200px] mx-auto overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full organic-gradient -z-10" />
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-widest border border-primary/10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Automatización Inteligente
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight">
            Automatiza tu Crecimiento. <br />
            <span className="text-primary">Escala tu PyME</span> con IA.
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Revoluciona tus operaciones con soluciones a medida que ahorran tiempo y potencian a tu equipo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button className="w-full sm:w-auto bg-primary hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-95 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
              Auditoría Gratuita
            </button>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-[500px] lg:max-w-none">
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-super shadow-2xl border border-slate-100 dark:border-white/5 p-1 flex flex-col rotate-2 hover:rotate-0 transition-transform duration-700 overflow-hidden">
             <div className="bg-slate-50 dark:bg-slate-800/50 h-8 border-b border-slate-100 dark:border-white/5 flex items-center px-4 gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
             </div>
             <div className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">hub</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-32 bg-slate-100 dark:bg-slate-700 rounded-full" />
                    <div className="h-1.5 w-20 bg-slate-50 dark:bg-slate-800 rounded-full" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 rounded-2xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-1 group">
                    <span className="material-symbols-outlined text-primary">automation</span>
                    <span className="text-[10px] text-primary/60 font-black uppercase tracking-widest">Workflow Activo</span>
                  </div>
                  <div className="h-24 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5" />
                </div>
                <div className="space-y-3 pt-2">
                   <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full" />
                   <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full" />
                   <div className="h-2 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-full" />
                </div>
             </div>
          </div>
          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-200/30 blur-3xl -z-10" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 blur-3xl -z-10" />
        </div>
      </div>
    </section>
  );
};
