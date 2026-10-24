import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Loader2, X } from 'lucide-react';
import { translateDescriptionToFilters, AIFilters } from '@/src/services/geminiService';
import { cn, playSound } from '@/src/lib/utils';

interface AIFilterInputProps {
  categories: string[];
  onFilterUpdate: (filters: AIFilters) => void;
  onClear: () => void;
}

export const AIFilterInput = ({ categories, onFilterUpdate, onClear }: AIFilterInputProps) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeQuery, setActiveQuery] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    playSound('click');
    
    try {
      const filters = await translateDescriptionToFilters(input, categories);
      onFilterUpdate(filters);
      setActiveQuery(input);
      setInput('');
      playSound('success');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    onClear();
    setActiveQuery(null);
    playSound('click');
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
        
        <div className="relative glass rounded-2xl border border-white/10 p-1 flex items-center gap-2 pr-4 transition-all group-focus-within:border-primary/50">
          <div className="pl-4 text-primary">
            <Sparkles size={18} className={cn(isLoading && "animate-spin")} />
          </div>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your perfect setup... (e.g. 'energy efficient lighting')"
            className="flex-1 bg-transparent py-3 text-sm focus:outline-none placeholder:text-gray-500"
            disabled={isLoading}
          />
          
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              "p-2 rounded-xl transition-all",
              input.trim() ? "bg-primary text-black hover:scale-105" : "text-gray-500"
            )}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {activeQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2"
          >
            <div className="flex-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-0.5">AI Active Filter</span>
              <span className="text-xs text-white/90 italic">"{activeQuery}"</span>
            </div>
            <button 
              onClick={handleClear}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
