import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useSetActiveHousehold } from '@/hooks/mutations';
import { getHouseholdDoc } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Home, LogOut, Check } from 'lucide-react';
import type { HouseholdDocument } from '@supermarket-list/shared';

export function HouseholdSelectPage() {
  const { profile, signOut } = useAuthContext();
  const navigate = useNavigate();
  const setActiveMutation = useSetActiveHousehold();
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [households, setHouseholds] = useState<Record<string, HouseholdDocument>>({});
  const [loadingHouseholds, setLoadingHouseholds] = useState(true);

  const householdIds = profile?.householdIds ?? [];

  useEffect(() => {
    if (householdIds.length === 0) {
      setLoadingHouseholds(false);
      return;
    }

    let cancelled = false;
    setLoadingHouseholds(true);

    Promise.all(
      householdIds.map(async (id) => {
        try {
          const data = await getHouseholdDoc(id);
          return [id, data] as const;
        } catch {
          return [id, null] as const;
        }
      })
    ).then((results) => {
      if (cancelled) return;
      const map: Record<string, HouseholdDocument> = {};
      for (const [id, data] of results) {
        if (data) map[id] = data;
      }
      setHouseholds(map);
      setLoadingHouseholds(false);
    });

    return () => { cancelled = true; };
  }, [householdIds.join(',')]);

  const handleSelect = async (householdId: string) => {
    setSelectingId(householdId);
    try {
      await setActiveMutation.mutateAsync(householdId);
      navigate('/');
    } catch {
      setSelectingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Your Households</h1>
            <p className="text-muted-foreground">
              {householdIds.length > 0
                ? 'Select a household or create a new one'
                : 'Create your first household to get started'}
            </p>
          </div>

          {householdIds.length > 0 && (
            <div className="space-y-3">
              {householdIds.map((id) => {
                const household = households[id];
                const isActive = profile?.activeHouseholdId === id;

                return (
                  <Card
                    key={id}
                    className={`cursor-pointer transition-colors hover:bg-accent ${
                      isActive ? 'border-primary' : ''
                    }`}
                    onClick={() => handleSelect(id)}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <Home className="h-5 w-5 text-muted-foreground" />
                        {loadingHouseholds ? (
                          <Skeleton className="h-5 w-32" />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {household?.name ?? id}
                            </span>
                            {isActive && (
                              <Badge variant="secondary" className="text-xs">
                                <Check className="mr-1 h-3 w-3" />
                                Active
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      {selectingId === id && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="space-y-3">
            <Button
              className="w-full"
              size="lg"
              onClick={() => navigate('/household/new')}
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Household
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
