
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Process } from './components/Process';
import { ValueProp } from './components/ValueProp';
import { SocialProof } from './components/SocialProof';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { AuditStep1 } from './components/AuditStep1';
import { AuditStep2 } from './components/AuditStep2';

export type AppView = 'landing' | 'step1' | 'step2';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [view, setView] = useState<AppView>('landing');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const startAudit = () => setView('step1');
  const goToStep2 = () => setView('step2');
  const goHome = () => setView('landing');

  if (view === 'step1') {
    return <AuditStep1 onNext={goToStep2} onHome={goHome} />;
  }
  if (view === 'step2') {
    return <AuditStep2 onBack={() => setView('step1')} onHome={goHome} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] dark:bg-[#111827] transition-colors duration-300 selection:bg-primary/20 selection:text-primary-dark">
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} onStartAudit={startAudit} />
      <main className="flex-1">
        <Hero onStartAudit={startAudit} />
        <Services />
        <Process />
        <ValueProp />
        <SocialProof />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default App;
