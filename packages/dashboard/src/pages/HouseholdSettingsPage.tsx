import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useHouseholdStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  HouseholdNameCard,
  InviteMembersCard,
  MembersCard,
  DangerZoneCard,
} from '@/components/household';
import { ArrowLeft, ArrowRightLeft } from 'lucide-react';

export function HouseholdSettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const activeHousehold = useHouseholdStore((s) => s.activeHousehold);
  const householdId = activeHousehold?.householdId ?? null;
  const isOwner = activeHousehold?.ownerId === user?.uid;

  if (!activeHousehold || !householdId) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-bold text-lg">Household Settings</h1>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24 max-w-lg mx-auto w-full space-y-4">
        <HouseholdNameCard
          householdId={householdId}
          name={activeHousehold.name}
          isOwner={isOwner}
        />

        <InviteMembersCard
          householdId={householdId}
          householdName={activeHousehold.name}
        />

        <MembersCard
          householdId={householdId}
          ownerId={activeHousehold.ownerId}
        />

        <Card>
          <CardContent className="pt-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/household/select')}
            >
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Switch Household
            </Button>
          </CardContent>
        </Card>

        <Separator />

        <DangerZoneCard
          householdId={householdId}
          householdName={activeHousehold.name}
          isOwner={isOwner}
        />
      </main>
    </div>
  );
}
