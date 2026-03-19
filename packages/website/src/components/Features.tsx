import {
  ScanBarcode,
  Users,
  Store,
  Bell,
  Smartphone,
  ListChecks,
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const FEATURES = [
  {
    icon: ListChecks,
    title: 'Shared Shopping Lists',
    description:
      'Create lists that sync instantly across your household. Everyone sees what to buy in real time.',
  },
  {
    icon: ScanBarcode,
    title: 'Barcode Scanner',
    description:
      'Point your camera at any product barcode. It auto-identifies the item and adds it to your list.',
  },
  {
    icon: Store,
    title: 'Grouped by Store',
    description:
      'Items automatically organize by shop so you can breeze through each aisle without backtracking.',
  },
  {
    icon: Users,
    title: 'Household Collaboration',
    description:
      'Invite family members with a link. Everyone can add, check off, and manage the list together.',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description:
      'Set visit periods for each store and get notified when it\'s time for your next shopping run.',
  },
  {
    icon: Smartphone,
    title: 'Works Offline (PWA)',
    description:
      'Install it like a native app on any device. Check your list even without internet connection.',
  },
];

export default function Features() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      id="features"
      className="scroll-mt-24 md:scroll-mt-28 py-20 md:py-28 bg-surface-50/50"
    >
      <div className="section-container" ref={ref}>
        <div className={`text-center max-w-2xl mx-auto mb-14 animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <span className="text-sm font-semibold text-brand-600 uppercase tracking-widest">
            Features
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight mt-3 mb-4">
            Everything you need to{' '}
            <span className="gradient-text">shop smarter</span>
          </h2>
          <p className="text-surface-900/60 text-lg leading-relaxed">
            Built for real families and busy households. Every feature is
            designed to save you time at the store.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {FEATURES.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              isVisible={isVisible}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  isVisible,
  index,
}: {
  icon: typeof ListChecks;
  title: string;
  description: string;
  isVisible: boolean;
  index: number;
}) {
  return (
    <div
      className={`group relative p-6 md:p-7 rounded-2xl bg-white border border-surface-200/60 hover:border-brand-200 transition-all duration-300 hover:shadow-lg hover:shadow-brand-100/40 hover:-translate-y-1 animate-on-scroll stagger-${index + 1} ${isVisible ? 'visible' : ''}`}
    >
      <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
        <Icon size={24} className="text-brand-600" />
      </div>
      <h3 className="font-display font-bold text-lg mb-2 text-surface-900">
        {title}
      </h3>
      <p className="text-surface-900/60 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
