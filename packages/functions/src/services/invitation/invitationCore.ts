import * as crypto from 'crypto';
import { db } from '../../admin';
import type {
  Invitation,
  InvitationDocument,
  InvitationDetails,
} from '@supermarket-list/shared';
import { invitationToDocument, documentToInvitation } from '@supermarket-list/shared';
import { INVITATIONS_COLLECTION, DEFAULT_EXPIRY_HOURS, TOKEN_LENGTH } from './constants';

function generateToken(): string {
  return crypto.randomBytes(TOKEN_LENGTH).toString('base64url').slice(0, TOKEN_LENGTH);
}

export async function createInvitation(
  householdId: string,
  householdName: string,
  createdBy: string,
  maxUses: number = 1,
  expiryHours: number = DEFAULT_EXPIRY_HOURS
): Promise<Invitation> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiryHours * 60 * 60 * 1000);
  const docRef = db.collection(INVITATIONS_COLLECTION).doc();

  const invitation: Invitation = {
    invitationId: docRef.id,
    householdId,
    householdName,
    createdBy,
    token: generateToken(),
    expiresAt,
    maxUses,
    usedCount: 0,
    status: 'active',
    acceptedBy: [],
    createdAt: now,
  };

  await docRef.set(invitationToDocument(invitation));
  return invitation;
}

export async function getInvitationByToken(
  token: string
): Promise<Invitation | null> {
  const snapshot = await db
    .collection(INVITATIONS_COLLECTION)
    .where('token', '==', token)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  return documentToInvitation(snapshot.docs[0].data() as InvitationDocument);
}

export async function getInvitationDetails(
  token: string
): Promise<InvitationDetails | null> {
  const invitation = await getInvitationByToken(token);
  if (!invitation) return null;

  const now = new Date();
  const isExpired = invitation.status === 'expired' || now > invitation.expiresAt;
  const isFull = invitation.usedCount >= invitation.maxUses;

  return {
    householdName: invitation.householdName,
    status: isExpired ? 'expired' : invitation.status,
    isExpired,
    isFull,
  };
}

export async function acceptInvitation(
  token: string,
  userId: string
): Promise<{ householdId: string }> {
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(
      db.collection(INVITATIONS_COLLECTION).where('token', '==', token).limit(1)
    );

    if (snapshot.empty) {
      throw new Error('Invitation not found');
    }

    const docRef = snapshot.docs[0].ref;
    const invitation = documentToInvitation(
      snapshot.docs[0].data() as InvitationDocument
    );

    const now = new Date();

    if (invitation.status !== 'active') {
      throw new Error(`Invitation is ${invitation.status}`);
    }
    if (now > invitation.expiresAt) {
      transaction.update(docRef, { status: 'expired' });
      throw new Error('Invitation has expired');
    }
    if (invitation.usedCount >= invitation.maxUses) {
      transaction.update(docRef, { status: 'expired' });
      throw new Error('Invitation has been fully used');
    }

    const alreadyAccepted = invitation.acceptedBy.some(
      (a) => a.userId === userId
    );
    if (alreadyAccepted) {
      throw new Error('You have already accepted this invitation');
    }

    const newUsedCount = invitation.usedCount + 1;
    const newStatus = newUsedCount >= invitation.maxUses ? 'expired' : 'active';

    transaction.update(docRef, {
      usedCount: newUsedCount,
      status: newStatus,
      acceptedBy: [
        ...invitation.acceptedBy,
        { userId, acceptedAt: now.toISOString() },
      ],
    });

    return { householdId: invitation.householdId };
  });
}

export async function revokeInvitation(invitationId: string): Promise<void> {
  await db.collection(INVITATIONS_COLLECTION).doc(invitationId).update({
    status: 'revoked',
  });
}

export async function getInvitationById(
  invitationId: string
): Promise<Invitation | null> {
  const doc = await db
    .collection(INVITATIONS_COLLECTION)
    .doc(invitationId)
    .get();
  if (!doc.exists) return null;
  return documentToInvitation(doc.data() as InvitationDocument);
}
