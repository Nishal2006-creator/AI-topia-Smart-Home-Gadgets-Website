import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';
import { Product } from '@/src/data';
import { generateProductDescription } from '@/src/services/aiService';
import { updateProduct } from '@/src/services/db';
import { cn, playSound } from '@/src/lib/utils';

interface AIRefinementProps {
  products: Product[];
}

export const AIRefinement = ({ products }: AIRefinementProps) => {
  const [refiningId, setRefiningId] = useState<string | null>(null);
  const [refinedIds, setRefinedIds] = useState<string[]>([]);
  
  // Filter products missing a substantial description
  const targetProducts = products.filter(p => !p.description || p.description.length < 20);

  const handleRefine = async (product: Product) => {
    setRefiningId(product.id);
    playSound('click');
    
    try {
      const newDescription = await generateProductDescription(
        product.name, 
        product.category, 
        product.features
      );
      
      await updateProduct(product.id, { description: newDescription });
      setRefinedIds(prev => [...prev, product.id]);
      playSound('success');
    } catch (error) {
      console.error(error);
      playSound('alert');
    } finally {
      setRefiningId(null);
    }
  };

  const handleRefineAll = async () => {
    if (targetProducts.length === 0) return;
    playSound('click');
    
    for (const product of targetProducts) {
      if (!refinedIds.includes(product.id)) {
        await handleRefine(product);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-display font-bold text-white italic">Neural Refinement Center</h2>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">AI-powered data synchronization engine</p>
        </div>
        
        {targetProducts.length > 0 && (
          <button 
            onClick={handleRefineAll}
            disabled={!!refiningId}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold uppercase text-[10px] tracking-widest rounded-2xl glow-primary hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            <RefreshCcw size={14} className={cn(!!refiningId && "animate-spin")} />
            Synchronize All ({targetProducts.length})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {targetProducts.length === 0 ? (
          <div className="glass p-20 rounded-[3rem] text-center border-dashed border-2 border-white/5">
            <CheckCircle2 size={48} className="mx-auto text-green-400 mb-6" />
            <h3 className="text-white font-bold uppercase tracking-[0.4em]">Grid Fully Synced</h3>
            <p className="text-gray-500 text-[10px] mt-4 uppercase tracking-widest">All hardware nodes feature comprehensive data modules.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {targetProducts.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 border-white/5 hover:border-primary/20 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 overflow-hidden flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-white font-bold text-sm tracking-tight">{product.name}</h4>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-slate-500 font-mono uppercase">{product.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-400/60 text-[10px] font-bold uppercase tracking-widest">
                    <AlertCircle size={10} />
                    Data Module Incomplete
                  </div>
                </div>

                <button
                  onClick={() => handleRefine(product)}
                  disabled={refiningId === product.id || refinedIds.includes(product.id)}
                  className={cn(
                    "px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all min-w-[140px] flex items-center justify-center gap-2",
                    refinedIds.includes(product.id) 
                      ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                      : "bg-white/5 text-white hover:bg-primary hover:text-black border border-white/10"
                  )}
                >
                  {refiningId === product.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : refinedIds.includes(product.id) ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Sparkles size={14} />
                  )}
                  {refiningId === product.id ? 'Synthesizing...' : refinedIds.includes(product.id) ? 'Synced' : 'Neural Refine'}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
