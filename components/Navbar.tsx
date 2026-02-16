
import React from 'react';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onStartAudit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleDarkMode, onStartAudit }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 dark:border-white/5 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl px-6 py-4">
      <div className="flex items-center justify-between max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2">
          <div className="text-primary flex items-center">
            <img src="/img/logo.png" alt="SimplificIA" />
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#servicios">Servicios</a>
          <a className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#proceso">Proceso</a>
          <a className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#beneficios">Beneficios</a>
          <a className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#testimonios">Testimonios</a>
        </nav>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <button onClick={onStartAudit} className="bg-primary hover:bg-primary-dark transition-all text-white px-5 py-2 rounded-full font-bold text-sm">
            Auditoría Gratis
          </button>
        </div>
      </div>
    </header>
  );
};
