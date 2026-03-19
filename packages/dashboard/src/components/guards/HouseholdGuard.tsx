import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useHouseholdStore } from '@/stores';
import { getHouseholdDoc } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

export function HouseholdGuard({ children }: { children: React.ReactNode }) {
  const { profile } = useAuthContext();
  const activeHousehold = useHouseholdStore((s) => s.activeHousehold);
  const setActiveHousehold = useHouseholdStore((s) => s.setActiveHousehold);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) return;

    if (!profile.activeHouseholdId || profile.householdIds.length === 0) {
      navigate('/household/select', { replace: true });
      return;
    }

    if (!activeHousehold && profile.activeHouseholdId) {
      getHouseholdDoc(profile.activeHouseholdId)
        .then((household) => {
          if (household) setActiveHousehold(household);
          else navigate('/household/select', { replace: true });
        })
        .catch(() => navigate('/household/select', { replace: true }));
    }
  }, [profile, activeHousehold, setActiveHousehold, navigate]);

  if (!activeHousehold) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
