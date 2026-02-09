
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Process } from './components/Process';
import { ValueProp } from './components/ValueProp';
import { SocialProof } from './components/SocialProof';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] dark:bg-[#111827] transition-colors duration-300 selection:bg-primary/20 selection:text-primary-dark">
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-1">
        <Hero />
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
