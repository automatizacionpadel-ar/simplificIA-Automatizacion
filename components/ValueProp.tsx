
import React from 'react';

const BENEFITS = [
  { title: 'Ahorro de Costes', desc: 'Reduce hasta un 40% tus gastos operativos eliminando tareas manuales repetitivas.' },
  { title: 'Escalabilidad Real', desc: 'Tu infraestructura crece con tu negocio sin necesidad de contratar personal masivo.' },
  { title: 'Decisiones con Datos', desc: 'Dashboards inteligentes que te muestran qué está pasando en tiempo real.' },
  { title: 'Soporte Continuo', desc: 'Acompañamiento experto para asegurar que tu equipo adopte la tecnología con éxito.' }
];

export const ValueProp: React.FC = () => {
  return (
    <section id="beneficios" className="px-6 py-24 max-w-[1200px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <div className="lg:w-1/3 space-y-6">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Propuesta de Valor</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">¿Por qué las PYMEs nos eligen?</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
            No solo instalamos software; transformamos la cultura operativa de tu empresa con resultados tangibles desde el primer mes.
          </p>
          <div className="pt-4">
             <button className="bg-primary hover:bg-primary-dark transition-all text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20">
                Agenda una Consulta
             </button>
          </div>
        </div>
        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
          {BENEFITS.map((b, i) => (
            <div key={i} className="group p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-4">
                <span className="material-symbols-outlined text-[20px]">check</span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{b.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
