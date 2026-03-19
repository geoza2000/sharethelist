import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { APP_URL } from '@/config/constants';

export default function CTA() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 md:py-28">
      <div className="section-container" ref={ref}>
        <div
          className={`relative rounded-3xl overflow-hidden animate-on-scroll ${isVisible ? 'visible' : ''}`}
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="absolute top-8 right-8 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-8 left-8 w-48 h-48 rounded-full bg-white/10 blur-2xl" />

          <div className="relative px-6 py-16 md:px-16 md:py-20 text-center">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white mb-4">
              Ready to shop smarter?
            </h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Join households already using Supermarket List. It&apos;s free, instant, and works on
              every device.
            </p>
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-10 py-4 rounded-full text-base font-bold text-brand-700 bg-white hover:bg-brand-50 transition-all shadow-xl shadow-brand-900/20 hover:-translate-y-0.5"
            >
              Get Started — It&apos;s Free
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
