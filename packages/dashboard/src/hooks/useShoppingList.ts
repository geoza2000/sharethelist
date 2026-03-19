import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, Collections, Subcollections } from '@/lib/firebase';
import type { ShoppingItemDocument } from '@supermarket-list/shared';

export function useShoppingList(householdId: string | null) {
  const [items, setItems] = useState<ShoppingItemDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!householdId) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const itemsRef = collection(
      db,
      Collections.HOUSEHOLDS,
      householdId,
      Subcollections.ITEMS
    );
    const q = query(itemsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newItems = snapshot.docs.map(
          (doc) => doc.data() as ShoppingItemDocument
        );
        setItems(newItems);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to shopping list:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [householdId]);

  const pendingItems = items.filter((i) => !i.completed);
  const completedItems = items.filter((i) => i.completed);

  const itemsByShop = pendingItems.reduce<Record<string, ShoppingItemDocument[]>>(
    (acc, item) => {
      const key = item.shopId || '__unassigned__';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {}
  );

  return {
    items,
    pendingItems,
    completedItems,
    itemsByShop,
    loading,
  };
}
