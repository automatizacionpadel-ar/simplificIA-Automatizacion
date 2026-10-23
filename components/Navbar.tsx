import React from 'react';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onStartAudit: () => void;
  isFidelizacion?: boolean;
  onGoHome: () => void;
  onGoSection: (id: string) => void;
  onGoFidelizacion: () => void;
}

const SECTION_LINKS = [
  { label: 'Servicios', id: 'servicios' },
  { label: 'Webs locales', id: 'webs-locales' },
  { label: 'Proceso', id: 'proceso' },
  { label: 'Beneficios', id: 'beneficios' },
  { label: 'Testimonios', id: 'testimonios' },
];

const linkClass =
  'text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors';

export const Navbar: React.FC<NavbarProps> = ({
  isDarkMode,
  toggleDarkMode,
  onStartAudit,
  isFidelizacion = false,
  onGoHome,
  onGoSection,
  onGoFidelizacion,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 dark:border-white/5 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl px-6 py-4">
      <div className="flex items-center justify-between max-w-[1200px] mx-auto">
        <button onClick={onGoHome} aria-label="Ir al inicio" className="flex items-center gap-2 cursor-pointer">
          <div className="text-primary flex items-center w-40">
            <img src="/img/logo.png" alt="SimplificIA" />
          </div>
        </button>
        <nav className="hidden md:flex items-center gap-8">
          {SECTION_LINKS.map((link) => (
            <a
              key={link.id}
              className={linkClass}
              href={isFidelizacion ? `/#${link.id}` : `#${link.id}`}
              onClick={(e) => {
                if (isFidelizacion) {
                  e.preventDefault();
                  onGoSection(link.id);
                }
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            className={isFidelizacion ? 'text-sm font-semibold text-primary transition-colors' : linkClass}
            href="/fidelizacion"
            aria-current={isFidelizacion ? 'page' : undefined}
            onClick={(e) => {
              e.preventDefault();
              onGoFidelizacion();
            }}
          >
            Fidelización
          </a>
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
            Prueba Gratis
          </button>
        </div>
      </div>
    </header>
  );
};
