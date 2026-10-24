import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';

export const sendOrderNotifications = async (orderId: string, userEmail: string, orderTotal: number, userPhone?: string) => {
  const adminEmail = 'pnishalsam@gmail.com';
  const whatsappNumber = userPhone || '9080240408';

  try {
    // 1. Alert to Admin (WhatsApp Mock)
    const whatsappRef = await addDoc(collection(db, 'notifications'), {
      type: 'whatsapp',
      target: whatsappNumber,
      message: `System Alert: New order #${orderId.slice(-6)} received. Total: ₹${orderTotal.toLocaleString('en-IN')}. Check Admin Console immediately.`,
      status: 'queued',
      orderId,
      createdAt: serverTimestamp()
    });

    // 2. Alert to User (Email Bill Mock)
    const emailRef = await addDoc(collection(db, 'notifications'), {
      type: 'email',
      target: userEmail,
      message: `Order Receipt: Your Aitopia order #${orderId.slice(-6)} has been initialized. Total Amount: ₹${orderTotal.toLocaleString('en-IN')}. Deployment in progress.`,
      status: 'queued',
      orderId,
      createdAt: serverTimestamp()
    });

    // 3. Alert to Admin (Email Bill Mock)
    await addDoc(collection(db, 'notifications'), {
      type: 'email',
      target: adminEmail,
      message: `Admin Notification: Order #${orderId.slice(-6)} placed by ${userEmail}. Sync nodes allocated.`,
      status: 'queued',
      orderId,
      createdAt: serverTimestamp()
    });

    console.log(`[Notification Service] Dispatched 3 signals for order ${orderId}`);

    // REAL TRANSMISSION VIA BACKEND
    const dispatchRealSignal = async (type: 'email' | 'whatsapp' | 'zapier', target: string, message: string, payload?: any) => {
      try {
        const response = await fetch('/api/notifications/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, target, message, orderId, payload })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        console.log(`%c[CORE] Signal ${type} deployed`, 'color: #22d3ee; font-weight: bold;');
      } catch (err: any) {
        console.warn(`%c[CORE] Signal ${type} failed: ${err.message}`, 'color: #ef4444; font-weight: bold;');
      }
    };

    // Trigger transmissions
    const receiptMessage = `Order Receipt: Your Aitopia order #${orderId.slice(-6)} has been initialized. Total Amount: ₹${orderTotal.toLocaleString('en-IN')}. Deployment in progress.`;
    const adminAlertMessage = `Admin Alert: New order #${orderId.slice(-6)} placed by ${userEmail}. Total Amount: ₹${orderTotal.toLocaleString('en-IN')}. Verify node allocation in Admin Console.`;

    const payload = {
      orderId,
      email: userEmail,
      total: orderTotal,
      whatsapp: whatsappNumber
    };

    dispatchRealSignal('email', userEmail, receiptMessage, payload);
    dispatchRealSignal('email', adminEmail || 'pnishalsam@gmail.com', adminAlertMessage, payload);
    dispatchRealSignal('whatsapp', whatsappNumber, `System Alert: New order #${orderId.slice(-6)} received. Total: ₹${orderTotal.toLocaleString('en-IN')}. Check Admin Console immediately.`, payload);

  } catch (error) {
    console.error('Failed to dispatch notifications:', error);
  }
};
