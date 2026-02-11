
import React from 'react';

interface AuditStep1Props {
  onNext: () => void;
  onHome: () => void;
}

export const AuditStep1: React.FC<AuditStep1Props> = ({ onNext, onHome }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#111827] flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 dark:border-white/5 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center justify-between max-w-[1200px] mx-auto">
          <button onClick={onHome} className="flex items-center gap-2">
            <div className="text-primary flex items-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 48 48">
                <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display ml-2">SimplificIA</h2>
          </button>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Paso 1 de 3</span>
            <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-1/3 transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-12 lg:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
                Proceso de Auditoría <br /><span className="text-primary">Gratuita Inteligente</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
                Diseñemos el futuro de tu PyME en menos de 2 minutos. Selecciona las áreas que deseas optimizar hoy.
              </p>
            </div>

            <div className="space-y-8">
              <h3 className="text-xl font-bold dark:text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</span>
                ¿Qué área deseas automatizar?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button className="flex flex-col text-left p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2.5rem] hover:border-primary transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[32px]">payments</span>
                  </div>
                  <h4 className="text-xl font-bold mb-2 dark:text-white">Ventas</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Generación de leads, CRM y seguimiento de propuestas automático.</p>
                </button>
                <button className="flex flex-col text-left p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2.5rem] hover:border-primary transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[32px]">support_agent</span>
                  </div>
                  <h4 className="text-xl font-bold mb-2 dark:text-white">Atención al Cliente</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Soporte 24/7 con agentes de IA y resolución de dudas comunes.</p>
                </button>
                <button className="flex flex-col text-left p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2.5rem] hover:border-primary transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[32px]">settings_suggest</span>
                  </div>
                  <h4 className="text-xl font-bold mb-2 dark:text-white">Operaciones</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Gestión de inventarios, reportes internos y flujos de trabajo logísticos.</p>
                </button>
              </div>
            </div>

            <div className="pt-12 border-t border-slate-100 dark:border-white/5">
              <h3 className="text-xl font-bold dark:text-white mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center text-sm">2</span>
                Cuéntanos sobre tus herramientas actuales
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['HubSpot', 'Salesforce', 'Airtable', 'Zapier', 'Slack', 'Notion', 'Sheets', 'Otros'].map((tool) => (
                  <div key={tool} className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl hover:border-primary cursor-pointer transition-colors group">
                    <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-700 group-hover:text-primary mb-2">
                      {tool === 'Otros' ? 'add_circle' : 'hub'}
                    </span>
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{tool}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-8">
              <button 
                onClick={onNext}
                className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg hover:shadow-[0_10px_25px_rgba(22,163,74,0.3)] transition-all flex items-center gap-3 group"
              >
                Siguiente Paso
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>

          <aside className="lg:col-span-4 sticky top-32">
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl shadow-emerald-900/5 border border-slate-100 dark:border-white/5 space-y-8">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-white/5">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">analytics</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg dark:text-white">Resultados Esperados</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Estimación Dinámica</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Tiempo Ahorrado Mensual</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-primary">12-15h</span>
                    <span className="text-sm font-bold text-slate-500">/ equipo</span>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Incremento Eficiencia</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">40%</span>
                    <span className="text-primary font-bold">↑</span>
                  </div>
                </div>
              </div>
              <div className="bg-primary/10 p-5 rounded-2xl">
                <p className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-300 italic">
                  "Con base en tu selección, SimplificIA estima que tu retorno de inversión sería visible en los primeros <span className="font-bold">45 días</span>."
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="w-full border-t border-slate-100 dark:border-white/5 py-12 px-6 mt-auto bg-white/50 dark:bg-slate-950/50">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-slate-400 font-medium">© 2024 SimplificIA. Auditoría inteligente protegida.</div>
          <div className="flex gap-8">
            <a className="text-sm text-slate-400 hover:text-primary transition-colors" href="#">Ayuda</a>
            <a className="text-sm text-slate-400 hover:text-primary transition-colors" href="#">Privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
