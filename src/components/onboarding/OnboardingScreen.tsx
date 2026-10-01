import React, { useState } from 'react';
import { ArrowRight, Network, Image as ImageIcon } from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

export const OnboardingScreen: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, setActiveTab, t } = useFamily();
  const [step, setStep] = useState(0);

  if (!isOnboardingOpen) return null;

  const slides = [
    {
      title: t.ob1Title,
      subtitle: t.tagline,
      desc: t.ob1Desc,
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 text-white fill-current">
          <path d="M12 2C7.58 2 4 5.58 4 10c0 3.19 1.88 5.95 4.6 7.24L8 22h8l-.6-4.76C18.12 15.95 20 13.19 20 10c0-4.42-3.58-8-8-8zm0 2c3.31 0 6 2.69 6 6 0 2.22-1.21 4.15-3 5.19V11h-2v3.19c-.31.06-.65.09-1 .09s-.69-.03-1-.09V11h-2v4.19c-1.79-1.04-3-2.97-3-5.19 0-3.31 2.69-6 6-6zm-1 12h2v4h-2v-4z" />
        </svg>
      ),
    },
    {
      title: t.ob2Title,
      subtitle: t.relations,
      desc: t.ob2Desc,
      icon: <Network className="w-12 h-12 text-white" />,
    },
    {
      title: t.ob3Title,
      subtitle: t.photos,
      desc: t.ob3Desc,
      icon: <ImageIcon className="w-12 h-12 text-white" />,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950 overflow-hidden animate-fade-in">
      <div className="relative w-full max-w-md h-full flex flex-col justify-between overflow-hidden">
        {/* Offline-safe gradient background (no external image) */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_30%,#52525b,transparent_60%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        {/* Top header */}
        <div className="relative z-10 p-6 flex items-center justify-between" style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top))' }}>
          <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
            {t.appName}
          </span>
          <button
            onClick={handleSkip}
            className="min-h-[44px] text-xs font-semibold text-neutral-400 hover:text-white px-4 py-2 rounded-full bg-white/10 backdrop-blur-md transition-colors"
          >
            {t.skip}
          </button>
        </div>

        {/* Center Content */}
        <div className="relative z-10 px-6 flex flex-col items-center text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-700/80 shadow-2xl flex items-center justify-center">
            {currentSlide.icon}
          </div>

          <div className="space-y-2 max-w-xs">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{currentSlide.title}</h1>
            <p className="text-xs font-semibold text-neutral-400">{currentSlide.subtitle}</p>
            <p className="text-xs text-neutral-400 leading-relaxed pt-1">{currentSlide.desc}</p>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5 pt-1">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === idx ? 'w-5 bg-white' : 'w-1.5 bg-neutral-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="relative z-10 p-6 pt-0" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
          <button
            onClick={handleNext}
            className="w-full min-h-[48px] py-3 px-6 rounded-2xl bg-white text-neutral-950 font-bold text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            <span>{step === slides.length - 1 ? t.getStarted : t.next}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
