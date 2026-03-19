import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateHousehold } from '@/hooks/mutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusCard } from '@/components/ui/status-card';
import { Loader2, ArrowLeft } from 'lucide-react';

export function CreateHouseholdPage() {
  const navigate = useNavigate();
  const createMutation = useCreateHousehold();
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createMutation.mutateAsync(name.trim());
      navigate('/');
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <StatusCard
          title="Create Household"
          description="Give your household a name. You can invite others to join later."
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Household Name</Label>
              <Input
                id="name"
                placeholder="e.g. Our Home, Family Shopping"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                autoFocus
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!name.trim() || createMutation.isPending}
            >
              {createMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Household
            </Button>
            {createMutation.isError && (
              <p className="text-sm text-destructive text-center">
                {createMutation.error?.message || 'Failed to create household'}
              </p>
            )}
          </form>
        </StatusCard>
      </div>
    </div>
  );
}
