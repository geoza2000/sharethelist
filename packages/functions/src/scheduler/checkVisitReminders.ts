import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions/v2';
import { db } from '../admin';
import { SCHEDULER_CONFIG } from '../config';
import { HOUSEHOLDS_COLLECTION } from '../services/household/constants';
import {
  getShopsDueForVisit,
  updateShopLastNotified,
} from '../services/shop';
import { sendNotificationToUser } from '../services/notification';
import type { Household, HouseholdDocument } from '@supermarket-list/shared';
import { documentToHousehold } from '@supermarket-list/shared';

export const checkVisitRemindersFn = onSchedule(
  { ...SCHEDULER_CONFIG, schedule: 'every 1 hours' },
  async () => {
    const now = new Date();
    logger.info('Starting visit reminder check', { timestamp: now.toISOString() });

    const householdsSnapshot = await db.collection(HOUSEHOLDS_COLLECTION).get();

    if (householdsSnapshot.empty) {
      logger.info('No households found, skipping');
      return;
    }

    let totalNotifications = 0;

    for (const doc of householdsSnapshot.docs) {
      const household: Household = documentToHousehold(
        doc.data() as HouseholdDocument
      );

      try {
        const dueShops = await getShopsDueForVisit(household.householdId, now);

        if (dueShops.length === 0) continue;

        const shopNames = dueShops.map((s) => s.shop.name);
        const title = dueShops.length === 1
          ? `Time to visit ${shopNames[0]}`
          : `${dueShops.length} shops are due for a visit`;
        const body = dueShops.length === 1
          ? `Your scheduled visit to ${shopNames[0]} is overdue`
          : `Shops due: ${shopNames.join(', ')}`;

        const notificationPromises = household.memberIds.map((memberId) =>
          sendNotificationToUser(memberId, {
            title,
            body,
            type: 'visit_reminder',
            deepLink: '/',
            data: {
              householdId: household.householdId,
              shopIds: dueShops.map((s) => s.shop.shopId).join(','),
            },
          })
        );

        await Promise.all(notificationPromises);

        const markNotifiedPromises = dueShops.map((s) =>
          updateShopLastNotified(household.householdId, s.shop.shopId)
        );
        await Promise.all(markNotifiedPromises);

        totalNotifications += household.memberIds.length * dueShops.length;

        logger.info('Sent visit reminders for household', {
          householdId: household.householdId,
          shopCount: dueShops.length,
          memberCount: household.memberIds.length,
        });
      } catch (error) {
        logger.error('Failed to process visit reminders for household', {
          householdId: household.householdId,
          error: error instanceof Error ? error.message : error,
        });
      }
    }

    logger.info('Visit reminder check complete', { totalNotifications });
  }
);
