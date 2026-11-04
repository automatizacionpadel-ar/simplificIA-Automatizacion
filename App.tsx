import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HomeFidelizacion } from './components/HomeFidelizacion';
import { Services } from './components/Services';
import { LocalWebs } from './components/LocalWebs';
import { Fidelizacion } from './components/Fidelizacion';
import { Process } from './components/Process';
import { ValueProp } from './components/ValueProp';
// import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { AuditStep1 } from './components/AuditStep1';
import { AuditStep2 } from './components/AuditStep2';
import { SolicitudTarjeta } from './components/SolicitudTarjeta';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import type { BillingCycleId } from './components/fidelizacionPlans';

export type AppView = 'landing' | 'fidelizacion' | 'solicitud' | 'step1' | 'step2';

const FIDELIZACION_PATH = '/fidelizacion';
const SOLICITUD_PATH = '/solicitud-tarjeta';

const PAGE_META: Record<'landing' | 'fidelizacion' | 'solicitud', { title: string; description: string }> = {
  landing: {
    title: 'Simplificia | Tarjetas de fidelización digitales y webs con turnos para negocios locales',
    description:
      'Tarjetas de fidelización en el celular de tus clientes y webs con turnos online para peluquerías, cafeterías, gimnasios y negocios locales de Argentina. Probala gratis.',
  },
  fidelizacion: {
    title: 'Tarjetas de fidelización digitales para comercios | SimplificIA',
    description:
      'Tarjeta de fidelización digital para comercios en Argentina: tarjeta de sellos digital y por puntos en la billetera del celular. Sin apps ni cartón.',
  },
  solicitud: {
    title: 'Solicitá tu tarjeta digital | SimplificIA',
    description:
      'Completá el formulario y solicitá tu tarjeta de fidelización digital para tu comercio. Te mostramos cómo quedaría, sin compromiso.',
  },
};

function viewFromPath(): 'landing' | 'fidelizacion' | 'solicitud' {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === SOLICITUD_PATH) return 'solicitud';
  return path === FIDELIZACION_PATH ? 'fidelizacion' : 'landing';
}

function setMetaDescription(content: string) {
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', 'description');
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [view, setView] = useState<AppView>(() => viewFromPath());
  const [planSolicitud, setPlanSolicitud] = useState<string | null>(null);
  const [billingCycleSolicitud, setBillingCycleSolicitud] = useState<BillingCycleId>('monthly');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sincroniza la vista con la URL (botones atrás/adelante del navegador).
  useEffect(() => {
    const onPopState = () => {
      setView(viewFromPath());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // SEO por página.
  useEffect(() => {
    const meta =
      view === 'fidelizacion'
        ? PAGE_META.fidelizacion
        : view === 'solicitud'
          ? PAGE_META.solicitud
          : PAGE_META.landing;
    document.title = meta.title;
    setMetaDescription(meta.description);
  }, [view]);

  // Scroll a ancla en carga directa (ej.: /#servicios o /fidelizacion#planes).
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      const t = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView();
      }, 60);
      return () => window.clearTimeout(t);
    }
  }, []);

  const navigate = useCallback((path: string, nextView: AppView) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setView(nextView);
    window.scrollTo({ top: 0 });
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const startAudit = () => setView('step1');
  const goToStep2 = () => setView('step2');
  const goHome = useCallback(() => navigate('/', 'landing'), [navigate]);
  const goFidelizacion = useCallback(() => navigate(FIDELIZACION_PATH, 'fidelizacion'), [navigate]);
  const goSolicitud = useCallback(
    (plan?: string | null, billingCycle?: BillingCycleId) => {
      if (plan !== undefined) setPlanSolicitud(plan);
      if (billingCycle !== undefined) setBillingCycleSolicitud(billingCycle);
      navigate(SOLICITUD_PATH, 'solicitud');
    },
    [navigate]
  );

  // Los links de secciones vuelven al home (si hace falta) y scrollean a la sección.
  const goSection = useCallback(
    (id: string) => {
      if (window.location.pathname !== '/') {
        navigate('/', 'landing');
      }
      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      });
    },
    [navigate]
  );

  if (view === 'step1') {
    return <AuditStep1 onNext={goToStep2} onHome={goHome} />;
  }
  if (view === 'step2') {
    return <AuditStep2 onBack={() => setView('step1')} onHome={goHome} />;
  }

  if (view === 'solicitud') {
    return (
      <div className="min-h-screen flex flex-col bg-[#F9FAFB] dark:bg-[#111827] transition-colors duration-300">
        <Navbar
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          isFidelizacion
          onGoHome={goHome}
          onGoSection={goSection}
        />
        <main className="flex-1">
          <SolicitudTarjeta
            key={`${planSolicitud ?? 'sin-plan'}-${billingCycleSolicitud}`}
            planInicial={planSolicitud}
            billingCycleInicial={billingCycleSolicitud}
            onBack={goFidelizacion}
            onHome={goHome}
          />
        </main>
        <Footer onGoFidelizacion={goFidelizacion} onGoSection={goSection} />
        <WhatsAppFloat />
      </div>
    );
  }

  const shellClass =
    'min-h-screen flex flex-col bg-[#F9FAFB] dark:bg-[#111827] transition-colors duration-300 selection:bg-primary/20 selection:text-primary-dark';

  if (view === 'fidelizacion') {
    return (
      <div className={shellClass}>
        <Navbar
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          isFidelizacion
          onGoHome={goHome}
          onGoSection={goSection}
        />
        <main className="flex-1">
          <Fidelizacion onStartAudit={startAudit} onSolicitar={goSolicitud} />
        </main>
        <Footer onGoFidelizacion={goFidelizacion} onGoSection={goSection} />
        <WhatsAppFloat />
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onGoHome={goHome}
        onGoSection={goSection}
      />
      <main className="flex-1">
        <Hero onSolicitar={() => goSolicitud()} />
        <HomeFidelizacion onGoFidelizacion={goFidelizacion} onSolicitar={goSolicitud} />
        <LocalWebs />
        <Process />
        <ValueProp />
        <Services />
        {/* TODO_TESTIMONIOS: cuando haya testimonios reales, sumar una sección acá y volver a agregar el link en el menú. */}
        {/* <CTA /> */}
      </main>
      <Footer onGoFidelizacion={goFidelizacion} onGoSection={goSection} />
      <WhatsAppFloat />
    </div>
  );
};

export default App;
