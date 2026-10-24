import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Truck, CheckCircle2, Clock, ChevronRight, ShoppingBag, ExternalLink, XCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { subscribeToUserOrders, cancelOrder } from '@/src/services/db';
import { cn, playSound } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

const StatusBadge = ({ status }: { status: string }) => {
  const configs = {
    pending: { color: 'text-amber-400 bg-amber-400/10', icon: Clock },
    processing: { color: 'text-primary bg-primary/10', icon: Package },
    shipped: { color: 'text-indigo-400 bg-indigo-400/10', icon: Truck },
    delivered: { color: 'text-emerald-400 bg-emerald-400/10', icon: CheckCircle2 },
    cancelled: { color: 'text-slate-500 bg-slate-500/10', icon: XCircle },
  };

  const config = configs[status as keyof typeof configs] || configs.pending;
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", config.color)}>
      <Icon size={12} />
      {status}
    </div>
  );
};

export const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToUserOrders(user.uid, (fetchedOrders) => {
        setOrders(fetchedOrders);
        setLoading(false);
      });
      return unsubscribe;
    }
  }, [user]);

  const handleCancelClick = (orderId: string) => {
    setCancellingId(orderId);
    playSound('click');
  };

  const confirmCancel = async () => {
    if (cancellingId) {
      await cancelOrder(cancellingId);
      setCancellingId(null);
      playSound('success');
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-6 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] animate-pulse">Syncing Records...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-12 rounded-[3rem] border-white/5"
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            <ShoppingBag size={40} />
          </div>
          <h1 className="text-3xl font-display font-bold text-white italic mb-4">No Neural Logistics Found</h1>
          <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto leading-relaxed uppercase tracking-widest font-bold">
            Your transaction history is empty. Synchronize your space with our hardware nodes to begin.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-2xl glow-primary hover:scale-105 active:scale-95 transition-all"
            onClick={() => playSound('click')}
          >
            Terminal Home <ExternalLink size={14} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold text-white italic flex items-center gap-4">
          Order <span className="text-primary">History</span>
        </h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Logistics Repository Node 44-X</p>
      </div>

      <div className="space-y-6">
        <AnimatePresence initial={false}>
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass p-8 rounded-[2.5rem] border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-primary border border-primary/20 shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                    <Package size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-bold uppercase text-xs tracking-wider">#{order.id.slice(-8).toUpperCase()}</h3>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                      Initialized: {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }) : 'Processing...'}
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex -space-x-3">
                        {order.items.slice(0, 3).map((item: any, i: number) => (
                          <div key={i} className="w-10 h-10 rounded-xl glass border border-white/10 overflow-hidden shadow-xl ring-2 ring-black">
                            <img src={item.image || null} className="w-full h-full object-cover grayscale" alt={item.name} />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-[8px] font-bold text-slate-400 bg-black/60 shadow-xl ring-2 ring-black">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                        {order.items.length} Node{order.items.length > 1 ? 's' : ''} Synced
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-3">
                  <div className="text-2xl font-display font-bold text-white italic">
                    ₹{order.total.toLocaleString('en-IN')}
                  </div>
                  <div className="flex flex-col gap-2 md:items-end">
                    <Link 
                      to={`/invoice/${order.id}`}
                      className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all"
                      onClick={() => playSound('click')}
                    >
                      Neural Receipt <ExternalLink size={12} />
                    </Link>
                    <Link 
                      to={`/track/${order.id}`}
                      className="flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-widest hover:gap-3 transition-all"
                      onClick={() => playSound('click')}
                    >
                      View Status <ChevronRight size={14} />
                    </Link>
                    {(order.status === 'pending' || order.status === 'processing') && (
                      <button 
                        onClick={() => handleCancelClick(order.id)}
                        className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-all"
                      >
                         Deconstruct Sync <XCircle size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Cancellation Confirmation Modal */}
      <AnimatePresence>
        {cancellingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancellingId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass p-10 rounded-[3rem] border-accent/20"
            >
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-2xl font-display font-bold text-white italic mb-4">Deconstruct Neural Sync?</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 uppercase tracking-widest font-bold">
                Warning: Terminating this synchronization will permanently halt the hardware node allocation. This action is irreversible.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setCancellingId(null)}
                  className="flex-1 py-4 glass border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-white/5 transition-all"
                >
                  Maintain Link
                </button>
                <button 
                  onClick={confirmCancel}
                  className="flex-1 py-4 bg-accent text-black text-[10px] font-bold uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:scale-105 active:scale-95 transition-all"
                >
                  Confirm Terminate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
