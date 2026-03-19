import { create } from 'zustand';
import type { HouseholdDocument } from '@supermarket-list/shared';

interface HouseholdState {
  activeHousehold: HouseholdDocument | null;
  setActiveHousehold: (household: HouseholdDocument | null) => void;
}

export const useHouseholdStore = create<HouseholdState>((set) => ({
  activeHousehold: null,
  setActiveHousehold: (household) => set({ activeHousehold: household }),
}));
