
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-white/5 pt-20 pb-10 px-6 transition-colors">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-24">
        <div className="space-y-6">
           <div className="flex items-center gap-2">
            <div className="flex items-center text-4xl sm:text-5xl tracking-tighter font-inter ">
              <img src="/img/logo.png" alt="SimplificIA" />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
            Empoderando a las pequeñas empresas a través de automatización inteligente desde 2024.
          </p>
        </div>

        <div className="space-y-6">
          <h5 className="font-bold text-slate-900 dark:text-white text-[10px] uppercase tracking-[0.2em]">Compañía</h5>
          <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            <li><a href="#" className="hover:text-primary transition-colors">Sobre nosotros</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Privacidad</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h5 className="font-bold text-slate-900 dark:text-white text-[10px] uppercase tracking-[0.2em]">Soporte</h5>
          <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            <li><a href="#" className="hover:text-primary transition-colors">Documentación</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Centro de ayuda</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h5 className="font-bold text-slate-900 dark:text-white text-[10px] uppercase tracking-[0.2em]">Contactanos</h5>
          <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            <li><span className="material-symbols-outlined align-middle">mail</span> info@simplificia.com.ar</li>
            <li><span className="material-symbols-outlined align-middle">phone</span> <a href="https://wa.me/5491133680235" className="hover:text-primary transition-colors">Whatsapp</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto mt-20 pt-10 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
         <span>© 2024 SimplificIA. Todos los derechos reservados.</span>
         <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Instagram</a>
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
         </div>
      </div>
    </footer>
  );
};
