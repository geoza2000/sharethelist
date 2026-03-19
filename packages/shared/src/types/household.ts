import { z } from 'zod';

export type HouseholdPlan = 'free';

export interface Household {
  householdId: string;
  name: string;
  ownerId: string;
  memberIds: string[];
  plan: HouseholdPlan;
  createdAt: Date;
  updatedAt: Date;
}

export interface HouseholdDocument {
  householdId: string;
  name: string;
  ownerId: string;
  memberIds: string[];
  plan: HouseholdPlan;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHouseholdInput {
  name: string;
}

export interface UpdateHouseholdInput {
  householdId: string;
  name: string;
}

export interface LeaveHouseholdInput {
  householdId: string;
}

export interface SetActiveHouseholdInput {
  householdId: string;
}

export interface HouseholdMember {
  userId: string;
  displayName: string | null;
  photoUrl: string | null;
  email: string | null;
}

export const CreateHouseholdSchema = z.object({
  name: z.string().min(1).max(100).trim(),
});

export const UpdateHouseholdSchema = z.object({
  householdId: z.string().min(1),
  name: z.string().min(1).max(100).trim(),
});

export const LeaveHouseholdSchema = z.object({
  householdId: z.string().min(1),
});

export const SetActiveHouseholdSchema = z.object({
  householdId: z.string().min(1),
});

export function householdToDocument(household: Household): HouseholdDocument {
  return {
    ...household,
    createdAt: household.createdAt.toISOString(),
    updatedAt: household.updatedAt.toISOString(),
  };
}

export function documentToHousehold(doc: HouseholdDocument): Household {
  return {
    ...doc,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
  };
}
