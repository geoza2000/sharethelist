import { useState } from 'react';
import { useCreateInvitation } from '@/hooks/mutations';
import { toast } from '@/hooks/useToast';
import { SectionCard } from '@/components/ui/section-card';
import { Button } from '@/components/ui/button';
import { Copy, Share2, Link2, Loader2, UserPlus } from 'lucide-react';

interface InviteMembersCardProps {
  householdId: string;
  householdName: string;
}

export function InviteMembersCard({ householdId, householdName }: InviteMembersCardProps) {
  const createMutation = useCreateInvitation();
  const [inviteToken, setInviteToken] = useState<string | null>(null);

  const inviteLink = inviteToken
    ? `${window.location.origin}/join/${inviteToken}`
    : null;

  const handleCreate = async () => {
    try {
      const result = await createMutation.mutateAsync({ householdId });
      setInviteToken(result.token);
    } catch {
      toast({ title: 'Failed to create invite link', variant: 'destructive' });
    }
  };

  const handleCopy = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast({ title: 'Link copied to clipboard' });
    } catch {
      toast({ title: 'Failed to copy link', variant: 'destructive' });
    }
  };

  const handleShare = async () => {
    if (!inviteLink) return;
    try {
      await navigator.share({
        title: `Join ${householdName}`,
        text: `Join my household "${householdName}" on Supermarket List!`,
        url: inviteLink,
      });
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        handleCopy();
      }
    }
  };

  return (
    <SectionCard
      icon={<UserPlus className="h-4 w-4" />}
      title="Invite Members"
      description="Create a link to invite others to this household."
      contentClassName="space-y-3"
    >
      {inviteLink ? (
        <>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm truncate flex-1 font-mono">{inviteLink}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            This link expires in 72 hours and can be used once.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            {typeof navigator.share === 'function' && (
              <Button className="flex-1" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => {
              setInviteToken(null);
              handleCreate();
            }}
          >
            Generate new link
          </Button>
        </>
      ) : (
        <Button
          onClick={handleCreate}
          disabled={createMutation.isPending}
          className="w-full"
        >
          {createMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          <UserPlus className="mr-2 h-4 w-4" />
          Create Invite Link
        </Button>
      )}
    </SectionCard>
  );
}
