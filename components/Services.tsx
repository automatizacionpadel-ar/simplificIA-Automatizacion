import React from 'react';
import { buildWhatsAppLink, WHATSAPP_MESSAGES } from './whatsapp';

const SERVICE_LIST = [
  {
    icon: 'chat',
    title: 'Atención automática por WhatsApp',
    description: 'Respondé consultas, turnos y pedidos a toda hora sin dejar a nadie esperando.',
  },
  {
    icon: 'settings_suggest',
    title: 'Tareas repetitivas en piloto automático',
    description: 'Planillas, mails, facturas y reportes que se hacen solos, sin que nadie los cargue a mano.',
  },
  {
    icon: 'hub',
    title: 'Todo conectado',
    description: 'Unimos las herramientas que ya usás para que no tengas que cargar lo mismo dos veces.',
  },
  {
    icon: 'smart_toy',
    title: 'Un asistente que no descansa',
    description: 'Un agente con inteligencia artificial que atiende y agenda mientras vos hacés otra cosa.',
  },
];

export const Services: React.FC = () => {
  return (
    <section id="servicios" className="px-6 py-24 max-w-[1200px] mx-auto scroll-mt-20">
      <div className="text-center space-y-4 mb-16">
        <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Para empresas</span>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
          ¿Tu negocio ya tiene varias sucursales o muchos clientes?
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
          También automatizamos la atención y las tareas repetitivas con inteligencia artificial.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {SERVICE_LIST.map((service, idx) => (
          <div key={idx} className="glass-card rounded-[2.5rem] bg-emerald-soft/10 p-8 hover:border-primary/40 transition-all duration-300 hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[32px]">{service.icon}</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{service.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{service.description}</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <a
          href={buildWhatsAppLink(WHATSAPP_MESSAGES.empresas)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex bg-primary hover:bg-primary-dark transition-all text-primary-foreground px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20"
        >
          Agenda una Consulta
        </a>
      </div>
    </section>
  );
};
