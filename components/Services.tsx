
import React from 'react';

const SERVICE_LIST = [
  {
    icon: 'neurology',
    title: 'Integración IA',
    description: 'Implementamos LLMs avanzados como GPT-4 en tus herramientas internas de trabajo diario.'
  },
  {
    icon: 'groups',
    title: 'Automatización CRM',
    description: 'Sincronización total entre HubSpot, Salesforce y tus bases de datos actuales.'
  },
  {
    icon: 'terminal',
    title: 'APIs a Medida',
    description: 'Conectamos software heredado con aplicaciones SaaS modernas de forma segura.'
  },
  {
    icon: 'smart_toy',
    title: 'Agentes IA 24/7',
    description: 'Chatbots inteligentes que califican leads y cierran citas sin descanso.'
  }
];

export const Services: React.FC = () => {
  return (
    <section id="servicios" className="px-6 py-24 max-w-[1200px] mx-auto">
      <div className="text-center space-y-4 mb-16">
        <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Expertise</span>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Nuestros Servicios</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
          Diseñamos el sistema nervioso digital de tu empresa para que funcione sin fricciones.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICE_LIST.map((service, idx) => (
          <div key={idx} className="glass-card rounded-[2.5rem] p-8 hover:border-primary/40 transition-all duration-300 hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[32px]">{service.icon}</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{service.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
