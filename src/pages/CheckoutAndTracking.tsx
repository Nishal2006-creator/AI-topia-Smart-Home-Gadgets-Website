import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, CreditCard, CheckCircle2, Package, Truck, Home as HomeIcon, ChevronRight, ShieldCheck, Zap, Smartphone, Building2, CalendarClock, QrCode, CreditCard as CardIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/src/context/CartContext';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
import { cn, playSound } from '@/src/lib/utils';
import { PRODUCTS } from '@/src/data';
import confetti from 'canvas-confetti';
import { createOrder } from '@/src/services/db';
import { sendOrderNotifications } from '@/src/services/notificationService';

export const CheckoutAndTracking = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [step, setStep] = React.useState(1);
  const [isOrdered, setIsOrdered] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [lastOrderId, setLastOrderId] = React.useState<string | null>(null);

  const [billingInfo, setBillingInfo] = React.useState({
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zip: ''
  });

  React.useEffect(() => {
    if (user && !billingInfo.email) {
      setBillingInfo(prev => ({
        ...prev,
        firstName: prev.firstName || user.displayName?.split(' ')[0] || '',
        lastName: prev.lastName || user.displayName?.split(' ')[1] || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  const subtotal = total;
  const shipping = 1999;
  const tax = subtotal * 0.05;
  const finalTotal = subtotal + shipping + tax;

  const [trackStep, setTrackStep] = React.useState(1);
  const [isDelivered, setIsDelivered] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState<'card' | 'upi' | 'emi' | 'netbanking'>('card');

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
      playSound('click');
    } else {
      setLoading(true);
      try {
        const orderId = await createOrder({
          userId: user?.uid || 'anonymous',
          items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          total: finalTotal,
          status: 'pending'
        });
        
        // Dispatch alerts & bills
        if (orderId) {
          await sendOrderNotifications(orderId, user?.email || billingInfo.email, finalTotal, billingInfo.phone);
          
          // 3. Transmit to Make.com Automation via Backend
          try {
            await fetch('/api/broadcast', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                event: 'order_completion',
                orderId,
                userId: user?.uid || 'anonymous',
                userName: user?.displayName || `${billingInfo.firstName} ${billingInfo.lastName}`,
                userEmail: user?.email || billingInfo.email,
                items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
                total: finalTotal,
                billingInfo,
                source: 'Neural Rig Checkout Interface'
              })
            });
          } catch (webhookErr) {
            console.error('Make.com broadcast failed:', webhookErr);
          }
        }

        setLastOrderId(orderId);
        setIsOrdered(true);
        playSound('success');
        clearCart();

        // Inform user about simulation
        setTimeout(() => {
          alert(`NEURAL SYSTEM ALERT:\n\n1. Node sync initiated.\n2. Notification signals logged in registry.\n\nNote: For real-world WhatsApp/Email delivery, an API key (Twilio/Resend) must be linked to the backend.`);
        }, 1500);

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22d3ee', '#a855f7', '#ec4899']
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (items.length === 0 && !isOrdered) {
    return (
      <div className="pt-40 pb-20 text-center px-6">
        <h1 className="text-4xl font-display font-bold text-white mb-4 italic">No Active <span className="text-primary">Sync</span></h1>
        <p className="text-slate-500 max-w-sm mx-auto mb-10 text-xs font-bold uppercase tracking-widest leading-relaxed">No hardware signals detected in payment channel. Please return to your rig.</p>
        <button onClick={() => navigate('/rooms')} className="px-10 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl glow-primary">Connect Hardware</button>
      </div>
    );
  }

  if (isOrdered) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto flex flex-col items-center text-center">
        <motion.div
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           className="w-24 h-24 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-8 glow-primary"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h1 className="text-6xl font-display font-bold text-white mb-4 italic">Neural Link <span className="text-primary">Established</span></h1>
        <p className="text-slate-500 mb-12 max-w-md text-xs font-bold uppercase tracking-widest leading-relaxed">Your hardware is being synchronized with Node 84-X. Track the neural shipment below.</p>

        <div className="w-full glass p-10 rounded-[3rem] border-primary/20 relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 p-8 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Real-time Logistics Sync</span>
          </div>
          
          <h3 className="text-white font-display font-bold text-2xl mb-12 italic">Logistics <span className="text-primary">Timeline</span></h3>
          
          <div className="space-y-0 relative">
            {[
              { status: 'Signal Received', icon: <Zap size={24} />, date: 'Neural Handshake Complete' },
              { status: 'Hardware Packing', icon: <Package size={24} />, date: 'Synchronizing components...' },
              { status: 'Trans-Neural Transit', icon: <Truck size={24} />, date: 'Expected 2 cycles' },
              { status: 'Node Delivery', icon: <HomeIcon size={24} />, date: 'Safe Zone 7' },
            ].map((s, i, arr) => {
              const isDone = i < trackStep;
              const isActive = i === trackStep;
              const isLast = i === arr.length - 1;
              const isDeliveredStep = isLast && isDone;

              return (
                <div key={i} className="flex gap-8 pb-12 last:pb-0 relative">
                  {i < arr.length - 1 && (
                    <div className={cn(
                      "absolute left-7 top-14 w-0.5 h-full transition-colors duration-1000",
                      isDone ? "bg-primary" : "bg-white/5"
                    )} />
                  )}
                  
                  <motion.div 
                    initial={isActive ? { scale: 0.8, opacity: 0.5 } : false}
                    animate={isDeliveredStep ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                      filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
                    } : isActive ? { 
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        "0 0 0px rgba(34, 211, 238, 0)",
                        "0 0 20px rgba(34, 211, 238, 0.4)",
                        "0 0 0px rgba(34, 211, 238, 0)"
                      ]
                    } : { scale: 1, opacity: 1 }}
                    transition={{ 
                      duration: isDeliveredStep ? 0.5 : 2,
                      repeat: isDeliveredStep ? 2 : Infinity,
                      ease: "easeInOut"
                    }}
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all duration-500",
                      isDone ? "bg-primary text-black glow-primary" : isActive ? "bg-primary/20 text-primary border border-primary/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]" : "glass text-slate-600 border-white/5"
                    )}
                  >
                    {isDeliveredStep ? <CheckCircle2 size={28} /> : s.icon}
                  </motion.div>

                  <div className="flex-1 pt-2">
                    <motion.div 
                      animate={isActive ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={cn("text-xl font-display font-bold transition-colors", isActive ? "text-primary" : isDone ? "text-white" : "text-slate-600")}
                    >
                      {s.status}
                      {isActive && <span className="ml-3 inline-flex h-2 w-2 rounded-full bg-primary animate-ping" />}
                      {isDeliveredStep && (
                        <motion.span 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="ml-3 text-[10px] text-green-400 font-mono"
                        >
                          SUCCESS_DELIVERY
                        </motion.span>
                      )}
                    </motion.div>
                    <div className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">
                      {isDone ? 'COMPLETED' : isActive ? s.date : 'AWAITING_SIGNAL'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!isDelivered && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                if (trackStep < 3) {
                  setTrackStep(prev => prev + 1);
                  playSound('click');
                } else {
                  setTrackStep(prev => prev + 1);
                  setIsDelivered(true);
                  playSound('success');
                  confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#22d3ee', '#10b981']
                  });
                }
              }}
              className="mt-12 w-full py-4 glass border border-primary/20 rounded-2xl text-[9px] font-bold text-primary uppercase tracking-[0.3em] hover:bg-primary/10 transition-all flex items-center justify-center gap-3 group"
            >
              Advance Neural Sequence <ChevronRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </motion.button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          <button 
            onClick={() => navigate('/')}
            className="px-10 py-5 glass border-white/10 rounded-2xl text-xs font-bold text-white uppercase tracking-[0.2em] hover:bg-white/5 transition-all w-full sm:w-auto"
          >
            Return to Hub
          </button>
          
          {lastOrderId && (
            <button 
              onClick={() => navigate(`/invoice/${lastOrderId}`)}
              className="px-10 py-5 bg-white text-black rounded-2xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-slate-200 transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Generate Bill <Zap size={14} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          {/* Steps Indicator */}
          <div className="flex gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-500",
                  step === s ? "bg-primary text-black glow-primary" : step > s ? "bg-white text-black" : "glass text-slate-600 border-white/5"
                )}>
                  {step > s ? <CheckCircle2 size={18} /> : s}
                </div>
                {s < 3 && <div className={cn("w-12 h-px transition-colors duration-700", step > s ? "bg-primary" : "bg-white/10")} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-10 rounded-[3rem] border-white/10 min-h-[500px] flex flex-col justify-between"
            >
              <div>
                {step === 1 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-4xl font-display font-bold text-white mb-2 italic">Dispatch <span className="text-primary">Node</span></h2>
                      <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Specify delivery coordinates</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">First Name</label>
                        <input 
                          type="text" 
                          value={billingInfo.firstName}
                          onChange={(e) => setBillingInfo({...billingInfo, firstName: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Last Name</label>
                        <input 
                          type="text" 
                          value={billingInfo.lastName}
                          onChange={(e) => setBillingInfo({...billingInfo, lastName: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Email / Signal ID</label>
                        <input 
                          type="email" 
                          value={billingInfo.email}
                          onChange={(e) => setBillingInfo({...billingInfo, email: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Neural Phone / WhatsApp</label>
                        <input 
                          type="tel" 
                          placeholder="+91 ##########"
                          value={billingInfo.phone}
                          onChange={(e) => setBillingInfo({...billingInfo, phone: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        placeholder="Street, Node, Sector"
                        value={billingInfo.address}
                        onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Zone / City</label>
                        <input 
                          type="text" 
                          value={billingInfo.city}
                          onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Zip / Node ID</label>
                        <input 
                          type="text" 
                          value={billingInfo.zip}
                          onChange={(e) => setBillingInfo({...billingInfo, zip: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    {/* Dynamic Background Elements */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[3rem]">
                      <motion.div 
                        animate={{ 
                          rotate: theme.animationsEnabled ? [0, 360] : 0,
                          scale: theme.animationsEnabled ? [1, 1.2, 1] : 1,
                        }}
                        transition={{ duration: 20 / (theme.backgroundSpeed || 1), repeat: Infinity, ease: "linear" }}
                        className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-[100px]"
                      />
                      <motion.div 
                        animate={{ 
                          rotate: theme.animationsEnabled ? [360, 0] : 0,
                          scale: theme.animationsEnabled ? [1, 1.5, 1] : 1,
                        }}
                        transition={{ duration: 25 / (theme.backgroundSpeed || 1), repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-secondary/5 rounded-full blur-[100px]"
                      />
                    </div>

                    <div className="relative z-10">
                      <h2 className="text-4xl font-display font-bold text-white mb-2 italic">Neural <span className="text-primary">Transaction</span></h2>
                      <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Select and authorize transmission protocol</p>
                    </div>

                    {/* Method Selection */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                      {[
                        { id: 'upi', label: 'UPI / QR', icon: <Smartphone size={20} />, active: paymentMethod === 'upi' },
                        { id: 'card', label: 'Cards', icon: <CardIcon size={20} />, active: paymentMethod === 'card' },
                        { id: 'emi', label: 'EMI', icon: <CalendarClock size={20} />, active: paymentMethod === 'emi' },
                        { id: 'netbanking', label: 'Net Banking', icon: <Building2 size={20} />, active: paymentMethod === 'netbanking' },
                      ].map((m) => (
                        <motion.button
                          key={m.id}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setPaymentMethod(m.id as any);
                            playSound('click');
                          }}
                          className={cn(
                            "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group h-32",
                            m.active 
                              ? "bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(34,211,238,0.2)]" 
                              : "glass border-white/5 text-slate-500 hover:border-white/20 hover:text-white"
                          )}
                        >
                          {m.active && (
                            <motion.div 
                              layoutId="active-bg"
                              className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none" 
                            />
                          )}
                          <div className={cn("transition-transform duration-500", m.active && "scale-110")}>{m.icon}</div>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-center">{m.label}</span>
                        </motion.button>
                      ))}
                    </div>

                    <div className="mt-8 relative z-10 perspective-2000">
                      <AnimatePresence mode="wait">
                        {paymentMethod === 'card' && (
                          <motion.div
                            key="card-form"
                            initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            exit={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                            className="space-y-6"
                          >
                            <div className="perspective-1000">
                              <motion.div 
                                whileHover={{ rotateY: 15, rotateX: 5 }}
                                className="glass p-8 rounded-3xl border-primary/20 relative overflow-hidden bg-gradient-to-br from-primary/10 to-transparent mb-8 group"
                                style={{ transformStyle: 'preserve-3d' }}
                              >
                                <div className="absolute top-0 right-0 p-6">
                                  <div className="w-12 h-8 rounded bg-gradient-to-tr from-slate-400 to-slate-600 opacity-20" />
                                </div>
                                <CreditCard className="mb-10 text-primary group-hover:scale-110 transition-transform" size={32} style={{ transform: 'translateZ(30px)' }} />
                                <div className="text-2xl font-mono text-white mb-8 tracking-widest" style={{ transform: 'translateZ(50px)' }}>•••• •••• •••• 8492</div>
                                <div className="flex justify-between items-end" style={{ transform: 'translateZ(30px)' }}>
                                  <div>
                                    <div className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">Neural Holder</div>
                                    <div className="text-sm font-bold text-white uppercase tracking-wider">{billingInfo.firstName || 'SYS'} {billingInfo.lastName || 'ADMIN'}</div>
                                  </div>
                                  <div className="text-sm font-bold text-white italic">09 / 30</div>
                                </div>
                              </motion.div>
                            </div>

                            <div className="space-y-6">
                              <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Hardware Card ID</label>
                                <input type="text" placeholder="#### #### #### ####" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none" />
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Sync Date (MM/YY)</label>
                                  <input type="text" placeholder="00 / 00" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Security Seal (CVC)</label>
                                  <input type="password" placeholder="•••" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none" />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {paymentMethod === 'upi' && (
                          <motion.div
                            key="upi-form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-8"
                          >
                            <div className="flex flex-col items-center gap-6 p-8 glass rounded-3xl border-primary/10">
                              <div className="w-48 h-48 bg-white p-4 rounded-2xl relative group cursor-pointer">
                                <QrCode className="w-full h-full text-black" />
                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl">
                                  <span className="text-[10px] font-bold text-black uppercase bg-primary px-3 py-1 rounded-full">Scan with UPI App</span>
                                </div>
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-xl flex items-center justify-center animate-bounce shadow-lg">
                                  <Zap size={14} className="text-black" />
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] text-center">Scan QR or enter Neural ID below</p>
                            </div>

                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Neural VPA (UPI ID)</label>
                                <div className="relative">
                                  <input type="text" placeholder="user@upi" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-4 pr-16 text-sm text-white focus:border-primary/50 outline-none" />
                                  <button className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary/10 text-primary text-[8px] font-bold rounded-lg border border-primary/20">Verify</button>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-3">
                                {['GPay', 'PhonePe', 'Paytm'].map(app => (
                                  <button key={app} className="py-3 glass rounded-xl border-white/5 text-[10px] font-bold text-slate-400 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest">
                                    {app}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {paymentMethod === 'emi' && (
                          <motion.div
                            key="emi-form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-6"
                          >
                            <div className="p-6 bg-secondary/5 border border-secondary/20 rounded-3xl">
                              <h4 className="text-secondary font-bold uppercase tracking-[0.2em] text-xs mb-2">Quantum Installment Plan</h4>
                              <p className="text-[10px] text-slate-500 leading-relaxed font-bold">Distribute the neural credit over multiple cycles with no added overhead.</p>
                            </div>
                            
                            <div className="space-y-4">
                              {[
                                { months: 3, amount: finalTotal / 3, label: '3 Months - No Cost' },
                                { months: 6, amount: finalTotal / 6, label: '6 Months - No Cost' },
                                { months: 12, amount: (finalTotal * 1.1) / 12, label: '12 Months - 12% Per Annum' },
                              ].map((plan) => (
                                <button key={plan.months} className="w-full p-6 glass rounded-2xl border-white/5 hover:border-primary/30 transition-all group flex items-center justify-between text-left">
                                  <div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-primary transition-colors">{plan.label}</div>
                                    <div className="text-xl font-display font-bold text-white mt-1">₹{plan.amount.toFixed(0).toLocaleString()} <span className="text-[10px] text-slate-500 uppercase">/ cycle</span></div>
                                  </div>
                                  <div className="w-6 h-6 rounded-full border-2 border-white/10 group-hover:border-primary group-hover:bg-primary/20 transition-all" />
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {paymentMethod === 'netbanking' && (
                          <motion.div
                            key="nb-form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-8"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              {['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'Yes Bank'].map(bank => (
                                <button key={bank} className="p-4 glass rounded-2xl border-white/5 flex flex-col items-center gap-3 group hover:border-primary/30 transition-all">
                                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-xs text-slate-500 group-hover:bg-primary/20 group-hover:text-primary">{bank[0]}</div>
                                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-white uppercase tracking-widest">{bank}</span>
                                </button>
                              ))}
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Other Institutional Nodes</label>
                               <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-400 focus:border-primary/50 outline-none italic appearance-none">
                                 <option>Search your bank cluster...</option>
                               </select>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-4xl font-display font-bold text-white mb-2 italic">Signal <span className="text-primary">Verification</span></h2>
                      <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Review neural hardware allocation</p>
                    </div>

                    <div className="space-y-4">
                      <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 uppercase font-bold tracking-widest">Receiver</span>
                          <span className="text-white font-bold">{billingInfo.firstName} {billingInfo.lastName}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 uppercase font-bold tracking-widest">Node Path</span>
                          <span className="text-white font-bold">{billingInfo.address}, {billingInfo.city}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 uppercase font-bold tracking-widest">Hardware Count</span>
                          <span className="text-white font-bold">{items.length} Modules</span>
                        </div>
                      </div>

                      <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-4">
                        <ShieldCheck className="text-primary shrink-0" size={24} />
                        <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                          Encryption active. Neural credentials will be cleared upon successful signal verification.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={handleNext}
                disabled={loading}
                className="w-full py-5 mt-12 bg-primary text-black font-bold uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
              >
                {loading ? 'Processing Neural Link...' : (step === 3 ? 'Establish All Links' : 'Continue Synchronization')}
                {!loading && <ChevronRight size={18} />}
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className="w-full lg:w-[380px]">
          <div className="glass p-8 rounded-[3rem] border-white/10 sticky top-28 bg-gradient-to-b from-white/5 to-transparent">
            <h3 className="text-white font-display font-bold text-xl mb-8 italic">Your <span className="text-primary">Rig</span></h3>
            
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar mb-8">
              {items.map(item => (
                <div key={item.id} className="flex gap-5 items-center">
                  <div className="w-16 h-16 rounded-2xl bg-black/40 overflow-hidden border border-white/10 shrink-0">
                    <img src={item.image || null} className="w-full h-full object-cover grayscale" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white font-bold truncate">{item.name}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                      Qty: {item.quantity} • ₹{item.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-white">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-white/5 pt-6">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <span>Sub-Signal</span>
                <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <span>Logistics</span>
                <span className="text-white">₹{shipping.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <span>Tax</span>
                <span className="text-white">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                <span className="text-white font-display font-bold text-lg italic">Final <span className="text-primary">Credit</span></span>
                <span className="text-3xl font-display font-bold text-white">
                  <span className="text-primary text-xl mr-1">₹</span>{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
