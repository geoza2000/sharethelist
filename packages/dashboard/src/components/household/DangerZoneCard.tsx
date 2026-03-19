import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useHouseholdMembers } from '@/hooks/queries/useHouseholdMembers';
import { useLeaveHousehold } from '@/hooks/mutations';
import { toast } from '@/hooks/useToast';
import { SectionCard } from '@/components/ui/section-card';
import { Button } from '@/components/ui/button';
import { LeaveHouseholdDialog } from './LeaveHouseholdDialog';
import { LogOut } from 'lucide-react';

interface DangerZoneCardProps {
  householdId: string;
  householdName: string;
  isOwner: boolean;
}

export function DangerZoneCard({ householdId, householdName, isOwner }: DangerZoneCardProps) {
  const navigate = useNavigate();
  const { signOut } = useAuthContext();
  const { data: members } = useHouseholdMembers(householdId);
  const leaveMutation = useLeaveHousehold();

  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const handleLeave = async () => {
    try {
      await leaveMutation.mutateAsync(householdId);
      toast({ title: 'You left the household' });
      navigate('/household/select', { replace: true });
    } catch {
      toast({ title: 'Failed to leave household', variant: 'destructive' });
    }
  };

  return (
    <>
      <SectionCard
        className="border-destructive/30"
        title={<span className="text-destructive">Danger Zone</span>}
        contentClassName="space-y-3"
      >
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => setShowLeaveDialog(true)}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Leave Household
        </Button>
        <Button
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </SectionCard>

      <LeaveHouseholdDialog
        open={showLeaveDialog}
        onOpenChange={setShowLeaveDialog}
        householdName={householdName}
        isOwner={isOwner}
        memberCount={members?.length ?? 1}
        isLeaving={leaveMutation.isPending}
        onConfirm={handleLeave}
      />
    </>
  );
}
