import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  where, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '@/src/lib/firebase';
import { Product } from '@/src/data';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Config ---
export const subscribeToThemeConfig = (callback: (data: any) => void) => {
  const path = 'config/theme';
  return onSnapshot(doc(db, path), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

export const updateThemeConfig = async (updates: any) => {
  const path = 'config/theme';
  try {
    await setDoc(doc(db, path), updates, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const subscribeToBotConfig = (callback: (data: any) => void) => {
  const path = 'config/bot';
  return onSnapshot(doc(db, path), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

export const updateBotConfig = async (updates: any) => {
  const path = 'config/bot';
  try {
    await setDoc(doc(db, path), updates, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

// --- Products ---
export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  const path = 'products';
  return onSnapshot(collection(db, path), (snapshot) => {
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    callback(products);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  const path = 'products';
  try {
    const newProductRef = doc(collection(db, path));
    const productWithId = { ...product, id: newProductRef.id };
    await setDoc(newProductRef, productWithId);
    return newProductRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const deleteProduct = async (productId: string) => {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const updateProduct = async (productId: string, updates: Partial<Product>) => {
  const path = `products/${productId}`;
  try {
    await updateDoc(doc(db, 'products', productId), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

// --- Orders ---
export const subscribeToOrders = (callback: (orders: any[]) => void) => {
  const path = 'orders';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(orders);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

export const subscribeToUserOrders = (userId: string, callback: (orders: any[]) => void) => {
  const path = 'orders';
  const q = query(
    collection(db, path), 
    where('userId', '==', userId), 
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(orders);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

export const createOrder = async (orderData: any) => {
  const path = 'orders';
  try {
    const newOrderRef = doc(collection(db, path));
    await setDoc(newOrderRef, {
      ...orderData,
      createdAt: serverTimestamp(),
    });
    return newOrderRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const cancelOrder = async (orderId: string) => {
  const path = `orders/${orderId}`;
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status: 'cancelled',
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getOrder = async (orderId: string) => {
  const path = `orders/${orderId}`;
  try {
    const snapshot = await getDoc(doc(db, 'orders', orderId));
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

// --- Users ---
export const getUserProfile = async (uid: string) => {
  const path = `users/${uid}`;
  try {
    const snapshot = await getDoc(doc(db, 'users', uid));
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const syncUserProfile = async (uid: string, data: any) => {
  const path = `users/${uid}`;
  try {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

// --- Automations ---
export interface Automation {
  id: string;
  userId: string;
  name: string;
  description?: string;
  trigger: {
    type: 'time' | 'device' | 'voice' | 'email';
    value: string;
  };
  actions: {
    deviceName: string;
    command: string;
  }[];
  enabled: boolean;
  createdAt: any;
}

export const subscribeToAutomations = (userId: string, callback: (automations: Automation[]) => void) => {
  const path = 'automations';
  const q = query(collection(db, path), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const automations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Automation));
    callback(automations);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

export const createAutomation = async (automation: Omit<Automation, 'id' | 'createdAt'>) => {
  const path = 'automations';
  try {
    const newRef = doc(collection(db, path));
    await setDoc(newRef, {
      ...automation,
      createdAt: serverTimestamp()
    });
    return newRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateAutomation = async (id: string, updates: Partial<Automation>) => {
  const path = `automations/${id}`;
  try {
    await updateDoc(doc(db, 'automations', id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const deleteAutomation = async (id: string) => {
  const path = `automations/${id}`;
  try {
    await deleteDoc(doc(db, 'automations', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// --- Feedback ---
export const subscribeToFeedback = (callback: (feedback: any[]) => void) => {
  const path = 'feedback';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const feedback = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(feedback);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

export const deleteFeedback = async (id: string) => {
  const path = `feedback/${id}`;
  try {
    await deleteDoc(doc(db, 'feedback', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const createFeedback = async (data: any) => {
  const path = 'feedback';
  try {
    const newRef = doc(collection(db, path));
    await setDoc(newRef, {
      ...data,
      createdAt: serverTimestamp()
    });
    return newRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};
