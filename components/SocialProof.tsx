
import React from 'react';

export const SocialProof: React.FC = () => {
  return (
    <section id="testimonios" className="px-6 py-24 max-w-[1200px] mx-auto">
      <div className="text-center space-y-4 mb-20">
        <span className="text-primary font-bold text-xs uppercase tracking-[0.3em] font-display">Impacto Real</span>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white font-display">Resultados Tangibles</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg">Más allá de las promesas, entregamos transformación digital medible.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {/* Testimonial 1 */}
        {/* Impact Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-super border border-slate-100 dark:border-white/5 flex flex-col hover:shadow-xl dark:hover:border-primary/20 transition-all group">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors text-primary group-hover:text-white">
            <span className="material-symbols-outlined text-3xl">support_agent</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-display">Atención Inteligente</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8 flex-1">
            Implementación de agentes de IA para atención al cliente 24/7, reduciendo tiempos de espera a cero.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-white/5">
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">24/7</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Disponibilidad</div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">+40%</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Conversión</div>
            </div>
          </div>
        </div>

        {/* Highlighted Stats Card */}
        <div className="bg-primary p-10 rounded-super text-white flex flex-col justify-center items-center text-center gap-8 shadow-2xl shadow-primary/30 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-4xl">workspace_premium</span>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-black">Experticia Comprobada</h3>
            <p className="text-white/80 text-sm">Más de 10 PyMEs han automatizado sus procesos con éxito junto a nuestro equipo.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20 w-full">
            <div>
              <div className="text-2xl font-black">98%</div>
              <div className="text-[10px] text-white/60 uppercase font-bold tracking-widest">Satisfacción</div>
            </div>
            <div>
              <div className="text-2xl font-black">+10k</div>
              <div className="text-[10px] text-white/60 uppercase font-bold tracking-widest">Horas Ahorradas</div>
            </div>
          </div>
        </div>

        {/* Impact Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-super border border-slate-100 dark:border-white/5 flex flex-col hover:shadow-xl dark:hover:border-primary/20 transition-all group">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors text-primary group-hover:text-white">
            <span className="material-symbols-outlined text-3xl">settings_suggest</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-display">Eficiencia Operativa</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8 flex-1">
            Automatización de flujos de trabajo repetitivos, liberando talento humano para tareas estratégicas.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-white/5">
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">-30%</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Costos Op.</div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">100%</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Digitalización</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Logos 
      <div className="py-12 border-y border-slate-100 dark:border-white/5 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 dark:opacity-60 dark:hover:opacity-100 transition-all">
         <div className="flex items-center gap-2 font-display font-bold text-xl text-slate-900 dark:text-white"><span className="material-symbols-outlined text-3xl">token</span> Lumina Soft</div>
         <div className="flex items-center gap-2 font-display font-bold text-xl text-slate-900 dark:text-white"><span className="material-symbols-outlined text-3xl">eco</span> Terra Corp</div>
         <div className="flex items-center gap-2 font-display font-bold text-xl text-slate-900 dark:text-white"><span className="material-symbols-outlined text-3xl">polyline</span> Nexas Systems</div>
         <div className="flex items-center gap-2 font-display font-bold text-xl text-slate-900 dark:text-white"><span className="material-symbols-outlined text-3xl">database</span> DataPulse</div>
      </div> */}

      {/* Satisfaction Banner */}
      <div className="mt-24 max-w-4xl mx-auto bg-emerald-50/80 dark:bg-emerald-500/10 rounded-super p-8 md:p-12 border border-emerald-100 dark:border-emerald-500/20 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0 w-20 h-20 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center shadow-sm border border-emerald-100 dark:border-emerald-500/20">
          <span className="material-symbols-outlined text-primary text-4xl">verified_user</span>
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
           <h4 className="text-2xl font-black text-slate-900 dark:text-white">Garantía de Satisfacción 100%</h4>
           <p className="text-slate-500 dark:text-slate-400">Nuestro compromiso es tu éxito. Si en los primeros 30 días no ves una mejora real, ajustamos la estrategia sin coste hasta lograrlo.</p>
        </div>
        <div className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full whitespace-nowrap">
          Sello de Calidad
        </div>
      </div>
    </section>
  );
};
