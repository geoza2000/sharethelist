import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  callCreateInvitation,
  callAcceptInvitation,
  getHouseholdDoc,
} from '@/lib/firebase';
import { useHouseholdStore } from '@/stores';
import { queryKeys } from '@/lib/queryClient';

export function useCreateInvitation() {
  return useMutation({
    mutationFn: async ({
      householdId,
      maxUses,
      expiryHours,
    }: {
      householdId: string;
      maxUses?: number;
      expiryHours?: number;
    }) => {
      const result = await callCreateInvitation({ householdId, maxUses, expiryHours });
      return result.data;
    },
  });
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  const setActiveHousehold = useHouseholdStore((s) => s.setActiveHousehold);

  return useMutation({
    mutationFn: async (token: string) => {
      const result = await callAcceptInvitation({ token });
      return result.data;
    },
    onSuccess: async (data) => {
      const household = await getHouseholdDoc(data.householdId);
      setActiveHousehold(household);
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
  });
}
