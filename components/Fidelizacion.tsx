import React, { useState } from 'react';
import { fidelizacionPlans, FIDELIZACION_HIGHLIGHT_LABEL } from './fidelizacionPlans';

interface FidelizacionProps {
  onStartAudit: () => void;
  onSolicitar?: (plan?: string) => void;
}

const STEPS = [
  {
    icon: 'palette',
    title: 'Creá tu tarjeta',
    description: 'Elegí el tipo de tarjeta, cargá tu logo y tus colores y definí el premio desde el panel.',
  },
  {
    icon: 'qr_code_2',
    title: 'Pegá tu QR en el local',
    description: 'Descargá tu código QR y pegalo en el mostrador, o compartilo por redes y WhatsApp.',
  },
  {
    icon: 'wallet',
    title: 'Tus clientes la guardan',
    description: 'Escanean el QR, dejan sus datos y agregan la tarjeta a la billetera del celular. Sin descargar apps.',
  },
  {
    icon: 'approval',
    title: 'Sumá sellos o puntos',
    description: 'En cada compra escaneás su tarjeta desde tu celular y el sello o los puntos se suman al instante.',
  },
  {
    icon: 'redeem',
    title: 'Canjean su premio',
    description: 'Al completar la meta, tu cliente canjea su premio y ya tiene un motivo para volver.',
  },
];

const CARD_TYPES = [
  {
    icon: 'loyalty',
    title: 'Tarjeta de sellos',
    description: 'El clásico de las cafeterías, ahora digital: "Comprá 10 y llevate el 11 gratis".',
    badge: null as string | null,
  },
  {
    icon: 'stars',
    title: 'Tarjeta de puntos',
    description: 'Tus clientes acumulan puntos por visita o por monto gastado y los canjean por premios.',
    badge: null as string | null,
  },
  {
    icon: 'confirmation_number',
    title: 'Tarjeta de cupones',
    description: 'Descuentos puntuales para campañas y promociones.',
    badge: 'Próximamente',
  },
];

const BUSINESS_TYPES = [
  { icon: 'content_cut', label: 'Peluquerías y barberías' },
  { icon: 'local_cafe', label: 'Cafeterías y panaderías' },
  { icon: 'fitness_center', label: 'Gimnasios y entrenamiento' },
  { icon: 'sports_tennis', label: 'Canchas de pádel y fútbol' },
  { icon: 'spa', label: 'Centros de estética' },
  { icon: 'pets', label: 'Veterinarias y peluquería canina' },
  { icon: 'visibility', label: 'Ópticas' },
  { icon: 'local_car_wash', label: 'Lavaderos' },
];

const BENEFITS = [
  {
    icon: 'repeat',
    title: 'Que vuelvan más seguido',
    description: 'Tus clientes tienen un premio cerca y un motivo concreto para elegirte de nuevo.',
  },
  {
    icon: 'phone_iphone',
    title: 'Chau tarjetita de cartón',
    description: 'Se acabó la tarjeta que se pierde o se olvida: ahora vive en el celular que ya llevan encima.',
  },
  {
    icon: 'group',
    title: 'Tu base de clientes',
    description: 'Guardá nombre, teléfono y frecuencia de visita de quienes ya te eligen.',
  },
  {
    icon: 'bolt',
    title: 'Lista en minutos',
    description: 'Se configura en minutos, sin instalar nada y sin hardware especial.',
  },
  {
    icon: 'storefront',
    title: 'Con lo que ya tenés',
    description: 'Funciona con el celular que ya tenés en el mostrador. Sin equipos raros.',
  },
];

const FAQS = [
  {
    question: '¿El cliente tiene que descargar una app?',
    answer: 'No. Escanea el QR de tu local, completa un formulario corto y la tarjeta queda guardada en la billetera de su celular. Sin descargas ni registros complicados.',
  },
  {
    question: '¿Funciona en iPhone?',
    answer: 'Hoy la tarjeta se guarda en Google Wallet (Android). En iPhone tu cliente accede a su tarjeta desde un enlace web, y el soporte para Apple Wallet está en camino.',
  },
  {
    question: '¿Necesito equipos especiales?',
    answer: 'No. Te alcanza con un celular o una tablet para escanear las tarjetas y sumar sellos o puntos en el momento.',
  },
  {
    question: '¿Puedo poner mi logo y mis colores?',
    answer: 'Sí. Personalizás la tarjeta con tu logo y tus colores para que se vea como tu marca.',
  },
  {
    question: '¿Cuánto tarda en estar lista?',
    answer: 'Se configura en minutos desde el panel: elegís el tipo, cargás tu logo, definís el premio y descargás tu QR.',
  },
  {
    // TODO: confirmar política de permanencia con el dueño del proyecto antes de publicar una respuesta definitiva.
    question: '¿Hay permanencia?',
    answer: 'Estamos terminando de definir las condiciones comerciales. Escribinos y te contamos la propuesta actual sin compromiso.',
  },
];

const TOTAL_STAMPS = 10;
const FILLED_STAMPS = 7;

const FaqItem: React.FC<{ question: string; answer: string; open: boolean; onToggle: () => void; index: number }> = ({
  question,
  answer,
  open,
  onToggle,
  index,
}) => (
  <div className="glass-card rounded-[1.5rem] overflow-hidden">
    <h3>
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`fidelizacion-faq-panel-${index}`}
        id={`fidelizacion-faq-button-${index}`}
        className="w-full flex items-center justify-between gap-4 p-6 text-left focus-visible:outline-2 focus-visible:outline-primary"
      >
        <span className="font-bold text-slate-900 dark:text-white">{question}</span>
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
            open ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">{open ? 'remove' : 'add'}</span>
        </span>
      </button>
    </h3>
    {open && (
      <div id={`fidelizacion-faq-panel-${index}`} role="region" aria-labelledby={`fidelizacion-faq-button-${index}`}>
        <p className="px-6 pb-6 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{answer}</p>
      </div>
    )}
  </div>
);

const LoyaltyCardMock: React.FC = () => (
  <div
    className="relative mx-auto w-full max-w-[320px] rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl p-3"
    role="img"
    aria-label="Ejemplo de tarjeta de sellos digital en un celular: 7 de 10 sellos completados"
  >
    <div className="mx-auto mb-3 h-1.5 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
    <div className="rounded-[2rem] bg-primary p-6 text-white relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-black/10 rounded-full" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/80">Mi café favorito</span>
          <span className="material-symbols-outlined text-white/90">local_cafe</span>
        </div>
        <p className="font-black text-xl mb-4">Comprá 10 y llevate el 11 gratis</p>
        <div className="grid grid-cols-5 gap-2.5 mb-4">
          {Array.from({ length: TOTAL_STAMPS }).map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-full flex items-center justify-center border-2 ${
                i < FILLED_STAMPS ? 'bg-white border-white text-primary' : 'bg-white/20 border-white/50 text-white/70 border-dashed'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{i < FILLED_STAMPS ? 'coffee' : 'lock_open'}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="bg-white/20 rounded-full px-3 py-1.5">7 de 10 sellos</span>
          <span className="text-white/80">Te faltan 3</span>
        </div>
      </div>
    </div>
    <div className="px-4 py-4 flex items-center justify-between">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Guardada en la billetera del celular</span>
      <span className="material-symbols-outlined text-primary">wallet</span>
    </div>
  </div>
);

export const Fidelizacion: React.FC<FidelizacionProps> = ({ onStartAudit, onSolicitar }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const solicitar = (plan?: string) => {
    if (onSolicitar) onSolicitar(plan ?? null);
    else onStartAudit();
  };

  return (
    <section id="fidelizacion" className="px-6 py-24 bg-white/50 dark:bg-slate-950/20 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto">
        {/* Hero */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-widest border border-primary/10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Fidelización
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight">
              Que tus clientes vuelvan, <span className="text-primary">con una tarjeta que ya llevan en el celular.</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Tarjetas de fidelización digitales para tu comercio. Sin apps que descargar, sin cartón que se pierde: escanean un QR y listo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => solicitar()}
                className="w-full sm:w-auto bg-primary hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-95 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20"
              >
                Quiero mi tarjeta
              </button>
              <a
                href="#fidelizacion-planes"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('fidelizacion-planes')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto text-center bg-transparent border border-slate-200 dark:border-white/15 hover:border-primary hover:text-primary transition-all text-slate-700 dark:text-white px-10 py-5 rounded-2xl font-bold text-lg"
              >
                Ver planes
              </a>
            </div>
          </div>
          <div className="flex-1 relative w-full">
            <LoyaltyCardMock />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-200/30 blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 blur-3xl -z-10" />
          </div>
        </div>

        {/* Cómo funciona */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Cómo funciona</span>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Simple para vos, simple para tus clientes</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            En cinco pasos pasás del cartón perdido a una tarjeta que se actualiza sola en el celular.
          </p>
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-24 list-none">
          {STEPS.map((step, idx) => (
            <li
              key={idx}
              className="glass-card rounded-[2.5rem] bg-emerald-soft/10 p-8 hover:border-primary/40 transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">{step.icon}</span>
              </div>
              <div className="flex items-center gap-3 text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
                <div className="h-[2px] w-8 bg-primary" /> Paso {idx + 1}
              </div>
              <h4 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{step.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.description}</p>
            </li>
          ))}
        </ol>

        {/* Tipos de tarjeta */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Tipos de tarjeta</span>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Elegí cómo premiar a tus clientes</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {CARD_TYPES.map((card, idx) => (
            <div
              key={idx}
              className="glass-card rounded-[2.5rem] bg-emerald-soft/10 p-8 hover:border-primary/40 transition-all duration-300 hover:-translate-y-2 group relative"
            >
              {card.badge && (
                <span className="absolute top-6 right-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                  {card.badge}
                </span>
              )}
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">{card.icon}</span>
              </div>
              <h4 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{card.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Para qué negocios */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">¿Para quién es?</span>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Ideal si tus clientes vuelven seguido</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-24">
          {BUSINESS_TYPES.map((business, idx) => (
            <div
              key={idx}
              className="glass-card rounded-[1.5rem] p-6 flex items-center gap-4 hover:border-primary/40 transition-all"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-[28px]">{business.icon}</span>
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{business.label}</span>
            </div>
          ))}
        </div>

        {/* Beneficios */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Beneficios</span>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Por qué te va a servir</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {BENEFITS.map((benefit, idx) => (
            <div
              key={idx}
              className="group p-8 bg-white dark:bg-primary/10 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-4">
                <span className="material-symbols-outlined text-[20px]">{benefit.icon}</span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{benefit.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
          <div className="p-8 bg-primary rounded-[2rem] text-white flex flex-col justify-center shadow-xl shadow-primary/20">
            <span className="material-symbols-outlined text-4xl mb-4">wallet</span>
            <h4 className="text-xl font-black mb-2">Compatible con Google Wallet</h4>
            <p className="text-white/80 text-sm leading-relaxed">
              Tus clientes guardan la tarjeta en la billetera del celular. En iPhone acceden desde un enlace web, y el
              soporte para Apple Wallet está en camino.
            </p>
          </div>
        </div>

        {/* Planes */}
        <div id="fidelizacion-planes" className="text-center space-y-4 mb-16 scroll-mt-24">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Planes</span>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Elegí tu plan</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            Empezá simple y crecé cuando quieras. Sin hardware especial ni instalaciones raras.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {fidelizacionPlans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.highlighted
                  ? 'bg-primary p-10 rounded-super text-white flex flex-col shadow-2xl shadow-primary/30 relative overflow-hidden group'
                  : 'bg-white dark:bg-slate-900 p-10 rounded-super border border-slate-100 dark:border-white/5 flex flex-col hover:shadow-xl dark:hover:border-primary/20 transition-all group'
              }
            >
              {plan.highlighted && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />}
              <div className="relative z-10 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div
                    className={
                      plan.highlighted
                        ? 'w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center'
                        : 'w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors'
                    }
                  >
                    <span className={`material-symbols-outlined text-3xl ${plan.highlighted ? 'text-white' : ''}`}>{plan.icon}</span>
                  </div>
                  {plan.highlighted && (
                    <span className="bg-white text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap">
                      {FIDELIZACION_HIGHLIGHT_LABEL}
                    </span>
                  )}
                </div>
                <h4 className={`text-xl font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  {plan.name}
                </h4>
                <p className={`text-sm mb-4 ${plan.highlighted ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                  {plan.description}
                </p>
                <div className={`text-4xl font-black mb-6 ${plan.highlighted ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  {plan.quoteOnly ? (
                    <span className="text-2xl">Cotización a medida</span>
                  ) : (
                    <>
                      {plan.price} <span className="text-lg font-bold">{plan.period}</span>
                    </>
                  )}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          plan.highlighted ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                      </div>
                      <span
                        className={`text-sm font-medium ${plan.highlighted ? 'text-white/90' : 'text-slate-600 dark:text-slate-400'}`}
                      >
                        {feature.label}
                        {feature.comingSoon && (
                          <span
                            className={`ml-2 inline-block text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                              plan.highlighted ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300'
                            }`}
                          >
                            Próximamente
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => solicitar(plan.name)}
                  className={
                    plan.highlighted
                      ? 'w-full bg-white text-primary hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-95 px-8 py-4 rounded-2xl font-black text-lg'
                      : 'w-full bg-primary hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-95 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20'
                  }
                >
                  {plan.ctaLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-24">
          ¿No sabés cuál te conviene? Escribinos y lo vemos juntos.
        </p>

        {/* FAQ */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Preguntas frecuentes</span>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Dudas típicas, respuestas claras</h3>
        </div>
        <div className="max-w-3xl mx-auto space-y-4 mb-24">
          {FAQS.map((faq, idx) => (
            <FaqItem
              key={idx}
              index={idx}
              question={faq.question}
              answer={faq.answer}
              open={openFaq === idx}
              onToggle={() => setOpenFaq(openFaq === idx ? null : idx)}
            />
          ))}
        </div>

        {/* CTA final */}
        <div className="relative bg-slate-900 rounded-[3rem] p-12 md:p-24 overflow-hidden text-center flex flex-col items-center gap-10 shadow-2xl">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 blur-[100px] -z-0 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] -z-0 translate-x-1/4 translate-y-1/4" />
          <div className="space-y-6 relative z-10">
            <h3 className="text-white text-4xl md:text-6xl font-black max-w-2xl leading-tight">
              Empezá a fidelizar esta semana
            </h3>
            <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto">
              Contanos de tu comercio y te mostramos cómo quedaría tu tarjeta. Sin compromiso.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-5 w-full justify-center relative z-10">
            <button
              onClick={() => solicitar()}
              className="bg-primary hover:bg-primary-dark transition-all hover:scale-105 active:scale-95 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-[0_0_40px_rgba(22,163,74,0.3)]"
            >
              Quiero mi tarjeta
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
