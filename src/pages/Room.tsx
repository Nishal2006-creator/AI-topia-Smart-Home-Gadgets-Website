import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Grid, List as ListIcon, Search, ChevronRight, Sparkles } from 'lucide-react';
import { ROOMS, Product, PRODUCTS } from '@/src/data';
import { ProductCard } from '@/src/components/ProductCard';
import { AIFilterInput } from '@/src/components/AIFilterInput';
import { AIFilters } from '@/src/services/geminiService';
import { cn, playSound } from '@/src/lib/utils';
import { subscribeToProducts } from '@/src/services/db';

export const RoomPage = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const targetedProductId = searchParams.get('product');
  const [products, setProducts] = useState<Product[]>([]);
  const room = ROOMS.find(r => r.id === roomId) || ROOMS[0];
  const [activeFilter, setActiveFilter] = React.useState('All');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(600000);
  const [aiFilters, setAiFilters] = useState<AIFilters>({});

  useEffect(() => {
    return subscribeToProducts(setProducts);
  }, []);

  useEffect(() => {
    if (targetedProductId && (products.length > 0 || PRODUCTS.length > 0)) {
      // Find the product to ensure we are in the right room/filter
      const target = [...products, ...PRODUCTS].find(p => p.id === targetedProductId);
      if (target) {
        // Set search query to product name if it's not visible
        setSearchQuery(''); 
        setActiveFilter('All');
        setAiFilters({});
        
        // Give time for layout to settle
        setTimeout(() => {
          const element = document.getElementById(`product-${targetedProductId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a temporary highlight effect
            element.classList.add('ring-2', 'ring-primary', 'ring-offset-4', 'ring-offset-black');
            setTimeout(() => {
              element.classList.remove('ring-2', 'ring-primary', 'ring-offset-4', 'ring-offset-black');
            }, 3000);
          }
        }, 800);
      }
    }
  }, [targetedProductId, products]);

  const filteredProducts = (products.length > 0 ? products : PRODUCTS).filter(p => {
    // Room Filter
    const roomMatch = roomId === 'all' || !roomId || p.room.toLowerCase().replace(' ', '-') === roomId;
    
    // Category Filter (Standard)
    const categoryMatch = activeFilter === 'All' || p.category === activeFilter;
    
    // Search Filter (Standard)
    const searchMatch = !searchQuery || 
                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Price Filter (Standard)
    const priceMatch = p.price <= priceRange;

    // AI Dynamic Filters
    const aiCategoryMatch = !aiFilters.category || p.category === aiFilters.category;
    const aiPriceMatch = (!aiFilters.minPrice || p.price >= aiFilters.minPrice) && 
                         (!aiFilters.maxPrice || p.price <= aiFilters.maxPrice);
    const aiSearchMatch = !aiFilters.search || 
                          p.name.toLowerCase().includes(aiFilters.search.toLowerCase()) ||
                          p.description.toLowerCase().includes(aiFilters.search.toLowerCase());
    const aiFeatureMatch = !aiFilters.features || aiFilters.features.every(f => 
                           p.features.some(pf => pf.toLowerCase().includes(f.toLowerCase()))
                         );

    return roomMatch && categoryMatch && searchMatch && priceMatch && 
           aiCategoryMatch && aiPriceMatch && aiSearchMatch && aiFeatureMatch;
  });

  const displayProductsList = products.length > 0 ? products : PRODUCTS;
  const categories = ['All', ...Array.from(new Set(displayProductsList.map(p => p.category)))];

  return (
    <div className="pt-24 pb-20">
      {/* Room Banner */}
      <div className="relative h-[40vh] mb-12 overflow-hidden px-6">
        <div className="max-w-7xl mx-auto h-full relative rounded-3xl overflow-hidden shadow-2xl">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            src={room.bg || null}
            alt={room.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/20" />
          <div className="absolute inset-x-0 bottom-0 p-10 md:p-16">
            <div className="flex items-center gap-4 text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4">
              <span>Aitopia Intelligence Systems</span>
              <ChevronRight size={14} />
              <span>{room.name}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-widest uppercase italic">
              {room.name}
            </h1>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="px-4 py-2 glass rounded-xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold text-white/70 uppercase">8 Active Nodes</span>
              </div>
              <div className="px-4 py-2 glass rounded-xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold text-white/70 uppercase">Energy Optimal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-10">
          <div>
            <h3 className="text-white font-display font-bold text-xl mb-6 flex items-center gap-2">
              <Filter size={18} className="text-primary" />
              Categories
            </h3>
            <div className="flex flex-col gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveFilter(cat);
                    playSound('click');
                  }}
                  className={cn(
                    "w-full text-left px-5 py-3 rounded-xl text-sm font-medium transition-all",
                    activeFilter === cat ? "bg-primary/20 text-primary border border-primary/30" : "text-gray-500 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-display font-bold text-xl mb-6 flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-primary" />
              Price Range
            </h3>
            <div className="px-2">
              <input 
                type="range" 
                className="w-full accent-primary h-1.5 rounded-lg bg-white/10" 
                min="0" 
                max="600000" 
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest">
                <span>₹0</span>
                <span>₹{priceRange.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-8 glass rounded-3xl bg-primary/5 border-primary/20">
            <h4 className="text-primary font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles size={14} />
              AI Assistant
            </h4>
            <p className="text-gray-400 text-xs leading-relaxed italic mb-6">
              "Describe your ideal atmospheric conditions or technical requirements, and I'll calibrate your search results."
            </p>
            <AIFilterInput 
              categories={categories.filter(c => c !== 'All')}
              onFilterUpdate={setAiFilters}
              onClear={() => setAiFilters({})}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search devices..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-4 glass p-1 rounded-2xl">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-2 rounded-xl transition-all", viewMode === 'grid' ? "bg-white/10 text-primary" : "text-gray-500")}
              >
                <Grid size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn("p-2 rounded-xl transition-all", viewMode === 'list' ? "bg-white/10 text-primary" : "text-gray-500")}
              >
                <ListIcon size={20} />
              </button>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              <motion.div 
                layout
                className={cn(
                  "grid gap-8",
                  viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-2" : "grid-cols-1"
                )}
              >
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-40 glass rounded-[3rem]"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500">
                  <Search size={40} />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">No Matching Signals</h3>
                <p className="text-gray-500">We couldn't find any futuristic tech matching your current filters.</p>
                <button 
                  onClick={() => {
                    setActiveFilter('All');
                    setAiFilters({});
                    setSearchQuery('');
                  }}
                  className="mt-8 px-8 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary transition-all"
                >
                  Reset Sensors
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
