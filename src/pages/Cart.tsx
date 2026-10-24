import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, ChevronRight, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/src/context/CartContext';
import { cn, playSound } from '@/src/lib/utils';

export const Cart = () => {
  const { items, removeFromCart, updateQuantity, total } = useCart();

  const subtotal = total;
  const shipping = items.length > 0 ? 1999 : 0;
  const tax = items.length > 0 ? subtotal * 0.05 : 0;
  const finalTotal = subtotal + shipping + tax;

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <Link to="/rooms" className="p-3 glass rounded-xl text-slate-400 hover:text-white transition-colors" onClick={() => playSound('click')}>
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-5xl font-display font-bold text-white italic">Your <span className="text-primary">Rig</span> <span className="text-slate-600 text-2xl not-italic ml-4">[{items.length}]</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {items.length > 0 ? (
              items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass p-8 rounded-[2.5rem] flex flex-col sm:flex-row items-center gap-8 group hover:border-primary/20 transition-all border-white/5"
                >
                  <div className="w-32 h-32 rounded-3xl overflow-hidden shrink-0 bg-black/40 border border-white/5">
                    <img src={item.image || null} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[9px] text-primary uppercase tracking-[0.3em] font-bold block mb-1">{item.category}</span>
                        <h3 className="text-white font-display font-bold text-xl">{item.name}</h3>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-slate-600 hover:text-accent transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex flex-wrap justify-between items-center mt-6 gap-4">
                      <div className="flex items-center gap-4 glass p-1.5 rounded-2xl border-white/5">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl text-white transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-sm font-bold text-white w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl text-white transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Total Unit Credit</div>
                        <span className="text-2xl font-bold font-display text-white">
                          <span className="text-primary text-sm mr-1">₹</span>{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-24 glass rounded-[3rem] border-white/5 border-dashed border-2 bg-transparent">
                <ShoppingBag className="mx-auto text-slate-700 mb-8" size={64} />
                <h3 className="text-2xl font-display font-bold text-white mb-3 italic">Hardware Disconnected</h3>
                <p className="text-slate-500 mb-10 max-w-xs mx-auto text-sm uppercase tracking-widest font-bold">No neural signals detected in checkout buffer.</p>
                <Link to="/rooms">
                  <button className="px-12 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-primary transition-all">Connect Hardware</button>
                </Link>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <aside className="lg:col-span-1">
          <div className="glass p-10 rounded-[3rem] border-primary/20 sticky top-28 bg-gradient-to-b from-white/5 to-transparent">
            <h2 className="text-3xl font-display font-bold text-white mb-10 italic">Summary</h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Base Credits</span>
                <span className="text-white font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Neural Logistics</span>
                <span className="text-white font-bold">₹{shipping.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Quantum Tax (5%)</span>
                <span className="text-white font-bold">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="h-px bg-white/5 my-4" />
              
              <div className="flex justify-between items-end">
                <span className="text-white font-display font-bold text-xl">Total Signal</span>
                <motion.span 
                  key={finalTotal}
                  initial={{ scale: 1.1, color: '#22d3ee' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  className="text-4xl font-display font-bold"
                >
                  <span className="text-primary text-xl mr-1">₹</span>{finalTotal.toLocaleString('en-IN')}
                </motion.span>
              </div>
            </div>

            <div className="space-y-5">
              <div className="glass p-5 rounded-2xl flex items-center gap-3 focus-within:border-primary/50 transition-all border border-white/5">
                <input type="text" placeholder="COUPON_CODE" className="bg-transparent border-none w-full text-[10px] font-bold text-white focus:outline-none focus:ring-0 uppercase tracking-widest" />
                <button className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline">Apply</button>
              </div>
              
              <Link to={items.length > 0 ? "/checkout" : "#"}>
                <button 
                  disabled={items.length === 0}
                  className={cn(
                    "w-full py-5 font-bold uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-2",
                    items.length > 0 
                      ? "bg-primary text-black glow-primary hover:scale-[1.02] active:scale-95" 
                      : "bg-white/5 text-slate-600 cursor-not-allowed border border-white/5"
                  )}
                  onClick={() => items.length > 0 && playSound('success')}
                >
                  Establish Payment
                  <ChevronRight size={18} />
                </button>
              </Link>
              
              <p className="text-[9px] text-center text-slate-500 font-bold uppercase tracking-[0.2em]">Secure Transaction Node 84-X</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
