import React from 'react';
import { buildWhatsAppLink, WHATSAPP_MESSAGES } from './whatsapp';

interface FooterProps {
  onGoFidelizacion: () => void;
  onGoSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onGoFidelizacion, onGoSection }) => {
  const goToSection = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    onGoSection(id);
  };

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-white/5 pt-20 pb-10 px-6 transition-colors">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center text-4xl sm:text-5xl tracking-tighter font-inter ">
              <img src="/img/logo.png" alt="Simplificia" />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
            Tarjetas de fidelización y webs con turnos para negocios locales de Argentina. Sin app, sin cartón y con
            precios claros.
          </p>
        </div>

        <div className="space-y-6">
          <h5 className="font-bold text-slate-900 dark:text-white text-[10px] uppercase tracking-[0.2em]">Productos</h5>
          <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            <li>
              <a
                href="#webs-locales"
                onClick={(event) => goToSection(event, 'webs-locales')}
                className="hover:text-primary transition-colors"
              >
                Webs con turnos
              </a>
            </li>
            <li>
              <a
                href="#servicios"
                onClick={(event) => goToSection(event, 'servicios')}
                className="hover:text-primary transition-colors"
              >
                Para empresas
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h5 className="font-bold text-slate-900 dark:text-white text-[10px] uppercase tracking-[0.2em]">Compañía</h5>
          <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            <li>
              <a
                href="/fidelizacion"
                onClick={(event) => {
                  event.preventDefault();
                  onGoFidelizacion();
                }}
                className="hover:text-primary transition-colors"
              >
                Fidelización
              </a>
            </li>
            <li>
              {/* TODO_PAGINA_PRIVACIDAD: cuando exista la página de privacidad, reemplazar este texto por un enlace a /privacidad. */}
              <span className="cursor-default">Privacidad</span>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h5 className="font-bold text-slate-900 dark:text-white text-[10px] uppercase tracking-[0.2em]">Contactanos</h5>
          <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            <li><span className="material-symbols-outlined align-middle">mail</span> info@simplificia.com.ar</li>
            <li>
              <span className="material-symbols-outlined align-middle">phone</span>{' '}
              <a
                href={buildWhatsAppLink(WHATSAPP_MESSAGES.consulta)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto mt-20 pt-10 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        <span>© {new Date().getFullYear()} SimplificIA. Todos los derechos reservados.</span>
        <div className="flex gap-6">
          <a
            href="https://www.instagram.com/simplificia.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};
