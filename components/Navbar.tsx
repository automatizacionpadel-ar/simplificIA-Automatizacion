import React, { useState } from 'react';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isFidelizacion?: boolean;
  onGoHome: () => void;
  onGoSection: (id: string) => void;
}

const SECTION_LINKS = [
  { label: 'Fidelización', id: 'fidelizacion' },
  { label: 'Webs con turnos', id: 'webs-locales' },
  { label: 'Cómo funciona', id: 'proceso' },
  { label: 'Por qué elegirnos', id: 'beneficios' },
  { label: 'Para empresas', id: 'servicios' },
];

const linkClass =
  'text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors';

export const Navbar: React.FC<NavbarProps> = ({
  isDarkMode,
  toggleDarkMode,
  isFidelizacion = false,
  onGoHome,
  onGoSection,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSectionClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    setMobileOpen(false);
    onGoSection(id);
  };

  const renderLink = (link: { label: string; id: string }, mobile = false) => {
    const active = isFidelizacion && link.id === 'fidelizacion';
    return (
      <a
        key={link.id}
        className={
          mobile
            ? `rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-primary/5 hover:text-primary'
              }`
            : active
              ? 'text-sm font-semibold text-primary transition-colors'
              : linkClass
        }
        href={`/#${link.id}`}
        onClick={(event) => handleSectionClick(event, link.id)}
      >
        {link.label}
      </a>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 dark:border-white/5 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl px-6 py-4">
      <div className="flex items-center justify-between max-w-[1200px] mx-auto">
        <button onClick={onGoHome} aria-label="Ir al inicio" className="flex items-center gap-2 cursor-pointer">
          <div className="text-primary flex items-center w-40">
            <img src="/img/logo.png" alt="Simplificia" />
          </div>
        </button>
        <nav className="hidden md:flex items-center gap-8">{SECTION_LINKS.map((link) => renderLink(link))}</nav>
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <a
            href="https://fidelizacion.simplificia.com.ar"
            className="hidden sm:inline-flex items-center gap-2 bg-primary hover:bg-primary-dark transition-all text-primary-foreground px-5 py-2 rounded-full font-bold text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            Login
          </a>
          <button
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="md:hidden p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav
          id="mobile-menu"
          className="md:hidden max-w-[1200px] mx-auto mt-4 flex flex-col gap-1 border-t border-slate-100 dark:border-white/5 pt-4"
        >
          {SECTION_LINKS.map((link) => renderLink(link, true))}
          <a
            href="https://fidelizacion.simplificia.com.ar"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground"
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            Login
          </a>
        </nav>
      )}
    </header>
  );
};
