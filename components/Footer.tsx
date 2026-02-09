
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10 px-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-24">
        <div className="space-y-6">
           <div className="flex items-center gap-2">
            <div className="text-primary flex items-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 48 48">
                <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 font-display">SimplificIA</h2>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
            Empoderando a las pequeñas empresas a través de automatización inteligente desde 2025.
          </p>
        </div>

        <div className="space-y-6">
          <h5 className="font-bold text-slate-900 text-[10px] uppercase tracking-[0.2em]">Compañía</h5>
          <ul className="space-y-4 text-sm font-medium text-slate-500">
            <li><a href="#" className="hover:text-primary transition-colors">Sobre nosotros</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Carreras</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Privacidad</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h5 className="font-bold text-slate-900 text-[10px] uppercase tracking-[0.2em]">Soporte</h5>
          <ul className="space-y-4 text-sm font-medium text-slate-500">
            <li><a href="#" className="hover:text-primary transition-colors">Documentación</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Centro de ayuda</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Estado de API</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h5 className="font-bold text-slate-900 text-[10px] uppercase tracking-[0.2em]">Newsletter</h5>
          <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
             <input type="email" placeholder="Tu email" className="bg-transparent border-none focus:ring-0 text-sm w-full px-3" />
             <button className="bg-primary p-2.5 rounded-xl text-white hover:bg-primary-dark transition-colors">
                <span className="material-symbols-outlined text-[18px]">send</span>
             </button>
          </div>
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Suscríbete para recibir consejos de automatización semanales.</p>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
         <span>© 2025 SimplificIA. Todos los derechos reservados.</span>
         <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
         </div>
      </div>
    </footer>
  );
};
