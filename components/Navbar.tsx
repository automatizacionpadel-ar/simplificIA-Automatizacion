
import React from 'react';


export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-xl px-6 py-4">
      <div className="flex items-center justify-between max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2">
          <div className="text-primary flex items-center">
            <img src="/img/logo-blanco.png" alt="SimplificIA" />
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors" href="#servicios">Servicios</a>
          <a className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors" href="#proceso">Proceso</a>
          <a className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors" href="#beneficios">Beneficios</a>
          <a className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors" href="#testimonios">Testimonios</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-slate-100 text-slate-600">
            <span className="material-symbols-outlined text-[20px]">light_mode</span>
          </button>
          <button className="bg-primary hover:bg-primary-dark transition-all text-white px-5 py-2 rounded-full font-bold text-sm">
            Auditoría Gratis
          </button>
        </div>
      </div>
    </header>
  );
};
