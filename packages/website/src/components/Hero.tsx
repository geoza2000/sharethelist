import { ArrowRight, Sparkles } from 'lucide-react';
import { APP_URL } from '@/config/constants';

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-brand-100/60 via-brand-50/30 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-brand-200/30 to-transparent blur-3xl animate-pulse-soft" />
        <div className="absolute top-1/4 left-10 w-3 h-3 rounded-full bg-brand-400/40 animate-float" />
        <div className="absolute top-1/3 right-20 w-2 h-2 rounded-full bg-brand-300/50 animate-float-delayed" />
        <div className="absolute bottom-1/3 left-1/4 w-4 h-4 rounded-full bg-brand-200/40 animate-float" />
      </div>

      <div className="section-container pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-sm font-medium mb-8 animate-fade-up">
            <Sparkles size={16} className="text-brand-500" />
            <span>Free & open for everyone</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] mb-6 animate-fade-up [animation-delay:0.1s]">
            Never forget a{' '}
            <span className="gradient-text">grocery item</span>{' '}
            again
          </h1>

          <p className="text-lg sm:text-xl text-surface-900/60 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up [animation-delay:0.2s]">
            The smart shopping list your whole household shares. Scan barcodes,
            group by store, and shop in aisle order — so every trip is faster
            and nothing gets left behind.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up [animation-delay:0.3s]">
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/25 hover:shadow-2xl hover:shadow-brand-600/30 hover:-translate-y-0.5"
            >
              Start Shopping
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-surface-900/70 bg-surface-100 hover:bg-surface-200 transition-all"
            >
              See Features
            </a>
          </div>

          {/* Phone Mockup */}
          <div className="relative mt-16 md:mt-20 animate-fade-up [animation-delay:0.45s]">
            <div className="relative mx-auto w-[280px] sm:w-[320px] md:w-[360px]">
              <div className="relative rounded-[2.5rem] border-[8px] border-surface-900 bg-surface-900 shadow-2xl shadow-surface-900/30 overflow-hidden">
                {/* Status bar */}
                <div className="bg-surface-900 h-7 flex items-center justify-center">
                  <div className="w-20 h-5 bg-surface-900 rounded-full" />
                </div>
                {/* Screen content  */}
                <div className="bg-white aspect-[9/16.5] flex flex-col">
                  <div className="bg-brand-600 px-4 py-3">
                    <div className="text-white font-display font-bold text-sm">Supermarket List</div>
                    <div className="text-brand-100 text-xs mt-0.5">My Household</div>
                  </div>
                  <div className="flex-1 px-3 py-3 space-y-2.5">
                    <ShopGroup name="Lidl" items={['Milk 1L', 'Eggs x12', 'Bread']} color="bg-emerald-50 border-emerald-200" />
                    <ShopGroup name="Aldi" items={['Chicken breast', 'Rice 1kg']} color="bg-blue-50 border-blue-200" />
                    <ShopGroup name="Local Market" items={['Tomatoes', 'Bananas']} color="bg-amber-50 border-amber-200" />
                  </div>
                  <div className="px-3 pb-3">
                    <div className="flex items-center gap-2 bg-surface-100 rounded-xl px-3 py-2.5">
                      <div className="w-4 h-4 rounded-full bg-surface-300" />
                      <span className="text-xs text-surface-900/40">Add item...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow effect behind phone */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-200/40 via-brand-100/20 to-transparent rounded-full blur-3xl scale-150" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ShopGroup({ name, items, color }: { name: string; items: string[]; color: string }) {
  return (
    <div className={`rounded-xl border p-2.5 ${color}`}>
      <div className="text-[10px] font-bold text-surface-900/80 uppercase tracking-wider mb-1.5">{name}</div>
      {items.map((item) => (
        <div key={item} className="flex items-center gap-2 py-1">
          <div className="w-3.5 h-3.5 rounded border-2 border-surface-300 flex-shrink-0" />
          <span className="text-xs text-surface-900/70">{item}</span>
        </div>
      ))}
    </div>
  );
}
