
import React from 'react';

export const SocialProof: React.FC = () => {
  return (
    <section id="testimonios" className="px-6 py-24 max-w-[1200px] mx-auto">
      <div className="text-center space-y-4 mb-20">
        <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Confianza</span>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900">Prueba Social</h2>
        <p className="text-slate-500 max-w-xl mx-auto text-lg">La satisfacción de las PyMEs es el motor de nuestra innovación diaria.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {/* Testimonial 1 */}
        <div className="bg-white p-10 rounded-super border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-all">
          <div className="space-y-6">
            <div className="flex gap-1 text-primary">
              {Array(5).fill(0).map((_, i) => <span key={i} className="material-symbols-outlined fill-[1]">star</span>)}
            </div>
            <p className="text-slate-600 italic text-lg leading-relaxed">
              "SimplificIA transformó nuestra gestión. Antes perdíamos horas en tareas manuales, ahora todo fluye automáticamente y hemos duplicado nuestra eficiencia."
            </p>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">RM</div>
            <div>
              <h4 className="font-bold text-slate-900">Ricardo Martínez</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CEO, Lumina Soft</p>
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
            <p className="text-white/80 text-sm">Más de 50 PyMEs han automatizado sus procesos con éxito junto a nuestro equipo.</p>
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

        {/* Testimonial 2 */}
        <div className="bg-white p-10 rounded-super border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-all">
          <div className="space-y-6">
            <div className="flex gap-1 text-primary">
              {Array(5).fill(0).map((_, i) => <span key={i} className="material-symbols-outlined fill-[1]">star</span>)}
            </div>
            <p className="text-slate-600 italic text-lg leading-relaxed">
              "La implementación fue impecable. Entendieron nuestras necesidades de inmediato y crearon una solución que impactó en nuestra facturación."
            </p>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">EA</div>
            <div>
              <h4 className="font-bold text-slate-900">Elena Arribas</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Directora, Terra Corp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Logos */}
      <div className="py-12 border-y border-slate-100 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
         <div className="flex items-center gap-2 font-display font-bold text-xl text-slate-900"><span className="material-symbols-outlined text-3xl">token</span> Lumina Soft</div>
         <div className="flex items-center gap-2 font-display font-bold text-xl text-slate-900"><span className="material-symbols-outlined text-3xl">eco</span> Terra Corp</div>
         <div className="flex items-center gap-2 font-display font-bold text-xl text-slate-900"><span className="material-symbols-outlined text-3xl">polyline</span> Nexas Systems</div>
         <div className="flex items-center gap-2 font-display font-bold text-xl text-slate-900"><span className="material-symbols-outlined text-3xl">database</span> DataPulse</div>
      </div>

      {/* Satisfaction Banner */}
      <div className="mt-24 max-w-4xl mx-auto bg-emerald-50/80 rounded-super p-8 md:p-12 border border-emerald-100 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0 w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-emerald-100">
          <span className="material-symbols-outlined text-primary text-4xl">verified_user</span>
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
           <h4 className="text-2xl font-black text-slate-900">Garantía de Satisfacción 100%</h4>
           <p className="text-slate-500">Nuestro compromiso es tu éxito. Si en los primeros 30 días no ves una mejora real, ajustamos la estrategia sin coste hasta lograrlo.</p>
        </div>
        <div className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full whitespace-nowrap">
          Sello de Calidad
        </div>
      </div>
    </section>
  );
};
