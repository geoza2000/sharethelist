import { useState, useEffect, useCallback, useRef } from 'react';
import { isPWAInstalled, getInstallInstructions } from '@/lib/pwa';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function useInstallPrompt() {
  const [isInstalled, setIsInstalled] = useState(() => isPWAInstalled());
  const [canPrompt, setCanPrompt] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setCanPrompt(true);
    };

    const onAppInstalled = () => {
      setIsInstalled(true);
      setCanPrompt(false);
      deferredPrompt.current = null;
    };

    const onDisplayModeChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
    };

    window.addEventListener('beforeinstallprompt', onInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    const mql = window.matchMedia('(display-mode: standalone)');
    mql.addEventListener('change', onDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', onInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
      mql.removeEventListener('change', onDisplayModeChange);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt.current) return false;
    await deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setCanPrompt(false);
    }
    deferredPrompt.current = null;
    return outcome === 'accepted';
  }, []);

  return {
    isInstalled,
    canPrompt,
    promptInstall,
    installInstructions: isInstalled ? null : getInstallInstructions(),
  };
}
