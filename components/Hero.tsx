import React from 'react';

const TOTAL_STAMPS = 10;
const FILLED_STAMPS = 9;

interface HeroProps {
  onSolicitar: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSolicitar }) => {
  return (
    <section className="relative px-6 pt-12 pb-20 max-w-[1200px] mx-auto overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full organic-gradient -z-10" />
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-widest border border-primary/10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Fidelización digital
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-emerald-950 dark:text-white leading-[1.05] tracking-tight">
            ¿Tus clientes vienen una vez y <span className="text-primary">no vuelven?</span>
          </h1>
          <p className="text-emerald-800 dark:text-slate-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Armá tu tarjeta de fidelización digital en el celular de tus clientes. Sin app, sin cartoncitos y lista en
            pocos días.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <a
              href="/solicitud-tarjeta"
              onClick={(event) => {
                event.preventDefault();
                onSolicitar();
              }}
              className="w-full sm:w-auto text-center bg-primary hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-95 text-primary-foreground px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20"
            >
              Probala gratis
            </a>
            <a
              href="#webs-locales"
              className="w-full sm:w-auto text-center bg-transparent border border-emerald-200 dark:border-white/15 hover:border-primary hover:text-primary transition-all text-emerald-900 dark:text-white px-10 py-5 rounded-2xl font-bold text-lg"
            >
              Ver webs con turnos
            </a>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-[500px] lg:max-w-none">
          <div
            className="relative z-10 mx-auto w-full max-w-[320px] rotate-2 rounded-[2.75rem] border-[6px] border-primary bg-primary/10 p-2 shadow-2xl transition-transform duration-700 hover:rotate-0 dark:border-slate-950 dark:bg-slate-950 lg:max-w-[340px]"
            role="img"
            aria-label="Maqueta de una tarjeta de fidelización digital dentro de un celular: 9 de 10 sellos completados y la frase Tu 10º corte es gratis"
          >
            <div className="absolute left-1/2 top-3 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-primary dark:bg-slate-900" />
            <div className="overflow-hidden rounded-[2.1rem] bg-primary/10 pt-8 dark:bg-slate-800">
              <div className="px-4 pb-5">
                <div className="relative overflow-hidden rounded-[1.6rem] bg-primary/10 p-5 text-emerald-950 shadow-xl dark:bg-slate-950 dark:text-white">
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-soft/10 blur-2xl" />
                  <div className="relative z-10">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-700 dark:text-white/60">
                        Tarjeta de sellos
                      </span>
                      <span className="material-symbols-outlined text-[20px] text-primary">content_cut</span>
                    </div>
                    <p className="mb-5 text-xl font-black leading-tight text-emerald-950 dark:text-white">Tu 10º corte es gratis</p>
                    <div className="mb-5 grid grid-cols-5 gap-2.5">
                      {Array.from({ length: TOTAL_STAMPS }).map((_, i) => {
                        const filled = i < FILLED_STAMPS;
                        return (
                          <div
                            key={i}
                            className={`flex aspect-square items-center justify-center rounded-full border-2 ${
                              filled
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-dashed border-emerald-400/60 bg-white/50 text-emerald-500 dark:border-white/30 dark:bg-white/5 dark:text-white/40'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {filled ? 'content_cut' : 'add'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="rounded-full bg-primary/20 px-3 py-1.5 text-emerald-800 dark:text-primary">9 de 10 sellos</span>
                      <span className="text-emerald-700 dark:text-white/60">Te falta 1</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-slate-900">
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-slate-400">
                    Guardada en la billetera del celular
                  </span>
                  <span className="material-symbols-outlined text-[20px] text-primary">wallet</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-200/30 blur-3xl -z-10" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 blur-3xl -z-10" />
        </div>
      </div>
    </section>
  );
};
