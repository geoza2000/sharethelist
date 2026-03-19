import { z } from 'zod';

export type VisitPeriodUnit = 'days' | 'weeks' | 'months';

export interface VisitPeriod {
  value: number;
  unit: VisitPeriodUnit;
}

export interface Shop {
  shopId: string;
  householdId: string;
  name: string;
  visitPeriod: VisitPeriod | null;
  lastVisitedAt: Date | null;
  lastNotifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopDocument {
  shopId: string;
  householdId: string;
  name: string;
  visitPeriod: VisitPeriod | null;
  lastVisitedAt: string | null;
  lastNotifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ShopAction = 'create' | 'update' | 'delete';

export interface CreateShopInput {
  householdId: string;
  name: string;
  visitPeriod?: VisitPeriod | null;
}

export interface UpdateShopInput {
  householdId: string;
  shopId: string;
  name?: string;
  visitPeriod?: VisitPeriod | null;
}

export interface DeleteShopInput {
  householdId: string;
  shopId: string;
}

export type ManageShopInput =
  | { action: 'create'; data: CreateShopInput }
  | { action: 'update'; data: UpdateShopInput }
  | { action: 'delete'; data: DeleteShopInput };

const VisitPeriodSchema = z.object({
  value: z.number().int().min(1).max(365),
  unit: z.enum(['days', 'weeks', 'months']),
});

export const CreateShopSchema = z.object({
  householdId: z.string().min(1),
  name: z.string().min(1).max(100).trim(),
  visitPeriod: VisitPeriodSchema.nullable().optional(),
});

export const UpdateShopSchema = z.object({
  householdId: z.string().min(1),
  shopId: z.string().min(1),
  name: z.string().min(1).max(100).trim().optional(),
  visitPeriod: VisitPeriodSchema.nullable().optional(),
});

export const DeleteShopSchema = z.object({
  householdId: z.string().min(1),
  shopId: z.string().min(1),
});

export const ManageShopSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('create'), data: CreateShopSchema }),
  z.object({ action: z.literal('update'), data: UpdateShopSchema }),
  z.object({ action: z.literal('delete'), data: DeleteShopSchema }),
]);

export function shopToDocument(shop: Shop): ShopDocument {
  return {
    ...shop,
    lastVisitedAt: shop.lastVisitedAt?.toISOString() ?? null,
    lastNotifiedAt: shop.lastNotifiedAt?.toISOString() ?? null,
    createdAt: shop.createdAt.toISOString(),
    updatedAt: shop.updatedAt.toISOString(),
  };
}

export function documentToShop(doc: ShopDocument): Shop {
  return {
    ...doc,
    lastVisitedAt: doc.lastVisitedAt ? new Date(doc.lastVisitedAt) : null,
    lastNotifiedAt: doc.lastNotifiedAt ? new Date(doc.lastNotifiedAt) : null,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
  };
}
