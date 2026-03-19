import { useState } from 'react';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CloseSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shopName: string;
  shopId: string | null;
  completedCount: number;
  pendingCount: number;
  onCloseSession: (shopId: string | null) => Promise<void>;
}

export function CloseSessionDialog({
  open,
  onOpenChange,
  shopName,
  shopId,
  completedCount,
  pendingCount,
  onCloseSession,
}: CloseSessionDialogProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseSession = async () => {
    setIsClosing(true);
    try {
      await onCloseSession(shopId);
    } finally {
      setIsClosing(false);
      onOpenChange(false);
    }
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Close Shopping Session</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {completedCount} item{completedCount !== 1 ? 's' : ''} completed
            {pendingCount > 0 && (
              <>, {pendingCount} remaining (will stay on the list)</>
            )}
            . Close session for <strong>{shopName}</strong>?
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ResponsiveDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCloseSession} disabled={isClosing}>
            {isClosing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Close Session
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
