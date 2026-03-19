import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../../admin';
import type {
  Household,
  HouseholdDocument,
  CreateHouseholdInput,
} from '@supermarket-list/shared';
import { householdToDocument, documentToHousehold } from '@supermarket-list/shared';
import { HOUSEHOLDS_COLLECTION } from './constants';
import { USERS_COLLECTION } from '../user/constants';

export async function createHousehold(
  input: CreateHouseholdInput,
  ownerId: string
): Promise<Household> {
  const now = new Date();
  const docRef = db.collection(HOUSEHOLDS_COLLECTION).doc();

  const household: Household = {
    householdId: docRef.id,
    name: input.name,
    ownerId,
    memberIds: [ownerId],
    plan: 'free',
    createdAt: now,
    updatedAt: now,
  };

  const batch = db.batch();
  batch.set(docRef, householdToDocument(household));
  batch.update(db.collection(USERS_COLLECTION).doc(ownerId), {
    householdIds: FieldValue.arrayUnion(docRef.id),
    activeHouseholdId: docRef.id,
    updatedAt: now.toISOString(),
  });
  await batch.commit();

  return household;
}

export async function getHouseholdById(
  householdId: string
): Promise<Household | null> {
  const doc = await db.collection(HOUSEHOLDS_COLLECTION).doc(householdId).get();
  if (!doc.exists) return null;
  return documentToHousehold(doc.data() as HouseholdDocument);
}

export async function updateHouseholdName(
  householdId: string,
  name: string
): Promise<void> {
  await db.collection(HOUSEHOLDS_COLLECTION).doc(householdId).update({
    name,
    updatedAt: new Date().toISOString(),
  });
}

export async function addMemberToHousehold(
  householdId: string,
  userId: string
): Promise<void> {
  const now = new Date().toISOString();
  const batch = db.batch();

  batch.update(db.collection(HOUSEHOLDS_COLLECTION).doc(householdId), {
    memberIds: FieldValue.arrayUnion(userId),
    updatedAt: now,
  });

  batch.update(db.collection(USERS_COLLECTION).doc(userId), {
    householdIds: FieldValue.arrayUnion(householdId),
    activeHouseholdId: householdId,
    updatedAt: now,
  });

  await batch.commit();
}

export async function removeMemberFromHousehold(
  householdId: string,
  userId: string
): Promise<void> {
  const now = new Date().toISOString();
  const batch = db.batch();

  batch.update(db.collection(HOUSEHOLDS_COLLECTION).doc(householdId), {
    memberIds: FieldValue.arrayRemove(userId),
    updatedAt: now,
  });

  batch.update(db.collection(USERS_COLLECTION).doc(userId), {
    householdIds: FieldValue.arrayRemove(householdId),
    updatedAt: now,
  });

  await batch.commit();
}

export async function transferOwnership(
  householdId: string,
  newOwnerId: string
): Promise<void> {
  await db.collection(HOUSEHOLDS_COLLECTION).doc(householdId).update({
    ownerId: newOwnerId,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteHousehold(householdId: string): Promise<void> {
  const household = await getHouseholdById(householdId);
  if (!household) return;

  const batch = db.batch();
  batch.delete(db.collection(HOUSEHOLDS_COLLECTION).doc(householdId));

  for (const memberId of household.memberIds) {
    batch.update(db.collection(USERS_COLLECTION).doc(memberId), {
      householdIds: FieldValue.arrayRemove(householdId),
      updatedAt: new Date().toISOString(),
    });
  }

  await batch.commit();
}

export function isHouseholdMember(
  household: Household,
  userId: string
): boolean {
  return household.memberIds.includes(userId);
}

export function isHouseholdOwner(
  household: Household,
  userId: string
): boolean {
  return household.ownerId === userId;
}
