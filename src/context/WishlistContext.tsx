import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '@/src/lib/firebase';
import { useAuth } from './AuthContext';
import { Product } from '@/src/data';
import { playSound } from '@/src/lib/utils';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
}

interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  addedAt: any;
}

interface WishlistContextType {
  wishlistItems: string[]; // Array of product IDs
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
  error: string | null;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function handleFirestoreError(error: any, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo.error;
}

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [itemDocMap, setItemDocMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setWishlistItems([]);
      setItemDocMap({});
      setLoading(false);
      return;
    }

    setLoading(true);
    const path = 'wishlist';
    const q = query(
      collection(db, path),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ids: string[] = [];
      const map: Record<string, string> = {};
      snapshot.forEach((doc) => {
        const data = doc.data() as WishlistItem;
        if (data.productId) {
          ids.push(data.productId);
          map[data.productId] = doc.id;
        }
      });
      setWishlistItems(ids);
      setItemDocMap(map);
      setLoading(false);
      setError(null);
    }, (err) => {
      const errMsg = handleFirestoreError(err, OperationType.LIST, path);
      setError(errMsg);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleWishlist = async (product: Product) => {
    if (!user) {
      playSound('alert');
      alert('Please sign in to save items to your wishlist.');
      return;
    }

    const docId = itemDocMap[product.id];
    const path = 'wishlist';

    try {
      if (docId) {
        await deleteDoc(doc(db, path, docId));
        playSound('pop');
      } else {
        await addDoc(collection(db, path), {
          userId: user.uid,
          productId: product.id,
          addedAt: serverTimestamp()
        });
        playSound('success');
      }
    } catch (err) {
      const errMsg = handleFirestoreError(err, docId ? OperationType.DELETE : OperationType.CREATE, path);
      setError(errMsg);
      playSound('alert');
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist, loading, error }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
