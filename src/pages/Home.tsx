import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ChevronDown, Zap, Globe, Shield, HelpCircle, MessageSquare } from 'lucide-react';
import { ROOMS, Product, PRODUCTS } from '@/src/data';
import { ProductCard } from '@/src/components/ProductCard';
import { Hero3D } from '@/src/components/Hero3D';
import { Link } from 'react-router-dom';
import { cn, playSound } from '@/src/lib/utils';
import { subscribeToProducts } from '@/src/services/db';

import { Logo } from '@/src/components/Logo';

export const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    return subscribeToProducts(setProducts);
  }, []);

  const displayProducts = products.length > 0 ? products : PRODUCTS;

  return (
    <div className="relative pt-32 pb-24">
      {/* Background Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] -z-10" />

      {/* Hero Section */}
      <section className="px-6 min-h-[70vh] flex flex-col items-center justify-center text-center relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full glass rounded-[3rem] p-12 md:p-20 overflow-hidden border border-white/10"
        >
          {/* Animated 3D Hero Asset */}
          <Hero3D />

          <div className="text-left relative z-10 lg:max-w-xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-2 py-0.5 rounded bg-primary/20 border border-primary/40 text-[10px] text-primary uppercase tracking-tighter font-bold">Featured Concept</span>
              <span className="text-xs text-slate-500 font-medium">Neural Synapse v4.2</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-8 tracking-tighter leading-[1] italic">
              Quantum <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Audio Hub X</span>
            </h1>
            
            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
              The world's first neural-aware smart system. It doesn't just manage your home; it anticipates your atmosphere.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/rooms">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => playSound('click')}
                  className="px-10 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center gap-2 group text-sm"
                >
                  Sync Now — ₹19,999
                </motion.button>
              </Link>
              <Link to="/ai-consultant">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => playSound('click')}
                  className="px-10 py-4 glass text-white font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all flex items-center gap-2 text-sm border-white/10"
                >
                  Explore Features
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Statistics / Grid */}
      <section className="px-6 py-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        <aside className="md:col-span-3 flex flex-col gap-6">
          <div className="glass p-6 rounded-2xl border-white/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-white">Efficiency</span>
              <span className="text-xs text-green-400 font-bold">+12% Opt.</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end h-24">
                {[20, 40, 90, 60, 75, 45].map((h, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-3 rounded-t-sm transition-all duration-500",
                      i === 2 ? "bg-primary shadow-[0_0_10px_rgba(34,211,238,0.5)]" : "bg-white/10"
                    )}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[8px] text-slate-500 font-bold uppercase tracking-widest">
                <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-ping" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-secondary">Aitopia Guide</p>
                  <p className="text-[10px] text-slate-500">Neural Sync Active</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                "System suggests dimming lights to 40% based on your evening routine."
              </p>
            </div>
            <Link to="/ai-consultant" className="text-primary text-[10px] font-bold uppercase tracking-widest mt-6 hover:underline flex items-center gap-2">
              Talk to Home <ArrowRight size={12} />
            </Link>
          </div>
        </aside>

        <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.slice(0, 6).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Room Categories */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Intelligent Spaces</h2>
            <p className="text-gray-500">Pick a room to see our curated smart configurations.</p>
          </div>
          <Link to="/rooms" className="text-primary font-bold text-sm uppercase tracking-widest hover:underline">
            View All Rooms
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {ROOMS.map((room, i) => (
            <Link key={room.id} to={`/rooms/${room.id}`}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative aspect-[4/5] rounded-3xl overflow-hidden glass group"
                onClick={() => playSound('pop')}
              >
                <img src={room.bg || null} alt={room.name} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="text-white font-display font-bold text-lg md:text-xl tracking-tight">{room.name}</span>
                  <div className="text-[10px] text-primary uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore Devices
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended Products */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-0.5 flex-1 bg-white/5" />
          <h2 className="text-2xl md:text-4xl font-display font-bold text-white whitespace-nowrap">AI Recommendations</h2>
          <div className="h-0.5 flex-1 bg-white/5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayProducts.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Futuristic Newsletter */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto glass rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[100px] -z-10" />
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>
          <h2 className="text-3xl md:text-6xl font-display font-bold text-white mb-6">Join the Revolution</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">Get early access to neural-link updates and exclusive drops. Level up your lifestyle today.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your system ID (Email)" 
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
            />
            <button 
              className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-black transition-all active:scale-95"
              onClick={() => playSound('success')}
            >
              Sync
            </button>
          </div>
        </div>
      </section>
      {/* Neural Support Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/support" className="group" onClick={() => playSound('click')}>
            <div className="glass p-8 rounded-[2rem] border-white/5 hover:border-primary/20 transition-all h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <HelpCircle size={32} />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2">Help Center</h3>
              <p className="text-sm text-gray-500">Access our comprehensive documentation and neural guides.</p>
            </div>
          </Link>
          
          <Link to="/feedback" className="group" onClick={() => playSound('click')}>
            <div className="glass p-8 rounded-[2rem] border-white/5 hover:border-secondary/20 transition-all h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2">Feedback Loop</h3>
              <p className="text-sm text-gray-500">Share your experience to help us recalibrate and improve.</p>
            </div>
          </Link>

          <Link to="/ai-consultant" className="group" onClick={() => playSound('click')}>
            <div className="glass p-8 rounded-[2rem] border-white/5 hover:border-accent/20 transition-all h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2">AI Consultation</h3>
              <p className="text-sm text-gray-500">Real-time troubleshooting with our Aumina Robot System.</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};
