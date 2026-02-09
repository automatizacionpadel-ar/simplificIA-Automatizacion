
import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Process } from './components/Process';
import { ValueProp } from './components/ValueProp';
import { SocialProof } from './components/SocialProof';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] selection:bg-primary/20 selection:text-primary-dark">
      <Navbar />
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
