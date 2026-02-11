
import React from 'react';

interface AuditStep2Props {
  onBack: () => void;
  onHome: () => void;
}

export const AuditStep2: React.FC<AuditStep2Props> = ({ onBack, onHome }) => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#111827] flex flex-col">
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
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors">Volver al inicio</button>
            <button className="bg-primary hover:bg-primary-dark transition-all text-white px-6 py-2.5 rounded-full font-bold text-sm tracking-wide">
              Ayuda
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-12 md:py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                Auditoría Gratuita
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                Diseñemos tu estrategia de <span className="text-primary">automatización.</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                Reserva una sesión de 30 minutos con un experto para transformar la operativa de tu PyME.
              </p>
            </div>

            <div className="flex items-center gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-4xl">account_circle</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">David Sánchez</h4>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Consultor de Automatización</p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Qué esperar de esta auditoría:</h3>
              <ul className="space-y-4">
                {[
                  { t: '1. Análisis de cuellos de botella', d: 'Identificamos los procesos manuales que más tiempo consumen en tu equipo.' },
                  { t: '2. Propuesta de arquitectura IA', d: 'Esbozamos el ecosistema tecnológico ideal para tu volumen de negocio.' },
                  { t: '3. Estimación de ROI', d: 'Calculamos el ahorro potencial en horas y costes operativos para tu primer trimestre.' }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{item.t}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 flex items-center gap-2 text-slate-400 text-sm italic">
              <span className="material-symbols-outlined text-[18px]">videocam</span>
              Videollamada vía Google Meet / Zoom
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">calendar_month</span>
                  <h3 className="font-bold text-slate-900 dark:text-white">Octubre 2024</h3>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <button className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 3 }).map((_, i) => <div key={`empty-${i}`} className="h-14 lg:h-20"></div>)}
                  {[1, 2, 3, 4, 5].map(d => <div key={d} className="h-14 lg:h-20 flex items-center justify-center font-bold text-slate-400 opacity-30">{d}</div>)}
                  {[6, 7, 8].map(d => (
                    <button key={d} className="h-14 lg:h-20 rounded-2xl border-2 border-primary/20 bg-primary/5 text-primary flex items-center justify-center font-bold hover:bg-primary hover:text-white transition-all">{d}</button>
                  ))}
                  <button className="h-14 lg:h-20 rounded-2xl border-2 border-primary text-white bg-primary flex flex-col items-center justify-center font-bold shadow-lg shadow-primary/20">
                    <span>9</span>
                    <span className="text-[10px] opacity-80 uppercase tracking-tighter">Hoy</span>
                  </button>
                  {[10, 13, 14, 15, 16, 17, 20].map(d => (
                    <button key={d} className="h-14 lg:h-20 rounded-2xl border-2 border-primary/20 bg-primary/5 text-primary flex items-center justify-center font-bold hover:bg-primary hover:text-white transition-all">{d}</button>
                  ))}
                  {[11, 12, 18, 19].map(d => <div key={d} className="h-14 lg:h-20 flex items-center justify-center font-bold text-slate-400 opacity-30">{d}</div>)}
                </div>

                <div className="mt-12 space-y-6">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                    Horarios disponibles para el Miércoles 9:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['09:00 AM', '10:30 AM', '11:00 AM', '02:30 PM', '04:00 PM'].map((time) => (
                      <button key={time} className={`py-3 px-4 rounded-xl border font-bold transition-all ${time === '10:30 AM' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary'}`}>
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    <span className="material-symbols-outlined text-[18px]">public</span>
                    Zona horaria: Madrid (GMT+2)
                  </div>
                  <button className="w-full sm:w-auto bg-primary hover:bg-primary-dark transition-all text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
                    Confirmar cita
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-slate-100 dark:border-white/5 py-12 px-6 bg-white dark:bg-slate-900 mt-auto">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-slate-400 font-medium">© 2024 SimplificIA. Todos los derechos reservados.</div>
          <div className="flex gap-8">
            <a className="text-xs text-slate-500 hover:text-primary font-bold uppercase tracking-widest" href="#">Privacidad</a>
            <a className="text-xs text-slate-500 hover:text-primary font-bold uppercase tracking-widest" href="#">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
