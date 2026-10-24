import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, MessageSquare, Sparkles, ShoppingBag, Zap, BrainCircuit, XCircle } from 'lucide-react';
import { streamChatWithAI, chatWithAI } from '@/src/services/geminiService';
import { cn, playSound } from '@/src/lib/utils';
import { subscribeToProducts } from '@/src/services/db';
import { useAuth } from '@/src/context/AuthContext';
import { Product } from '@/src/data';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { AuminaBot } from '@/src/components/AuminaBot';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  recommendations?: Product[];
}

export const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: "Hello! I'm Aumina, your AI assistant. Need help finding the perfect smart device or setting up an automation?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    return subscribeToProducts(setProducts);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Don't show on the main consultant page to avoid double chat
  if (location.pathname === '/ai-consultant') return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    playSound('pop');

    const context = `Catalog: ${products.map(p => `- ${p.name} (ID: ${p.id}, Category: ${p.category})`).join(', ')}.
    You are Aumina, the sentient core of Aitopia. 
    1. Address the user as "Architect".
    2. Maintain a sophisticated, futuristic, and proactive tone.
    3. If the user expresses a clear preference, use 'redirect_to_product'.
    4. For general browsing, use 'recommend_products'.
    5. Provide clever 'Neural Tips' on optimization.`;

    try {
      const history = messages.slice(-4).map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const aiResponse = await chatWithAI(userInput, history as any, context);

      if (aiResponse.functionCalls && aiResponse.functionCalls.length > 0) {
        const call = aiResponse.functionCalls[0];

        if (call.name === 'recommend_products') {
          const args = call.args as { productIds: string[], reasoning: string };
          const recommended = products.filter(p => args.productIds.includes(p.id));
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            content: args.reasoning,
            recommendations: recommended
          }]);
          playSound('success');
          setIsLoading(false);
          return;
        }

        if (call.name === 'redirect_to_product') {
          const args = call.args as { productId: string, reasoning: string };
          const p = products.find(prod => prod.id === args.productId);
          if (p) {
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              role: 'model',
              content: `${args.reasoning}\n\nNavigating to ${p.name}...`
            }]);
            playSound('success');
            setTimeout(() => {
              navigate(`/rooms/${p.room.toLowerCase().replace(' ', '-')}?product=${p.id}`);
              setIsOpen(false);
            }, 2000);
            setIsLoading(false);
            return;
          }
        }
      }

      // Default stream if no function call
      const aiMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: aiMessageId, role: 'model', content: '' }]);

      await streamChatWithAI(userInput, history as any, (text) => {
        setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, content: text } : m));
      }, context);
      
      playSound('success');
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: 'err', role: 'model', content: "Neural interference detected. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / 15;
    const y = (e.clientY - (rect.top + rect.height / 2)) / 15;
    setMousePos({ x, y });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-80 sm:w-96 glass rounded-[2rem] border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[500px]"
          >
            {/* Header */}
            <div className="p-4 bg-primary/10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AuminaBot size="sm" isThinking={isLoading} />
                <div>
                  <div className="text-xs font-display font-bold text-white italic">Aumina AI</div>
                  <div className="text-[10px] text-primary/70 uppercase tracking-widest font-bold">Neural Assistant</div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  playSound('robot');
                }} 
                className="p-1 hover:text-white transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((m) => (
                <div key={m.id} className={cn("flex flex-col", m.role === 'user' ? "items-end" : "items-start")}>
                  <div className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-xs",
                    m.role === 'user' ? "bg-primary text-black font-medium" : "glass-dark border-white/5 text-gray-300"
                  )}>
                    {m.content}
                  </div>
                  {m.recommendations && (
                    <div className="mt-2 space-y-2 w-full">
                      {m.recommendations.map(p => (
                        <Link 
                          key={p.id} 
                          to={`/rooms/${p.room.toLowerCase().replace(' ', '-')}?product=${p.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 glass p-2 rounded-xl hover:border-primary/30 transition-all border-white/5"
                        >
                          <img src={p.image || undefined} className="w-10 h-10 rounded-lg object-cover" alt="" />
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-bold text-white truncate">{p.name}</div>
                            <div className="text-[9px] text-primary font-bold">₹{p.price.toLocaleString()}</div>
                          </div>
                          <ShoppingBag size={12} className="text-gray-500" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  >
                    <AuminaBot size="sm" isThinking />
                  </motion.div>
                  <span className="animate-pulse">Thinking...</span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar mask-fade-right">
              {[
                { label: 'Best Match', icon: <Sparkles size={10} /> },
                { label: 'Neural Tips', icon: <BrainCircuit size={10} /> },
                { label: 'Support', icon: <Zap size={10} /> }
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(action.label === 'Best Match' ? "What is the absolute best product for my smart home?" : action.label);
                    playSound('pop');
                  }}
                  className="whitespace-nowrap px-3 py-1.5 glass-dark border-white/5 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary hover:border-primary/20 transition-all flex items-center gap-1.5"
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-black/20">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for advice..."
                  className="w-full glass-dark border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-primary/50 outline-none pr-10"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-primary disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePos({ x: 0, y: 0 });
        }}
        onMouseMove={handleMouseMove}
        animate={{ 
          x: mousePos.x, 
          y: mousePos.y,
          boxShadow: isHovered ? `0 0 40px rgba(0, 242, 255, 0.4)` : `0 0 20px rgba(0, 0, 0, 0.4)`
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(!isOpen);
          playSound('robot');
        }}
        className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center relative transition-all duration-300",
          isOpen ? "bg-red-500/20 border border-red-500/40 text-red-500" : "bg-black/80 backdrop-blur-xl border border-primary/30"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={28} />
            </motion.div>
          ) : (
            <AuminaBot size="md" isThinking={isLoading} isHovered={isHovered} />
          )}
        </AnimatePresence>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-primary text-[10px] flex items-center justify-center font-bold text-black">1</span>
          </span>
        )}
      </motion.button>
    </div>
  );
};
