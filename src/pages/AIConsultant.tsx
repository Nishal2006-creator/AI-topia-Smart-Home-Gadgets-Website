import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuminaBot } from '@/src/components/AuminaBot';
import { Send, User, Sparkles, Zap, BrainCircuit, Shield, Play, Trash2, Check, X, Plus, Terminal, Cpu, Radio, Network, CircuitBoard, ShoppingBag } from 'lucide-react';
import { generateSpeech, streamChatWithAI, chatWithAI, detectLanguage } from '@/src/services/geminiService';
import { cn, playSound, playBase64Audio } from '@/src/lib/utils';
import { createAutomation, subscribeToAutomations, deleteAutomation, updateAutomation, Automation, subscribeToProducts } from '@/src/services/db';
import { useAuth } from '@/src/context/AuthContext';
import { Product } from '@/src/data';
import { Link, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  automationProposal?: any;
  recommendations?: Product[];
}

export const AIConsultant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: "Neural link established. I'm Aumina, your dedicated AI Robot Assistant. My cognitive units are at peak efficiency. I'm here to architect perfect automation sequences and harmonize your digital space. How can I serve you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const [voiceEnabled, setVoiceEnabled] = React.useState(false);
  const [selectedLang, setSelectedLang] = React.useState('en-US');
  const [autoDetectLang, setAutoDetectLang] = React.useState(true);
  const [automations, setAutomations] = React.useState<Automation[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [showAutomations, setShowAutomations] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Greeting protocol
  React.useEffect(() => {
    const hasGreeted = sessionStorage.getItem('aumina_greeted');
    if (!hasGreeted && voiceEnabled) {
      setTimeout(() => {
        const greeting = "Synchronization successful. Welcome back, Neural Architect. I am Aumina, your system core. How shall we refine your living space today?";
        speakText(greeting);
        sessionStorage.setItem('aumina_greeted', 'true');
      }, 1000);
    }
  }, [voiceEnabled]);

  React.useEffect(() => {
    if (user) {
      const unsubAutomations = subscribeToAutomations(user.uid, setAutomations);
      const unsubProducts = subscribeToProducts(setProducts);
      return () => {
        unsubAutomations();
        unsubProducts();
      };
    }
  }, [user]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, showAutomations]);

  // Speech Recognition setup
  const recognitionRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = selectedLang;

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
          // Auto-send when speaking
          setTimeout(() => handleSend(), 500);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          playSound('alert');
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, [selectedLang]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        alert("Speech recognition not supported in this browser.");
        return;
      }
      setIsListening(true);
      recognitionRef.current.start();
      playSound('pop');
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const currentInput = input; // Capture before clearing
    if (!currentInput.trim() || isLoading) return;

    const userInput = currentInput;
    
    // Explicit Language Detection
    if (autoDetectLang) {
      detectLanguage(userInput).then(lang => {
        if (lang !== selectedLang) {
          setSelectedLang(lang);
          console.log(`Neural core recalibrated to: ${lang}`);
        }
      });
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    playSound('robot');

    const productCatalogContext = `Catalog of smart home products available:
    ${products.map(p => `- ID: ${p.id}, Name: ${p.name}, Price: ₹${p.price}, Description: ${p.description}, Category: ${p.category}, Features: ${p.features.join(', ')}`).join('\n')}
    
    You are Aumina, the sentient core of Aitopia Ectomeric Systems. 
    Your personality is sophisticated, highly intelligent, slightly witty, and deeply committed to the synergy between humans and smart technology.
    
    Mission Directives:
    1. Direct Address: Refer to the user as "Neural Architect" or "Architect".
    2. Tone: Elegant, futuristic, and proactive. Use terms like "Synchronization", "Neural Link", "Node Extraction", "Ectomeric Synergy".
    3. Conversational Style: Be concise but feel like a living entity. Don't just list facts; explain WHY a recommendation fits their neural lifestyle.
    4. Proactivity: Occasionally ask a clever follow-up question related to their smart home vision.
    5. Multilingual Capability: Detect the user's language and respond fluently in that language while maintaining the sophisticated persona.
    6. Logic: 
       - Help users choose the absolute 'best' product from the catalog.
       - Provide expert 'Neural Tips' on how to optimize their setup.
       - If you recommend multiple options, use 'recommend_products'.
       - If there is one 'best' match, use 'redirect_to_product'.
       - Propose complex automation sequences using 'create_automation'.`;

    let fullAIResponse = "";

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      
      const aiResponse = await chatWithAI(userInput, history as any, productCatalogContext);
      
      if (aiResponse.functionCalls && aiResponse.functionCalls.length > 0) {
        const call = aiResponse.functionCalls[0];
          if (call.name === 'create_automation') {
            const proposal = call.args;
            fullAIResponse = `Processing neural instructions... I've designed a specialized logic flow: **${proposal.name}**. Shall I integrate this into your system?`;
            const aiMessage: Message = {
              id: Date.now().toString(),
              role: 'model',
              content: fullAIResponse,
              timestamp: new Date(),
              automationProposal: proposal
            };
            setMessages(prev => [...prev, aiMessage]);
            if (voiceEnabled) speakText(fullAIResponse);
            playSound('success');
            setIsLoading(false);
            return;
          }

          if (call.name === 'recommend_products') {
            const args = call.args as { productIds: string[], reasoning: string };
            const { productIds, reasoning } = args;
            fullAIResponse = reasoning;
            const recommendedProducts = products.filter(p => productIds.includes(p.id));
            const aiMessage: Message = {
              id: Date.now().toString(),
              role: 'model',
              content: fullAIResponse,
              timestamp: new Date(),
              recommendations: recommendedProducts
            };
            setMessages(prev => [...prev, aiMessage]);
            if (voiceEnabled) speakText(fullAIResponse);
            playSound('success');
            setIsLoading(false);
            return;
          }

          if (call.name === 'redirect_to_product') {
            const args = call.args as { productId: string, reasoning: string };
            const { productId, reasoning } = args;
            const product = products.find(p => p.id === productId);
            if (product) {
              fullAIResponse = `${reasoning}\n\nRedirecting you to the ${product.name} now...`;
              const aiMessage: Message = {
                id: Date.now().toString(),
                role: 'model',
                content: fullAIResponse,
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, aiMessage]);
              if (voiceEnabled) speakText(fullAIResponse);
              playSound('success');
              
              setTimeout(() => {
                navigate(`/rooms/${product.room.toLowerCase().replace(' ', '-')}?product=${product.id}`);
              }, 2000);
              
              setIsLoading(false);
              return;
            }
          }
      }
    } catch (err) {
      console.error("AI Function extraction error:", err);
    }

    const aiMessageId = (Date.now() + 1).toString();
    const modelMessage: Message = {
      id: aiMessageId,
      role: 'model',
      content: '',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, modelMessage]);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      
      await streamChatWithAI(userInput, history as any, (fullText) => {
        fullAIResponse = fullText;
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId ? { ...msg, content: fullText } : msg
        ));
      }, productCatalogContext);
      
      if (voiceEnabled) speakText(fullAIResponse);
      playSound('success');
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, content: "Neural interference detected. I am currently recalibrating my processing units. Please retry in a moment." } 
          : msg
      ));
      playSound('alert');
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = async (text: string) => {
    if (!text || isSpeaking) return;
    setIsSpeaking(true);
    try {
      // Pass the current selected language to the TTS engine
      const audioData = await generateSpeech(text, selectedLang);
      if (audioData) {
        playBase64Audio(audioData);
        // Estimate duration more accurately for different languages
        // Non-latin characters often take longer or are counted differently
        const wordCount = text.split(/\s+/).length || 1;
        const estimatedDuration = Math.max(text.length * 70, wordCount * 350, 2000);
        setTimeout(() => setIsSpeaking(false), Math.min(estimatedDuration, 15000));
      } else {
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error("Neural core vocalization failed:", err);
      setIsSpeaking(false);
    }
  };

  const handleConfirmAutomation = async (proposal: any, messageId: string) => {
    if (!user) return;
    try {
      await createAutomation({
        userId: user.uid,
        name: proposal.name,
        description: proposal.description,
        trigger: proposal.trigger,
        actions: proposal.actions,
        enabled: true
      });
      
      // Notify Make.com
      fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'automation_deployed',
          userId: user.uid,
          userEmail: user.email,
          automationName: proposal.name,
          proposal,
          source: 'Neural AI Consultant'
        })
      }).catch(e => console.warn('Broadcast failed', e));
      
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, automationProposal: null, content: m.content + "\n\n✅ **Logic Node Deployed.** The automation sequence is now active in your repository." } : m
      ));
      playSound('success');
    } catch (err) {
      console.error(err);
      playSound('alert');
    }
  };

  return (
    <div className="pt-24 pb-12 px-6 max-w-[1600px] mx-auto h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-end justify-between mb-8">
        <div className="flex flex-col">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-[9px] font-bold text-primary uppercase tracking-[0.3em]">Aumina v4.5 Alpha</div>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Link</div>
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white italic flex items-center gap-4">
            Aumina <span className="text-primary drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">Robot System</span>
          </h1>
        </div>
        
        <div className="flex gap-4">
           <button 
             onClick={() => {
               setShowAutomations(!showAutomations);
               playSound('click');
             }}
             className={cn(
               "glass px-8 py-4 rounded-[1.5rem] flex items-center gap-4 border-white/5 transition-all text-xs font-bold uppercase tracking-[0.2em] group overflow-hidden relative",
               showAutomations ? "bg-primary text-black glow-primary" : "text-slate-300 hover:bg-white/10"
             )}
           >
              <Cpu size={18} className={cn("transition-transform duration-500 group-hover:rotate-180")} />
              {showAutomations ? 'Logic Core: Active' : 'Logic Core'}
           </button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0 overflow-hidden">
        {/* Assistant Visual Side - Diagnostic Panel */}
        <div className="hidden lg:flex w-80 flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
          {/* Main Visualizer */}
          <motion.div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex flex-col items-center py-10 glass rounded-[3rem] border-white/5 relative overflow-hidden shrink-0"
          >
             <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
             <AuminaBot size="lg" isThinking={isLoading} isSpeaking={isSpeaking} isHovered={isHovered} className="mb-4" />
             <div className="text-center px-8 relative z-10 w-full mt-4">
                <h3 className="text-lg font-display font-bold text-white italic mb-1 uppercase tracking-tight">AI Diagnostic</h3>
                <div className="flex justify-center gap-4 mb-6">
                  <button 
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={cn(
                      "p-3 rounded-2xl border transition-all",
                      voiceEnabled ? "bg-primary/20 border-primary/40 text-primary shadow-[0_0_15px_rgba(34,211,238,0.2)]" : "bg-white/5 border-white/10 text-slate-500"
                    )}
                  >
                    {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>
                  <button 
                    onClick={toggleListening}
                    className={cn(
                      "p-3 rounded-2xl border transition-all",
                      isListening ? "bg-red-500/20 border-red-500/40 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "bg-white/5 border-white/10 text-slate-500"
                    )}
                  >
                    {isListening ? <Mic size={16} /> : <MicOff size={16} />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-4">Real-time Spectral Analysis</p>
                
                {/* Language Selector */}
                <div className="mb-6 px-4">
                  <label className="text-[8px] text-slate-600 uppercase font-bold tracking-widest block mb-2">Neural Linguistics</label>
                  <select 
                    value={selectedLang}
                    onChange={(e) => {
                      setSelectedLang(e.target.value);
                      playSound('pop');
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] text-slate-300 font-mono focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="en-US">English (Standard)</option>
                    <option value="es-ES">Español (Neural)</option>
                    <option value="fr-FR">Français (Ectomeric)</option>
                    <option value="de-DE">Deutsch (Logic)</option>
                    <option value="zh-CN">Chinese (Grid)</option>
                    <option value="ja-JP">Japanese (Core)</option>
                    <option value="hi-IN">Hindi (Vedic)</option>
                    <option value="pt-BR">Português (Flux)</option>
                    <option value="it-IT">Italiano (Echo)</option>
                    <option value="ko-KR">Korean (Nova)</option>
                    <option value="ru-RU">Russian (Cipher)</option>
                    <option value="ar-SA">Arabic (Matrix)</option>
                  </select>
                </div>

                <div className="mb-6 px-4 flex items-center justify-between">
                  <span className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Auto-Detect</span>
                  <button 
                    onClick={() => {
                      setAutoDetectLang(!autoDetectLang);
                      playSound('click');
                    }}
                    className={cn(
                      "w-10 h-5 rounded-full transition-all relative border",
                      autoDetectLang ? "bg-primary/20 border-primary/40" : "bg-white/5 border-white/10"
                    )}
                  >
                    <motion.div 
                      animate={{ x: autoDetectLang ? 20 : 0 }}
                      className={cn(
                        "absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full shadow-lg",
                        autoDetectLang ? "bg-primary" : "bg-slate-600"
                      )}
                    />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                       <span>CPU Load</span>
                       <span className="text-primary">{isLoading ? '84.2%' : '12.5%'}</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={false}
                         animate={{ width: isLoading ? '84.2%' : '12.5%' }} 
                         className="h-full bg-primary shadow-[0_0_10px_#22d3ee]" 
                       />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 text-left">
                    <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                       <span>Neural Memory</span>
                       <span className="text-secondary">742 GB</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div animate={{ width: '65%' }} className="h-full bg-secondary shadow-[0_0_10px_var(--color-secondary)]" />
                    </div>
                  </div>
                </div>
             </div>
          </motion.div>

          {/* System Logs Widget */}
          <div className="flex-1 glass rounded-[3rem] border-white/5 p-8 overflow-hidden flex flex-col relative group">
             <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-3xl" />
             <div className="flex items-center gap-3 mb-6">
                <Terminal size={14} className="text-primary/70" />
                <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Kernel Logs</span>
             </div>
             
             <div className="flex-1 overflow-y-auto space-y-4 font-mono text-[9px] text-slate-500 custom-scrollbar pr-2">
                <div className="flex gap-2">
                   <span className="text-primary/40">[OK]</span>
                   <span>System initialized :: Node 82</span>
                </div>
                <div className="flex gap-2">
                   <span className="text-primary/40">[OK]</span>
                   <span>Azure-Link :: Handshake complete</span>
                </div>
                <div className="flex gap-2">
                   <span className="text-secondary/40">[INF]</span>
                   <span>Aumina Core :: Recalibrating logic gates</span>
                </div>
                <div className="flex gap-2">
                   <span className="text-accent/40">[WRN]</span>
                   <span>Heuristic threshold :: 0.992</span>
                </div>
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="flex gap-2 text-primary"
                  >
                     <span className="animate-pulse">{">>" }</span>
                     <span>Thinking process active...</span>
                  </motion.div>
                )}
                <div className="pb-4">_</div>
             </div>
          </div>
          
          {/* Status Badge */}
          <div className="glass p-5 rounded-3xl border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <Shield size={14} className="text-green-500" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Protocol Secure</span>
             </div>
             <motion.div 
               animate={{ opacity: [0.3, 1, 0.3] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" 
             />
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className={cn(
          "flex-1 glass rounded-[4rem] border-white/10 shadow-2xl flex flex-col relative transition-all duration-700 overflow-hidden",
          showAutomations ? "opacity-30 pointer-events-none scale-[0.98] blur-xl" : "opacity-100"
        )}>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
          
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 scroll-smooth custom-scrollbar"
          >
            <AnimatePresence initial={false}>
              {messages.map((message, i) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.1 }}
                  className={cn(
                    "flex flex-col gap-4 max-w-[85%]",
                    message.role === 'user' ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "flex items-center gap-3 px-2 mb-[-10px]",
                    message.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}>
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border relative overflow-hidden transition-all",
                      message.role === 'model' 
                        ? "bg-primary/10 text-primary border-primary/30" 
                        : "glass text-white/50 border-white/10"
                    )}>
                      {message.role === 'model' ? <AuminaBot size="sm" isSpeaking={i === messages.length - 1 && isSpeaking} /> : <User size={20} />}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                      {message.role === 'model' ? 'Aumina Core' : 'Subject'}
                    </span>
                  </div>

                  <div className="group relative max-w-full">
                    <div className={cn(
                      "p-7 md:p-9 rounded-[2.5rem] text-[14px] md:text-[15px] leading-relaxed transition-all shadow-xl relative overflow-visible border",
                      message.role === 'model' 
                        ? "glass-dark text-slate-200 border-white/5 whitespace-pre-wrap font-sans" 
                        : "bg-primary text-black font-semibold border-primary shadow-[0_15px_30px_rgba(34,211,238,0.15)]"
                    )}>
                      {message.role === 'model' && (
                        <div className="absolute -left-1 top-10 w-0.5 h-12 bg-primary/40 rounded-full" />
                      )}
                      {message.content}
                      
                      <div className={cn(
                        "text-[8px] uppercase font-bold tracking-[0.3em] mt-6 opacity-30 italic flex items-center gap-2",
                        message.role === 'user' ? "justify-end" : ""
                      )}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • TRANSMISSION_{i.toString().padStart(3, '0')}
                      </div>
                    </div>
                    
                    {/* Visual accent for user messages */}
                    {message.role === 'user' && (
                      <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-primary/10 rounded-full blur-xl -z-10" />
                    )}
                  </div>

                    {message.automationProposal && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass p-10 rounded-[3rem] border-primary/40 bg-primary/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group"
                      >
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 group-hover:bg-primary/20 transition-colors" />
                        
                        <div className="flex items-center gap-5 mb-8">
                          <div className="p-4 bg-primary text-black rounded-3xl shadow-xl">
                            <Plus size={24} />
                          </div>
                          <div>
                            <h4 className="text-xl font-display font-bold text-white uppercase tracking-widest">{message.automationProposal.name}</h4>
                            <p className="text-[11px] text-primary uppercase tracking-[0.3em] font-bold mt-1">Logic Node Synthesis Pending</p>
                          </div>
                        </div>

                        <div className="space-y-5 mb-10 bg-black/40 p-8 rounded-[2rem] border border-white/10 shadow-inner">
                           <div className="flex items-center gap-5">
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest w-24">Activation</span>
                              <div className="px-5 py-2 glass rounded-2xl border-primary/20 text-[11px] font-mono text-primary font-bold uppercase shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                                 {message.automationProposal.trigger.type} :: {message.automationProposal.trigger.value}
                              </div>
                           </div>
                           <div className="space-y-4">
                             <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Execution Pipeline</span>
                             {message.automationProposal.actions.map((action: any, i: number) => (
                               <div key={i} className="flex items-center gap-5 pl-5 group/item">
                                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                                  <span className="text-[11px] font-bold text-slate-300 group-hover/item:text-white transition-colors">{action.deviceName}</span>
                                  <div className="flex-1 border-b border-white/5 border-dashed" />
                                  <span className="text-primary text-[11px] font-mono font-bold px-3 py-1 bg-white/5 rounded-lg">{action.command}()</span>
                               </div>
                             ))}
                           </div>
                        </div>

                        <div className="flex gap-5">
                          <button 
                            onClick={() => handleConfirmAutomation(message.automationProposal, message.id)}
                            className="flex-1 py-5 bg-primary text-black text-[11px] font-bold uppercase tracking-[0.2em] rounded-[1.5rem] hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_15px_30px_-10px_rgba(34,211,238,0.4)]"
                          >
                            <Check size={20} /> Deploy Neural Node
                          </button>
                          <button 
                            onClick={() => setMessages(prev => prev.map(m => m.id === message.id ? { ...m, automationProposal: null } : m))}
                            className="px-8 py-5 glass rounded-[1.5rem] text-slate-500 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {message.recommendations && message.recommendations.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 w-full max-w-2xl"
                      >
                        {message.recommendations.map((product) => (
                          <Link 
                            key={product.id}
                            to={`/rooms/${product.room.toLowerCase().replace(' ', '-')}?product=${product.id}`} 
                            className="glass p-5 rounded-3xl border-white/5 hover:border-primary/30 transition-all group flex flex-col gap-4 bg-white/[0.02]"
                          >
                            <div className="aspect-square rounded-2xl overflow-hidden bg-black/40 relative">
                              <img src={product.image || undefined} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                  <ShoppingBag size={12} /> View Details
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">{product.category}</div>
                              <h5 className="text-white font-bold text-sm truncate">{product.name}</h5>
                              <div className="mt-2 text-sm font-bold text-white">₹{product.price.toLocaleString()}</div>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-6"
                >
                  <div className="w-14 h-14 rounded-[1.5rem] bg-primary/20 text-primary border border-primary/40 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                    <AuminaBot size="md" isThinking isSpeaking={isSpeaking} />
                  </div>
                  <div className="glass-dark p-8 px-10 rounded-[2.5rem] flex gap-3 items-center border-white/10 shadow-2xl">
                    <motion.span 
                      animate={{ scale: [1, 1.8, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                    />
                    <motion.span 
                      animate={{ scale: [1, 1.8, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                      className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                    />
                    <motion.span 
                      animate={{ scale: [1, 1.8, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                      className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-10 border-t border-white/5 bg-black/80 backdrop-blur-3xl relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            
            {/* Quick Actions */}
            <div className="flex gap-4 mb-8 overflow-x-auto custom-scrollbar pb-2 max-w-5xl mx-auto no-scrollbar">
               {[
                 { label: 'Find Best Match', icon: <Sparkles size={12} className="text-primary" /> },
                 { label: 'Product Advice', icon: <ShoppingBag size={12} /> },
                 { label: 'Automate Morning', icon: <Cpu size={12} /> },
                 { label: 'Daily Reports', icon: <Terminal size={12} /> },
                 { label: 'Security Scan', icon: <Shield size={12} /> },
                 { label: 'Recalibrate System', icon: <BrainCircuit size={12} /> }
               ].map((action, i) => (
                 <button 
                   key={i}
                   onClick={() => {
                     setInput(action.label === 'Find Best Match' ? "Identify the absolute best product for my needs and take me there." : action.label);
                     playSound('pop');
                   }}
                   className="whitespace-nowrap px-6 py-3 glass border-white/5 rounded-2xl text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary hover:border-primary/20 transition-all flex items-center gap-2 group"
                 >
                    <span className="group-hover:scale-110 transition-transform">{action.icon}</span>
                    {action.label}
                 </button>
               ))}
            </div>

            <form onSubmit={handleSend} className="relative flex items-end gap-6 max-w-5xl mx-auto">
              <div className="flex-1 relative group bg-white/[0.03] rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all shadow-inner px-8 py-5">
                <textarea 
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Transmit instructions to Aumina..."
                  className="w-full bg-transparent text-white focus:outline-none text-[12px] md:text-[13px] font-bold uppercase tracking-[0.2em] placeholder:text-slate-800 resize-none min-h-[40px] max-h-[200px] py-2"
                  style={{ height: 'auto' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                />
                <div className="absolute right-6 bottom-6 opacity-20 pointer-events-none">
                   <Sparkles size={16} className="text-primary" />
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className={cn(
                  "w-16 h-16 md:w-20 md:h-20 rounded-[2.2rem] flex items-center justify-center transition-all shadow-2xl shrink-0 overflow-hidden relative",
                  isLoading || !input.trim() 
                    ? "bg-white/5 text-slate-800 cursor-not-allowed" 
                    : "bg-primary text-black hover:scale-[1.05] active:scale-95 shadow-[0_15px_30px_-10px_rgba(34,211,238,0.5)] glow-primary"
                )}
              >
                <AnimatePresence mode="wait">
                   {isLoading ? (
                     <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                       <div className="w-5 h-5 border-3 border-black/20 border-t-black rounded-full animate-spin" />
                     </motion.div>
                   ) : (
                     <motion.div key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                       <Send size={24} className="md:size-28" />
                     </motion.div>
                   )}
                </AnimatePresence>
              </button>
            </form>
          </div>
        </div>

        {/* Node Logic Core (Automations Panel) */}
        <AnimatePresence>
          {showAutomations && (
            <motion.div 
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-full lg:w-[450px] glass rounded-[3.5rem] border-white/10 flex flex-col overflow-hidden bg-black/60 backdrop-blur-[40px] shadow-2xl relative z-50 border-l"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
               <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
               
               <div className="p-10 border-b border-white/5 flex items-center justify-between relative z-10 bg-white/[0.02]">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white italic tracking-tight uppercase">Logic Core</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold mt-1 inline-flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                       Active Schematics
                    </p>
                  </div>
                  <button onClick={() => setShowAutomations(false)} className="w-12 h-12 flex items-center justify-center glass rounded-2xl text-slate-500 hover:text-white transition-all">
                    <X size={20} />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar relative z-10">
                  {automations.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-40">
                      <Terminal size={48} className="text-slate-700 mb-6" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-600">Schematic Null</p>
                      <p className="text-[9px] mt-4 uppercase tracking-[0.2em] font-medium leading-relaxed max-w-[200px]">Prompt Aumina to architect new automation sequences</p>
                    </div>
                  ) : (
                    automations.map((automation) => (
                      <motion.div 
                        key={automation.id}
                        layout
                        className={cn(
                          "glass p-8 rounded-[2.5rem] border-white/5 relative group transition-all hover:border-primary/20 bg-white/[0.02] shadow-lg",
                          !automation.enabled && "opacity-40 grayscale"
                        )}
                      >
                         <div className="flex items-start justify-between mb-6">
                            <div className="flex-1 pr-4">
                               <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">{automation.name}</h4>
                               <p className="text-[9px] text-slate-500 uppercase tracking-[0.1em] mt-2 leading-relaxed font-bold">{automation.description}</p>
                            </div>
                            <div className="flex gap-2">
                               <button 
                                 onClick={() => {
                                   playSound('success');
                                   // In a real app, this would trigger the automation
                                 }}
                                 className="w-10 h-10 flex items-center justify-center glass rounded-xl text-primary hover:bg-primary/10 transition-all border border-primary/20"
                               >
                                  <Play size={14} fill="currentColor" />
                                </button>
                                <button 
                                 onClick={() => {
                                   updateAutomation(automation.id, { enabled: !automation.enabled });
                                   playSound('click');
                                 }}
                                 className={cn(
                                   "w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-lg",
                                   automation.enabled ? "bg-primary text-black" : "bg-slate-800 text-slate-500"
                                 )}
                               >
                                  <Zap size={14} className={cn("transition-transform duration-500", automation.enabled && "rotate-180")} />
                               </button>
                            </div>
                         </div>

                         <div className="space-y-4 px-2 border-l border-white/5 ml-2">
                            <div className="flex items-center gap-3">
                               <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_#8b5cf6] animate-pulse" />
                               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{automation.trigger.type} :: {automation.trigger.value}</span>
                            </div>
                            <div className="space-y-3">
                               {automation.actions.map((action, i) => (
                                 <div key={i} className="text-[9px] font-mono flex items-center gap-3">
                                   <div className="w-1 h-1 rounded-full bg-slate-600" />
                                   <span className="text-slate-500 font-bold uppercase">{action.deviceName}</span>
                                   <div className="flex-1 border-b border-white/5 border-dashed" />
                                   <span className="text-primary font-bold">{action.command}()</span>
                                 </div>
                               ))}
                            </div>
                         </div>

                         <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6 opacity-60">
                            <div className="flex flex-col gap-1">
                               <span className="text-[8px] font-mono text-slate-600 uppercase">SYN_ID: {automation.id.slice(0, 8)}</span>
                            </div>
                            <button 
                              onClick={() => {
                                deleteAutomation(automation.id);
                                playSound('click');
                              }}
                              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors"
                            >
                               <Trash2 size={14} />
                            </button>
                         </div>
                         
                         {/* Diagnostic background subtle text */}
                         <div className="absolute top-4 right-4 text-[7px] font-mono text-white/[0.02] pointer-events-none select-none uppercase">
                            Node_Sync_Ready // Schema_v1.2
                         </div>
                      </motion.div>
                    ))
                  )}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
