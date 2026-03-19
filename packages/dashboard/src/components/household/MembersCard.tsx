import { useAuthContext } from '@/contexts/AuthContext';
import { useHouseholdMembers } from '@/hooks/queries/useHouseholdMembers';
import { SectionCard } from '@/components/ui/section-card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Crown } from 'lucide-react';

interface MembersCardProps {
  householdId: string;
  ownerId: string;
}

function getInitials(name: string | null, email: string | null): string {
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) return email[0].toUpperCase();
  return '?';
}

export function MembersCard({ householdId, ownerId }: MembersCardProps) {
  const { user } = useAuthContext();
  const { data: members, isLoading } = useHouseholdMembers(householdId);

  return (
    <SectionCard
      icon={<Users className="h-4 w-4" />}
      title={
        <>
          Members
          {members && (
            <Badge variant="secondary" className="text-xs">
              {members.length}
            </Badge>
          )}
        </>
      }
    >
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {members?.map((member) => (
            <div key={member.userId} className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                {member.photoUrl && <AvatarImage src={member.photoUrl} />}
                <AvatarFallback>
                  {getInitials(member.displayName, member.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">
                    {member.displayName || member.email || 'Unknown'}
                  </span>
                  {member.userId === ownerId && (
                    <Badge variant="default" className="text-xs shrink-0">
                      <Crown className="mr-1 h-3 w-3" />
                      Owner
                    </Badge>
                  )}
                  {member.userId === user?.uid && (
                    <Badge variant="secondary" className="text-xs shrink-0">
                      You
                    </Badge>
                  )}
                </div>
                {member.email && member.displayName && (
                  <p className="text-xs text-muted-foreground truncate">
                    {member.email}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
