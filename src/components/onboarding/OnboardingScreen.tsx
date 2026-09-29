import React, { useState } from 'react';
import { ArrowRight, Sparkles, Check, Heart, Network, Image as ImageIcon } from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

export const OnboardingScreen: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, setActiveTab } = useFamily();
  const [step, setStep] = useState(0);

  if (!isOnboardingOpen) return null;

  const slides = [
    {
      title: 'Our Family. Our Story.',
      subtitle: 'Keep your family close, across generations.',
      desc: 'Create your interactive family tree, connect parents, children and ancestors in one private place.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-16 h-16 text-emerald-400 fill-current drop-shadow-lg">
          <path d="M12 2C7.58 2 4 5.58 4 10c0 3.19 1.88 5.95 4.6 7.24L8 22h8l-.6-4.76C18.12 15.95 20 13.19 20 10c0-4.42-3.58-8-8-8zm0 2c3.31 0 6 2.69 6 6 0 2.22-1.21 4.15-3 5.19V11h-2v3.19c-.31.06-.65.09-1 .09s-.69-.03-1-.09V11h-2v4.19c-1.79-1.04-3-2.97-3-5.19 0-3.31 2.69-6 6-6zm-1 12h2v4h-2v-4z" />
        </svg>
      ),
    },
    {
      title: 'Connect Generations',
      subtitle: 'Smart automatic relationship inference.',
      desc: 'Add parents and children—our relationship engine automatically figures out grandparents, uncles, aunts and cousins.',
      icon: <Network className="w-16 h-16 text-teal-400 drop-shadow-lg" />,
    },
    {
      title: 'Preserve Memories',
      subtitle: 'Store photos, audio stories and recipes.',
      desc: 'Tag relatives in heirloom albums, track milestone events, and preserve oral family lore forever.',
      icon: <ImageIcon className="w-16 h-16 text-amber-400 drop-shadow-lg" />,
    },
  ];

  const currentSlide = slides[step] || slides[0];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      setIsOnboardingOpen(false);
      setActiveTab('home');
    }
  };

  const handleSkip = () => {
    setIsOnboardingOpen(false);
    setActiveTab('home');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden animate-fade-in">
      <div className="relative w-full max-w-md h-full flex flex-col justify-between overflow-hidden">
        {/* Background Scenic Evergreen Forest matching mockup */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80"
            alt="Misty Forest"
            className="w-full h-full object-cover brightness-[0.4] filter blur-[0.5px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-black/40" />
        </div>

        {/* Top brand header */}
        <div className="relative z-10 p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
              FamilyTree
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md"
          >
            Skip
          </button>
        </div>

        {/* Center Content matching mockup */}
        <div className="relative z-10 px-6 flex flex-col items-center text-center space-y-6 animate-fade-in">
          {/* Logo container with gradient border */}
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-1 shadow-2xl shadow-emerald-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950/90 rounded-[22px] flex items-center justify-center">
              {currentSlide.icon}
            </div>
          </div>

          <div className="space-y-2 max-w-xs">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">FamilyTree</h1>
            <p className="text-sm font-semibold text-emerald-400">{currentSlide.subtitle}</p>
            <p className="text-xs text-slate-300 leading-relaxed pt-2">{currentSlide.desc}</p>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2 pt-2">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === idx ? 'w-6 bg-emerald-400' : 'w-1.5 bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Actions matching mockup */}
        <div className="relative z-10 p-6 space-y-3">
          <button
            onClick={handleNext}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-extrabold text-base shadow-2xl shadow-emerald-500/40 transition-all flex items-center justify-center gap-2 group"
          >
            <span>{step === slides.length - 1 ? 'Get Started' : 'Continue'}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleSkip}
            className="w-full py-3 text-center text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            I already have an account
          </button>
        </div>
      </div>
    </div>
  );
};
