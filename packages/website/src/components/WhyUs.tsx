import { Zap, Lock, Globe, Heart } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const REASONS = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built as a Progressive Web App with real-time sync. Your list updates across all devices instantly.',
  },
  {
    icon: Lock,
    title: 'Private & Secure',
    description: 'Your data stays in your household. Google authentication and Firebase security rules keep it locked down.',
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    description: 'Any device, any browser. Install it on your phone for a native-like experience — no app store needed.',
  },
  {
    icon: Heart,
    title: 'Built for Families',
    description: 'Real-time collaboration, barcode scanning, and store grouping — designed for how real households shop.',
  },
];

export default function WhyUs() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="why-us" className="py-20 md:py-28 bg-surface-900 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl" />

      <div className="section-container relative" ref={ref}>
        <div className={`text-center max-w-2xl mx-auto mb-14 animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <span className="text-sm font-semibold text-brand-400 uppercase tracking-widest">
            Why Supermarket List
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight mt-3 mb-4">
            Shopping lists,{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-brand-300">
              reimagined
            </span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            We took the humble shopping list and made it collaborative, smart, and delightful.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
          {REASONS.map((reason, i) => (
            <div
              key={reason.title}
              className={`p-6 md:p-7 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-400/30 transition-all duration-300 hover:bg-white/[0.08] animate-on-scroll stagger-${i + 1} ${isVisible ? 'visible' : ''}`}
            >
              <div className="w-11 h-11 rounded-xl bg-brand-500/20 flex items-center justify-center mb-4">
                <reason.icon size={22} className="text-brand-400" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">
                {reason.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
