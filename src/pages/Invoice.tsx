import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { getOrder } from '@/src/services/db';
import { Package, Printer, ChevronLeft, Download, ShieldCheck, Zap, Globe } from 'lucide-react';
import { playSound } from '@/src/lib/utils';

export const Invoice = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const orderData = await getOrder(orderId);
        if (orderData) {
          setOrder(orderData);
        }
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    playSound('click');
    // Minimal delay to ensure DOM is ready and sound started
    setTimeout(() => {
      window.print();
    }, 250);
  };

  if (loading) {
    return (
      <div className="pt-32 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em]">Synthesizing Manifest...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-40 text-center px-6">
        <h1 className="text-4xl font-display font-bold text-white mb-4 italic">Signal <span className="text-primary">Lost</span></h1>
        <p className="text-slate-500 max-w-sm mx-auto mb-10 text-xs font-bold uppercase tracking-widest leading-relaxed">The requested neural receipt could not be retrieved from the main registry.</p>
        <button onClick={() => navigate('/orders')} className="px-10 py-4 glass border-white/10 text-white font-bold uppercase tracking-widest rounded-xl">Back to Logs</button>
      </div>
    );
  }

  const subtotal = order.total - 1999 - (order.total * 0.05); // Estimate based on logic in checkout
  const shipping = 1999;
  const tax = (order.total - shipping) * 0.05;

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center print:hidden">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
        >
          <ChevronLeft size={16} /> Return to History
        </button>
        <div className="flex gap-4 relative z-50">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all text-[10px] shadow-[0_0_20px_rgba(34,211,238,0.3)]"
          >
            <Printer size={14} /> Print Manifest
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white text-black p-10 md:p-16 rounded-3xl shadow-2xl relative overflow-hidden print:p-0 print:shadow-none print:rounded-none"
      >
        {/* Branding Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-16 relative z-10 border-b-2 border-slate-100 pb-12">
            <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white shrink-0">
                    <Zap size={28} />
                 </div>
                 <div>
                    <h1 className="text-3xl font-display font-bold italic tracking-tight">AUMINIA <span className="text-slate-400">NEURAL</span></h1>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Hardware Logistics Core v2.4</p>
                 </div>
            </div>
            <div className="text-left md:text-right">
                <h2 className="text-3xl font-display font-bold italic mb-2">NEURAL <span className="text-slate-400">MANIFEST</span></h2>
                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">ID: <span className="text-black">#{order.id.toUpperCase()}</span></p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">DATE: <span className="text-black">{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'LOGGING...'}</span></p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">STATUS: <span className="text-blue-600">CERTIFIED</span></p>
                </div>
            </div>
        </div>

        {/* Address Info */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 relative z-10">
            <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Origin Node</h4>
                <div className="space-y-1">
                    <p className="text-xs font-bold">Auminia Tech Systems</p>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                        Plot 84-X, Neural Science Park,<br />
                        Cyber Sector 7, Bangalore,<br />
                        KA 560001, India
                    </p>
                    <p className="text-xs font-bold mt-2">contact@auminia.tech</p>
                </div>
            </div>
            <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Receiver Node</h4>
                <div className="space-y-1">
                    <p className="text-xs font-bold italic">Identity Verified Signal</p>
                    <p className="text-xs text-slate-500">Log ID: {order.userId.slice(-6)}</p>
                    <p className="text-xs text-slate-500">Transmission Target: {order.email || 'ENCRYPTED'}</p>
                </div>
            </div>
        </div>

        {/* Table */}
        <div className="mb-16 relative z-10 overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b-2 border-slate-100">
                        <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4">Node Description</th>
                        <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 text-center">Unit</th>
                        <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 text-center">Qty</th>
                        <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 text-right">Credit</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {order.items.map((item: any, i: number) => (
                        <tr key={i}>
                            <td className="py-6 px-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                        <Package size={16} />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider">{item.name}</span>
                                </div>
                            </td>
                            <td className="py-6 px-4 text-center text-xs font-mono text-slate-500">₹{item.price.toLocaleString('en-IN')}</td>
                            <td className="py-6 px-4 text-center text-xs font-bold">{item.quantity}</td>
                            <td className="py-6 px-4 text-right text-xs font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Summary */}
        <div className="flex flex-col items-end gap-3 mb-20 relative z-10">
            <div className="flex justify-between w-full max-w-[280px] text-xs">
                <span className="text-slate-400 uppercase font-bold tracking-widest">Hardware Subtotal</span>
                <span className="font-bold">₹{(order.total - 1999).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between w-full max-w-[280px] text-xs">
                <span className="text-slate-400 uppercase font-bold tracking-widest">Neural Logistics</span>
                <span className="font-bold">₹1,999</span>
            </div>
            <div className="flex justify-between w-full max-w-[280px] text-xs pt-4 border-t border-slate-100">
                <span className="text-slate-400 font-display font-bold uppercase tracking-widest italic flex items-center gap-2">
                    <Zap size={14} className="text-blue-600" /> Total Credit
                </span>
                <span className="text-2xl font-display font-bold italic">₹{order.total.toLocaleString('en-IN')}</span>
            </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between gap-8 relative z-10">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <ShieldCheck size={24} />
                </div>
                <div>
                     <p className="text-[10px] font-bold uppercase tracking-widest">Secure Manifest</p>
                     <p className="text-[9px] text-slate-400 font-medium">Verified by Auminia Blockchain Ledger</p>
                </div>
            </div>
            <div className="flex items-center gap-8">
                 <div className="text-center">
                    <Globe className="mx-auto mb-2 text-slate-300" size={20} />
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Global Node</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] text-slate-400 italic mb-1 uppercase tracking-widest font-bold">Authorized Signature</p>
                    <div className="text-xl font-display italic font-bold">AUM_SYSTEM</div>
                 </div>
            </div>
        </div>

        {/* Neural Stamp */}
        <div className="absolute bottom-10 left-10 opacity-5 pointer-events-none grayscale">
            <Zap size={120} />
        </div>
      </motion.div>
      
      <div className="mt-8 p-6 glass border-primary/20 rounded-2xl flex items-center gap-4 print:hidden">
         <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Globe size={24} />
         </div>
         <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-widest">
            Neural copies of this receipt are also transmitted to your <span className="text-primary italic">Neural Registry</span> and registered email.
         </p>
      </div>
    </div>
  );
};
