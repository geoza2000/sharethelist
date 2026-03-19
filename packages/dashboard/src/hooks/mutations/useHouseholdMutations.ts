import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  callCreateHousehold,
  callUpdateHousehold,
  callLeaveHousehold,
  callSetActiveHousehold,
  getHouseholdDoc,
} from '@/lib/firebase';
import { useHouseholdStore } from '@/stores';
import { queryKeys } from '@/lib/queryClient';

export function useCreateHousehold() {
  const queryClient = useQueryClient();
  const setActiveHousehold = useHouseholdStore((s) => s.setActiveHousehold);

  return useMutation({
    mutationFn: async (name: string) => {
      const result = await callCreateHousehold({ name });
      return result.data;
    },
    onSuccess: async (data) => {
      const household = await getHouseholdDoc(data.householdId);
      setActiveHousehold(household);
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
  });
}

export function useUpdateHousehold() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ householdId, name }: { householdId: string; name: string }) => {
      const result = await callUpdateHousehold({ householdId, name });
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['household'] });
    },
  });
}

export function useLeaveHousehold() {
  const queryClient = useQueryClient();
  const setActiveHousehold = useHouseholdStore((s) => s.setActiveHousehold);

  return useMutation({
    mutationFn: async (householdId: string) => {
      const result = await callLeaveHousehold({ householdId });
      return result.data;
    },
    onSuccess: () => {
      setActiveHousehold(null);
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
  });
}

export function useSetActiveHousehold() {
  const queryClient = useQueryClient();
  const setActiveHousehold = useHouseholdStore((s) => s.setActiveHousehold);

  return useMutation({
    mutationFn: async (householdId: string) => {
      const [, household] = await Promise.all([
        callSetActiveHousehold({ householdId }),
        getHouseholdDoc(householdId),
      ]);
      return household;
    },
    onSuccess: (data) => {
      setActiveHousehold(data);
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
  });
}
