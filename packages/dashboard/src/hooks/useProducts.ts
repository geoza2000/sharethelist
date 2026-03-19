import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, Collections, Subcollections } from '@/lib/firebase';
import type { ProductDocument } from '@supermarket-list/shared';

export function useProducts(householdId: string | null) {
  const [products, setProducts] = useState<ProductDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!householdId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const productsRef = collection(
      db,
      Collections.HOUSEHOLDS,
      householdId,
      Subcollections.PRODUCTS
    );
    const q = query(productsRef, orderBy('name'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newProducts = snapshot.docs.map(
          (doc) => doc.data() as ProductDocument
        );
        setProducts(newProducts);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to products:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [householdId]);

  return { products, loading };
}
