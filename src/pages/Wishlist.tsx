import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Trash2, ArrowLeft, ShoppingCart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/src/context/WishlistContext';
import { useCart } from '@/src/context/CartContext';
import { cn, playSound } from '@/src/lib/utils';
import { PRODUCTS } from '@/src/data';

export const Wishlist = () => {
  const { wishlistItems, toggleWishlist, loading, error } = useWishlist();
  const { addToCart } = useCart();

  const wishlistedProducts = PRODUCTS.filter(p => wishlistItems.includes(p.id));

  const handleAddToCart = (product: any) => {
    addToCart(product);
    playSound('success');
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-[10px] text-primary uppercase tracking-[0.4em] animate-pulse">Syncing Hardware Nodes...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <Link to="/rooms" className="p-3 glass rounded-xl text-slate-400 hover:text-white transition-colors" onClick={() => playSound('click')}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-5xl font-display font-bold text-white italic">Saved <span className="text-primary">Nodes</span> <span className="text-slate-600 text-2xl not-italic ml-4">[{wishlistedProducts.length}]</span></h1>
        </div>
        
        {error && (
          <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] uppercase font-bold tracking-widest animate-pulse">
            Neural Sync Restricted: {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {wishlistedProducts.length > 0 ? (
            wishlistedProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                className="glass p-6 rounded-[2.5rem] group hover:border-primary/20 transition-all border-white/5 flex flex-col"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-black/40 border border-white/5">
                  <img 
                    src={product.image || null} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                    alt={product.name}
                  />
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-xl text-primary hover:text-white transition-colors border border-white/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex-1">
                  <span className="text-[9px] text-primary uppercase tracking-[0.3em] font-bold block mb-2">{product.category}</span>
                  <h3 className="text-white font-display font-bold text-xl mb-2">{product.name}</h3>
                  <p className="text-slate-500 text-xs line-clamp-2 mb-6 leading-relaxed italic">{product.description}</p>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="text-xl font-bold font-display text-white">
                    <span className="text-primary text-sm mr-1">₹</span>{product.price.toLocaleString('en-IN')}
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="p-3 bg-primary/10 text-primary hover:bg-primary hover:text-black rounded-xl transition-all border border-primary/20"
                    title="Move to Rig"
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-24 glass rounded-[3rem] border-white/5 border-dashed border-2 bg-transparent">
              <Sparkles className="mx-auto text-slate-700 mb-8" size={64} />
              <h3 className="text-2xl font-display font-bold text-white mb-3 italic">Memory banks empty</h3>
              <p className="text-slate-500 mb-10 max-w-xs mx-auto text-sm uppercase tracking-widest font-bold font-sans">Initialize scanning to save hardware nodes.</p>
              <Link to="/rooms">
                <button className="px-12 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-primary transition-all">Scan Network</button>
              </Link>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
