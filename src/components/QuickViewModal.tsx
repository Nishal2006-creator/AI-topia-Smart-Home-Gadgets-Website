import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Shield, Zap, Info, Heart } from 'lucide-react';
import { Product } from '@/src/data';
import { cn, playSound } from '@/src/lib/utils';
import { useTheme } from '@/src/context/ThemeContext';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = React.useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    playSound('success');
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="glass w-full max-w-5xl rounded-[3rem] overflow-hidden border-white/10 flex flex-col md:flex-row h-[80vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image Section */}
          <div className="flex-1 bg-black/40 relative group overflow-hidden">
            <motion.img 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              src={product.image || null} 
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:opacity-100"
            />
            
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              <span className="px-3 py-1 glass rounded-full text-[10px] text-primary font-bold uppercase tracking-widest border-primary/30">
                Neural Scan Active
              </span>
            </div>
          </div>

          {/* Info Section */}
          <div className="w-full md:w-[400px] p-10 border-l border-white/5 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] text-primary uppercase tracking-[0.4em] font-bold block mb-2">{product.category}</span>
                  <h2 className="text-3xl font-display font-bold text-white leading-tight italic">{product.name}</h2>
                </div>
                <button 
                  onClick={() => {
                    onClose();
                    playSound('click');
                  }}
                  className="p-2 glass rounded-xl text-slate-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-slate-400 text-sm leading-relaxed">
                  {product.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="glass p-4 rounded-2xl border-white/5">
                    <Shield className="text-secondary mb-2" size={20} />
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Security</div>
                    <div className="text-sm font-bold text-white">Quantum v5</div>
                  </div>
                  <div className="glass p-4 rounded-2xl border-white/5">
                    <Zap className="text-primary mb-2" size={20} />
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Latency</div>
                    <div className="text-sm font-bold text-white">0.02 ms</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-2">
                    <Info size={14} />
                    Neural Features
                  </h4>
                  <ul className="space-y-2">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <div className="flex justify-between items-end border-t border-white/5 pt-6">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Hardware Credits</span>
                  <span className="text-3xl font-display font-bold text-white">₹{product.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all glass border border-white/5",
                      isInWishlist(product.id) ? "text-primary border-primary/40 bg-primary/10" : "text-white hover:text-primary"
                    )}
                  >
                    <Heart size={20} className={cn(isInWishlist(product.id) && "fill-primary")} />
                  </button>
                  <button 
                    className={cn(
                      "px-8 py-4 font-bold uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center gap-2 text-xs",
                      added 
                        ? "bg-secondary text-white glow-secondary" 
                        : "bg-primary text-black glow-primary hover:scale-[1.02] active:scale-95"
                    )}
                    onClick={handleAddToCart}
                  >
                    {added ? (
                      <>
                        <Zap size={18} className="animate-pulse" />
                        Uploaded to Rig
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={18} />
                        Add to Rig
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
