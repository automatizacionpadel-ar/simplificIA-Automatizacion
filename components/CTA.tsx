import React from 'react';
import { buildWhatsAppLink, WHATSAPP_MESSAGES } from './whatsapp';

export const CTA: React.FC = () => {
  return (
    <section className="px-6 py-24 max-w-[1200px] mx-auto">
      <div className="relative bg-slate-900 rounded-[3rem] p-12 md:p-24 overflow-hidden text-center flex flex-col items-center gap-10 shadow-2xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 blur-[100px] -z-0 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] -z-0 translate-x-1/4 translate-y-1/4" />

        <div className="space-y-6 relative z-10">
          <h2 className="text-white text-4xl md:text-6xl font-black max-w-2xl leading-tight">
            ¿Querés que tus clientes vuelvan?
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto">
            Escribinos y te mostramos cómo quedaría tu tarjeta o tu web, sin compromiso.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 w-full justify-center relative z-10">
          <a
            href={buildWhatsAppLink(WHATSAPP_MESSAGES.fidelizacion)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary-dark transition-all hover:scale-105 active:scale-95 text-primary-foreground px-12 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-primary/30"
          >
            Probala gratis
          </a>
        </div>
      </div>
    </section>
  );
};
