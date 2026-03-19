import { UserPlus, ShoppingCart, CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const STEPS = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Create Your Household',
    description:
      'Sign in with Google, create a household, and invite your family members with a simple link.',
  },
  {
    icon: ShoppingCart,
    number: '02',
    title: 'Build Your List',
    description:
      'Add items by typing, scanning barcodes, or picking from your product catalog. Items auto-sort by store.',
  },
  {
    icon: CheckCircle,
    number: '03',
    title: 'Shop & Check Off',
    description:
      'Head to the store, follow items in aisle order, and check them off. Your household sees progress live.',
  },
];

export default function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 md:scroll-mt-28 py-20 md:py-28"
    >
      <div className="section-container" ref={ref}>
        <div className={`text-center max-w-2xl mx-auto mb-14 animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <span className="text-sm font-semibold text-brand-600 uppercase tracking-widest">
            How It Works
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight mt-3 mb-4">
            Up and running in{' '}
            <span className="gradient-text">3 easy steps</span>
          </h2>
          <p className="text-surface-900/60 text-lg leading-relaxed">
            No complicated setup. Just sign in and start shopping smarter.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px bg-gradient-to-r from-brand-200 via-brand-300 to-brand-200" />

          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`relative text-center animate-on-scroll stagger-${i + 1} ${isVisible ? 'visible' : ''}`}
            >
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-600/20 mb-6">
                <step.icon size={32} className="text-white" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-brand-500 flex items-center justify-center text-xs font-bold text-brand-600 shadow-sm">
                  {step.number}
                </span>
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-surface-900">
                {step.title}
              </h3>
              <p className="text-surface-900/60 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
