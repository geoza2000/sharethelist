import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogClose,
} from '@/components/ui/responsive-dialog';
import { Download, X, Smartphone } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

const DISMISS_STORAGE_KEY = 'pwa-install-banner-dismissed';

interface InstallPWABannerProps {
  /** 'settings' = always visible, 'shopping-list' = dismissable with localStorage persistence */
  variant: 'settings' | 'shopping-list';
}

export function InstallPWABanner({ variant }: InstallPWABannerProps) {
  const { isInstalled, canPrompt, promptInstall, installInstructions } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(() => {
    if (variant !== 'shopping-list') return false;
    return localStorage.getItem(DISMISS_STORAGE_KEY) === 'true';
  });
  const [mounted, setMounted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isInstalled || dismissed) return null;

  const handleInstall = async () => {
    if (canPrompt) {
      const accepted = await promptInstall();
      if (accepted) setDialogOpen(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(DISMISS_STORAGE_KEY, 'true');
  };

  if (variant === 'settings') {
    return (
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary flex-shrink-0">
            <Smartphone className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm">Install the App</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add to your home screen for a faster, native-like experience with offline support.
            </p>
            {canPrompt ? (
              <Button size="sm" className="mt-3 h-8" onClick={handleInstall}>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Install App
              </Button>
            ) : installInstructions ? (
              <div className="mt-3 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  {installInstructions.platform}:
                </p>
                <ol className="text-xs text-muted-foreground list-decimal list-inside space-y-0.5">
                  {installInstructions.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className={`w-full rounded-lg border border-primary/20 bg-primary/5 p-3 text-left transition-all duration-300 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary flex-shrink-0">
            <Download className="h-4 w-4 text-primary-foreground" />
          </div>
          <p className="text-sm flex-1">
            Install the app for a better experience
          </p>
          <div className="flex items-center flex-shrink-0">
            <div
              role="button"
              tabIndex={0}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent"
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  handleDismiss();
                }
              }}
            >
              <X className="h-4 w-4" />
            </div>
          </div>
        </div>
      </button>

      <ResponsiveDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Install the App</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Get a faster, native-like experience with offline support and push notifications.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <div className="px-4 md:px-0 space-y-4">
            {installInstructions && (
              <div className="space-y-3">
                <p className="text-sm font-medium">
                  How to install ({installInstructions.platform})
                </p>
                <ol className="space-y-2">
                  {installInstructions.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          <ResponsiveDialogFooter>
            {canPrompt ? (
              <Button className="w-full" onClick={handleInstall}>
                <Download className="mr-2 h-4 w-4" />
                Install Now
              </Button>
            ) : (
              <ResponsiveDialogClose asChild>
                <Button variant="outline" className="w-full">
                  Got it
                </Button>
              </ResponsiveDialogClose>
            )}
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  );
}
