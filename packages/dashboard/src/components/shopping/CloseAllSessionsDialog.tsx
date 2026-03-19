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

interface CloseAllSessionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  completedCount: number;
  pendingCount: number;
  isClosing: boolean;
  onConfirm: () => void;
}

export function CloseAllSessionsDialog({
  open,
  onOpenChange,
  completedCount,
  pendingCount,
  isClosing,
  onConfirm,
}: CloseAllSessionsDialogProps) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Close All Sessions</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Remove all {completedCount} completed item
            {completedCount !== 1 ? 's' : ''} and update last visited
            dates for all shops. {pendingCount} uncompleted item
            {pendingCount !== 1 ? 's' : ''} will remain.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ResponsiveDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isClosing}>
            {isClosing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Close All Sessions
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
