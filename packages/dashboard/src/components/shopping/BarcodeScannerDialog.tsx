import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Html5Qrcode,
  Html5QrcodeScannerState,
  Html5QrcodeSupportedFormats,
} from 'html5-qrcode';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Loader2, X, SwitchCamera, Keyboard } from 'lucide-react';

interface BarcodeScannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (barcode: string) => void;
  onManualEntry?: () => void;
}

const SCANNER_ID = 'barcode-scanner-region';

const BARCODE_FORMATS = [
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.CODE_93,
  Html5QrcodeSupportedFormats.ITF,
  Html5QrcodeSupportedFormats.QR_CODE,
];

export function BarcodeScannerDialog({
  open,
  onOpenChange,
  onScan,
  onManualEntry,
}: BarcodeScannerDialogProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [activeCameraIndex, setActiveCameraIndex] = useState(0);
  const mountedRef = useRef(true);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;
    try {
      const state = scanner.getState();
      if (
        state === Html5QrcodeScannerState.SCANNING ||
        state === Html5QrcodeScannerState.PAUSED
      ) {
        await scanner.stop();
      }
    } catch {
      // Already stopped
    }
    scannerRef.current = null;
  }, []);

  const startWithCamera = useCallback(
    async (cameraId: string) => {
      setStarting(true);
      setError(null);

      try {
        await stopScanner();
        await new Promise((r) => setTimeout(r, 100));

        const el = document.getElementById(SCANNER_ID);
        if (!el) {
          throw new Error('Scanner container not found in DOM');
        }

        const scanner = new Html5Qrcode(SCANNER_ID, {
          formatsToSupport: BARCODE_FORMATS,
          useBarCodeDetectorIfSupported: true,
          verbose: false,
        });
        scannerRef.current = scanner;

        const containerWidth = el.offsetWidth || 350;
        const qrboxWidth = Math.min(containerWidth - 16, 380);
        const qrboxHeight = Math.round(qrboxWidth * 0.4);

        await scanner.start(
          cameraId,
          {
            fps: 15,
            qrbox: { width: qrboxWidth, height: qrboxHeight },
            aspectRatio: 1.333,
            disableFlip: false,
          },
          (decodedText) => {
            if (!mountedRef.current) return;
            onScan(decodedText);
            onOpenChange(false);
          },
          () => {}
        );

        if (mountedRef.current) setStarting(false);
      } catch (err) {
        if (mountedRef.current) {
          console.error('Barcode scanner error:', err);
          setError(
            err instanceof Error
              ? err.message
              : 'Could not access camera. Please allow camera permissions.'
          );
          setStarting(false);
        }
      }
    },
    [onScan, onOpenChange, stopScanner]
  );

  useEffect(() => {
    if (!open) return;

    mountedRef.current = true;
    setStarting(true);
    setError(null);

    const timeout = setTimeout(async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (!mountedRef.current) return;

        if (devices.length === 0) {
          setError('No camera found on this device.');
          setStarting(false);
          return;
        }

        setCameras(devices);

        const rearIndex = devices.findIndex(
          (d) =>
            d.label.toLowerCase().includes('back') ||
            d.label.toLowerCase().includes('rear') ||
            d.label.toLowerCase().includes('environment')
        );
        const selectedIndex = rearIndex >= 0 ? rearIndex : 0;
        setActiveCameraIndex(selectedIndex);

        await startWithCamera(devices[selectedIndex].id);
      } catch (err) {
        if (mountedRef.current) {
          console.error('Camera enumeration error:', err);
          setError(
            'Could not access camera. Please allow camera permissions in your browser settings.'
          );
          setStarting(false);
        }
      }
    }, 500);

    return () => {
      mountedRef.current = false;
      clearTimeout(timeout);
      stopScanner();
    };
  }, [open, startWithCamera, stopScanner]);

  const handleSwitchCamera = async () => {
    if (cameras.length <= 1) return;
    const nextIndex = (activeCameraIndex + 1) % cameras.length;
    setActiveCameraIndex(nextIndex);
    await startWithCamera(cameras[nextIndex].id);
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden [&>div:first-child]:hidden">
        <ResponsiveDialogHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <ResponsiveDialogTitle>Scan Barcode</ResponsiveDialogTitle>
            <div className="flex items-center gap-1">
              {cameras.length > 1 && !starting && !error && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleSwitchCamera}
                  title="Switch camera"
                >
                  <SwitchCamera className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </ResponsiveDialogHeader>

        <div className="px-4 pb-4">
          <div className="relative">
            <div
              id={SCANNER_ID}
              className="w-full rounded-lg overflow-hidden"
              style={{ minHeight: starting ? 250 : undefined }}
            />

            {starting && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/80 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </div>

          {error && (
            <div className="text-center py-8">
              <p className="text-sm text-destructive mb-4">{error}</p>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          )}

          {!starting && !error && (
            <p className="text-xs text-muted-foreground text-center mt-3">
              Hold the barcode steady inside the highlighted area
              {cameras.length > 1 && (
                <span className="block mt-1">
                  Camera: {cameras[activeCameraIndex]?.label || `Camera ${activeCameraIndex + 1}`}
                </span>
              )}
            </p>
          )}

          {onManualEntry && (
            <Button
              variant="ghost"
              className="w-full mt-3 text-muted-foreground"
              onClick={onManualEntry}
            >
              <Keyboard className="mr-2 h-4 w-4" />
              Type manually instead
            </Button>
          )}
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
