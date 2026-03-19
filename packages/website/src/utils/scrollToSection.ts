/**
 * Smooth-scroll to an in-page section and sync the URL hash.
 * Use instead of plain hash links so repeat clicks still scroll (browser may no-op when hash unchanged).
 * Target sections use scroll-mt-* so the fixed navbar does not cover headings.
 */
export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;

  const prefersReduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  el.scrollIntoView({
    behavior: prefersReduced ? 'auto' : 'smooth',
    block: 'start',
  });

  const hash = `#${id}`;
  if (window.location.hash !== hash) {
    window.history.replaceState(null, '', hash);
  }
}
