import { z } from 'zod';

export type InvitationStatus = 'active' | 'expired' | 'revoked';

export interface InvitationAcceptance {
  userId: string;
  acceptedAt: string;
}

export interface Invitation {
  invitationId: string;
  householdId: string;
  householdName: string;
  createdBy: string;
  token: string;
  expiresAt: Date;
  maxUses: number;
  usedCount: number;
  status: InvitationStatus;
  acceptedBy: InvitationAcceptance[];
  createdAt: Date;
}

export interface InvitationDocument {
  invitationId: string;
  householdId: string;
  householdName: string;
  createdBy: string;
  token: string;
  expiresAt: string;
  maxUses: number;
  usedCount: number;
  status: InvitationStatus;
  acceptedBy: InvitationAcceptance[];
  createdAt: string;
}

export interface CreateInvitationInput {
  householdId: string;
  maxUses?: number;
  expiryHours?: number;
}

export interface AcceptInvitationInput {
  token: string;
}

export interface RevokeInvitationInput {
  invitationId: string;
}

export interface GetInvitationDetailsInput {
  token: string;
}

export interface InvitationDetails {
  householdName: string;
  status: InvitationStatus;
  isExpired: boolean;
  isFull: boolean;
}

export const CreateInvitationSchema = z.object({
  householdId: z.string().min(1),
  maxUses: z.number().int().min(1).max(50).nullish().transform((v) => v ?? undefined),
  expiryHours: z.number().int().min(1).max(720).nullish().transform((v) => v ?? undefined),
});

export const AcceptInvitationSchema = z.object({
  token: z.string().min(1),
});

export const RevokeInvitationSchema = z.object({
  invitationId: z.string().min(1),
});

export const GetInvitationDetailsSchema = z.object({
  token: z.string().min(1),
});

export function invitationToDocument(inv: Invitation): InvitationDocument {
  return {
    ...inv,
    expiresAt: inv.expiresAt.toISOString(),
    createdAt: inv.createdAt.toISOString(),
  };
}

export function documentToInvitation(doc: InvitationDocument): Invitation {
  return {
    ...doc,
    expiresAt: new Date(doc.expiresAt),
    createdAt: new Date(doc.createdAt),
  };
}
