import { useQuery } from '@tanstack/react-query';
import { callGetHouseholdMembers } from '@/lib/firebase';
import { queryKeys } from '@/lib/queryClient';

export function useHouseholdMembers(householdId: string | null) {
  return useQuery({
    queryKey: queryKeys.household.members(householdId ?? ''),
    queryFn: async () => {
      const result = await callGetHouseholdMembers({ householdId: householdId! });
      return result.data.members;
    },
    enabled: !!householdId,
  });
}
