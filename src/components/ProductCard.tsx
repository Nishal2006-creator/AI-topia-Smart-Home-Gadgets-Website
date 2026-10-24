import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import { Product } from '@/src/data';
import { cn, playSound } from '@/src/lib/utils';
import { useTheme } from '@/src/context/ThemeContext';
import { QuickViewModal } from './QuickViewModal';

import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [showQuickView, setShowQuickView] = React.useState(false);
  const [added, setAdded] = React.useState(false);
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    playSound('success');
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  // Mouse tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const resetMouse = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <>
      <motion.div
        id={`product-${product.id}`}
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
          filter: isHovered && theme.glowEnabled ? `drop-shadow(0 0 20px ${theme.primaryColor}33)` : 'none'
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={resetMouse}
        className="group relative perspective-1000"
      >
        <div 
          className={cn(
            "glass overflow-hidden rounded-[2rem] transition-all duration-500 h-full flex flex-col border-white/10",
            isHovered && "border-primary/40 -translate-y-2 shadow-2xl shadow-primary/20",
            theme.glowEnabled && isHovered && "shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]"
          )}
          style={{
            transform: isHovered ? "translateZ(50px)" : "translateZ(0px)",
            boxShadow: theme.glowEnabled && isHovered ? `0 20px 40px -10px ${theme.primaryColor}33, 0 0 20px ${theme.primaryColor}22` : undefined
          }}
        >
          {/* Badge */}
          {product.isNew && (
            <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-primary/10 backdrop-blur-md rounded-lg flex items-center gap-1.5 border border-primary/30">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Quantum v4</span>
            </div>
          )}

          {/* Wishlist Button (Static) */}
          <button 
            className={cn(
              "absolute top-4 right-4 z-20 w-8 h-8 rounded-lg flex items-center justify-center transition-all",
              isInWishlist(product.id) ? "bg-primary/20 text-primary border border-primary/30" : "glass text-slate-400 border border-white/5 hover:text-primary hover:border-primary/20"
            )}
            onClick={handleToggleWishlist}
          >
            <Heart size={14} className={cn(isInWishlist(product.id) && "fill-primary")} />
          </button>

          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-[#0a0a0a]">
            <motion.img
              src={product.image || null}
              alt={product.name}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700 grayscale group-hover:grayscale-0"
              animate={{ scale: isHovered ? 1.1 : 1 }}
            />
            
            {/* Quick Actions Overlay */}
            <div className={cn(
              "absolute inset-0 flex items-center justify-center gap-3 transition-all duration-500",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}>
              <button 
                className="px-4 h-10 glass-dark rounded-xl text-white hover:text-primary hover:border-primary/50 transition-all flex items-center gap-2 border border-white/5 group/btn"
                onClick={() => {
                  setShowQuickView(true);
                  playSound('pop');
                }}
              >
                <Eye size={18} />
                <div className="text-[10px] font-bold uppercase tracking-widest">Neural Scan</div>
              </button>
              <button 
                className={cn(
                  "w-10 h-10 glass-dark rounded-xl transition-all flex items-center justify-center border border-white/5",
                  added ? "text-primary border-primary bg-primary/20" : "text-white hover:text-secondary hover:border-secondary/50"
                )}
                onClick={handleAddToCart}
              >
                {added ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </motion.div>
                ) : (
                  <ShoppingCart size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-bold">{product.category}</span>
                <div className="px-2 py-0.5 glass rounded-md flex items-center gap-1">
                  <Star size={10} className="text-secondary fill-secondary" />
                  <span className="text-[10px] font-bold text-slate-400">{product.rating}</span>
                </div>
              </div>
              <h3 className="text-white font-display font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-slate-500 text-xs mt-3 line-clamp-2 leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
              <div className="flex flex-col">
                <span className="text-slate-400 text-xl font-bold font-display">
                  <span className="text-primary text-sm mr-1">₹</span>{product.price.toLocaleString('en-IN')}
                </span>
              </div>
              <button 
                className="px-5 py-2.5 bg-white/5 hover:bg-primary hover:text-black rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all border border-white/5 hover:border-primary border-solid"
                onClick={() => {
                  setShowQuickView(true);
                  playSound('click');
                }}
              >
                Neural Scan
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <QuickViewModal 
        product={showQuickView ? product : null} 
        onClose={() => setShowQuickView(false)} 
      />
    </>
  );
};

