import { useState } from 'react';
import { useHouseholdStore } from '@/stores';
import { useUpdateHousehold } from '@/hooks/mutations';
import { toast } from '@/hooks/useToast';
import { SectionCard } from '@/components/ui/section-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Loader2, Check, X } from 'lucide-react';

interface HouseholdNameCardProps {
  householdId: string;
  name: string;
  isOwner: boolean;
}

export function HouseholdNameCard({ householdId, name, isOwner }: HouseholdNameCardProps) {
  const setActiveHousehold = useHouseholdStore((s) => s.setActiveHousehold);
  const activeHousehold = useHouseholdStore((s) => s.activeHousehold);
  const updateMutation = useUpdateHousehold();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(name);

  const handleSave = async () => {
    if (!nameInput.trim()) return;
    try {
      await updateMutation.mutateAsync({ householdId, name: nameInput.trim() });
      setActiveHousehold({
        ...activeHousehold!,
        name: nameInput.trim(),
        updatedAt: new Date().toISOString(),
      });
      setIsEditing(false);
      toast({ title: 'Household name updated' });
    } catch {
      toast({ title: 'Failed to update name', variant: 'destructive' });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNameInput(name);
  };

  return (
    <SectionCard icon={<Pencil className="h-4 w-4" />} title="Household Name">
      {isEditing ? (
        <div className="flex gap-2">
          <Input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            autoFocus
            maxLength={100}
          />
          <Button
            size="icon"
            onClick={handleSave}
            disabled={updateMutation.isPending || !nameInput.trim()}
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </Button>
          <Button size="icon" variant="ghost" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="font-medium text-lg">{name}</span>
          {isOwner && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setNameInput(name);
                setIsEditing(true);
              }}
            >
              <Pencil className="mr-1 h-3.5 w-3.5" />
              Edit
            </Button>
          )}
        </div>
      )}
      {!isOwner && (
        <p className="text-xs text-muted-foreground mt-1">
          Only the household owner can change the name.
        </p>
      )}
    </SectionCard>
  );
}
