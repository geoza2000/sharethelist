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

interface LeaveHouseholdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  householdName: string;
  isOwner: boolean;
  memberCount: number;
  isLeaving: boolean;
  onConfirm: () => void;
}

export function LeaveHouseholdDialog({
  open,
  onOpenChange,
  householdName,
  isOwner,
  memberCount,
  isLeaving,
  onConfirm,
}: LeaveHouseholdDialogProps) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Leave Household</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Are you sure you want to leave <strong>{householdName}</strong>?
            {isOwner && memberCount > 1 && (
              <> Ownership will be transferred to another member.</>
            )}
            {isOwner && memberCount <= 1 && (
              <> You are the only member — the household will be deleted.</>
            )}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ResponsiveDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLeaving}
          >
            {isLeaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Leave
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
