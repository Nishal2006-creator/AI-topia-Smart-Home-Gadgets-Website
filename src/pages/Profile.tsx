import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Shield, Zap, BadgeCheck, LogOut, Camera, Save, ShoppingBag, Palette, LayoutGrid, Sparkles, RefreshCw, Layers, Check, Maximize, SunMoon, Radio, Languages, Github, MessageSquare, Hash } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { cn, playSound } from '@/src/lib/utils';
import { updateProfile } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { sendOrderNotifications } from '@/src/services/notificationService';
import { getUserProfile, syncUserProfile } from '@/src/services/db';

const PRESETS = [
  { name: 'Aumina Default', primary: '#00f2ff', secondary: '#7000ff', accent: '#ff00d4', uiStyle: 'glassmorphism' as const },
  { name: 'Cyberpunk 2077', primary: '#fdf500', secondary: '#ff003c', accent: '#05d9e8', uiStyle: 'neon' as const },
  { name: 'Minimal Mono', primary: '#ffffff', secondary: '#333333', accent: '#666666', uiStyle: 'minimal' as const },
  { name: 'Deep Space', primary: '#3b82f6', secondary: '#1e3a8a', accent: '#1d4ed8', uiStyle: '3d' as const },
  { name: 'Royal Crimson', primary: '#ef4444', secondary: '#7f1d1d', accent: '#dc2626', uiStyle: 'glassmorphism' as const },
];

export const Profile = () => {
  const { user, isAdmin, logout } = useAuth();
  const { theme, updateTheme, resetTheme, saveGlobalTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [linkedServices, setLinkedServices] = useState({
    discord: false,
    github: false,
    slack: false
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'colors' | 'layout' | 'effects'>('colors');
  const [savingTheme, setSavingTheme] = useState(false);
  const [testingSignal, setTestingSignal] = useState(false);

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  ] as const;


  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const profile = await getUserProfile(user.uid);
        if (profile) {
          if (profile.displayName) setDisplayName(profile.displayName);
          if (profile.photoURL) setPhotoURL(profile.photoURL);
          if (profile.linkedServices) setLinkedServices(profile.linkedServices);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleTestSignal = async () => {
    setTestingSignal(true);
    playSound('click');
    try {
      await sendOrderNotifications('TEST-' + Math.random().toString(36).substring(7).toUpperCase(), user?.email || 'test@example.com', 9999, '+919999999999');
      // After testing, check config again in case they just added it
      playSound('success');
      alert('TEST SIGNAL DISPATCHED:\n1. Check Browser Console (Inspect > Console) for simulated delivery logs.\n2. Notifications recorded in Firestore registry.\n3. Verify Admin Console for queued status.');
    } catch (err: any) {
      console.error(err);
      playSound('alert');
      alert(`SIGNAL FAILURE: ${err.message || 'Unknown protocol error'}`);
    } finally {
      setTestingSignal(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsUpdating(true);
    try {
      // Update Firebase Auth
      await updateProfile(user, { displayName, photoURL });
      
      // Sync with Firestore
      await syncUserProfile(user.uid, {
        displayName,
        photoURL,
        linkedServices,
        updatedAt: new Date()
      });

      setSuccess(true);
      playSound('success');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      playSound('alert');
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleService = (service: keyof typeof linkedServices) => {
    setLinkedServices(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
    playSound('toggle');
  };

  const handlePublishTheme = async () => {
    setSavingTheme(true);
    try {
      await saveGlobalTheme();
      playSound('success');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingTheme(false);
    }
  };

  const handlePresetSelect = (preset: typeof PRESETS[0]) => {
    updateTheme({
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
      uiStyle: preset.uiStyle
    });
    playSound('success');
  };

  if (!user || loadingProfile) return (
    <div className="pt-48 px-6 text-center">
      <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
      <div className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">
        {loadingProfile ? 'Synchronizing Neural Profile' : 'Connect your neural link to view profile'}
      </div>
    </div>
  );

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Sidebar / Stats */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border-white/5 flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-2 border-primary/30 p-1 mb-6 relative overflow-hidden">
                <img 
                  src={photoURL || `https://ui-avatars.com/api/?name=${displayName || user.email}&background=0D0D0D&color=fff`} 
                  className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                  alt="Avatar" 
                />
              </div>
              <div className="absolute bottom-6 right-0 p-2 bg-primary text-black rounded-xl shadow-lg hover:scale-110 transition-transform">
                <Camera size={16} />
              </div>
            </div>
            
            <h2 className="text-xl font-display font-bold text-white italic">{user.displayName}</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{isAdmin ? 'System Administrator' : 'Neural Architect'}</p>
            
            <div className="w-full h-px bg-white/5 my-6" />
            
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center px-4 py-3 glass rounded-xl border-white/5">
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Node Status</span>
                 <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest flex items-center gap-1">
                   <Zap size={10} /> Active
                 </span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 glass rounded-xl border-white/5">
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Identity</span>
                 <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                   <BadgeCheck size={10} /> Verified
                 </span>
              </div>
            </div>

            <Link
              to="/orders"
              className="w-full mt-6 py-4 glass text-primary text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
              onClick={() => playSound('click')}
            >
              <ShoppingBag size={14} /> Order History
            </Link>

            <button 
              onClick={() => { logout(); playSound('alert'); }}
              className="w-full mt-8 py-4 glass text-accent text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-accent/10 transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={14} /> Disconnect Link
            </button>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border-white/5 bg-gradient-to-br from-primary/5 to-transparent">
             <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <Shield size={12} className="text-primary" />
                {t('profile.security')}
             </h4>
             <p className="text-[10px] text-slate-500 leading-relaxed mb-6">
               Your identity is protected by Aumina Neural Shield. Last synchronization: {new Date().toLocaleDateString()}.
             </p>

             <div className="space-y-3 mb-6">
               <div className="flex items-center justify-between px-4 py-2 glass rounded-xl border-white/5">
                 <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Email Engine</span>
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
               </div>
               <div className="flex items-center justify-between px-4 py-2 glass rounded-xl border-white/5">
                 <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">WhatsApp Link</span>
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
               </div>
             </div>

             <button 
               onClick={handleTestSignal}
               disabled={testingSignal}
               className="w-full py-3 glass border-primary/20 text-primary text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
             >
               <Radio size={12} className={testingSignal ? "animate-pulse" : ""} />
               {testingSignal ? t('ui.loading') : t('profile.test')}
             </button>
          </div>
        </div>

        {/* Settings & Tabs */}
        <div className="flex-1 space-y-8">
          {/* Identity Form */}
          <div className="glass p-10 rounded-[3rem] border-white/5">
            <div className="flex items-center gap-4 mb-10">
               <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20">
                  <User size={20} />
               </div>
               <div>
                  <h3 className="text-2xl font-display font-bold text-white italic">{t('profile.title')}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{t('profile.subtitle')}</p>
               </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] pl-4 block mb-2">{t('profile.name')}</label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full glass-dark border-white/10 rounded-2xl py-5 pl-14 pr-8 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] pl-4 block mb-2">Neural Avatar Link (URL)</label>
                  <div className="relative">
                    <Camera className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="url" 
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      className="w-full glass-dark border-white/10 rounded-2xl py-5 pl-14 pr-8 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm"
                      placeholder="https://image-url.com/avatar.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] pl-4 block mb-2">Primary Email</label>
                  <div className="relative opacity-50">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="email" 
                      value={user.email || ''} 
                      readOnly
                      className="w-full glass-dark border-white/10 rounded-2xl py-5 pl-14 pr-8 text-white focus:outline-none cursor-not-allowed text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-end pb-1">
                   <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] pl-4 block mb-2">Linked Grid Nodes</label>
                   <div className="flex gap-2">
                      {[
                        { id: 'discord' as const, icon: <MessageSquare size={14} />, color: '#5865F2' },
                        { id: 'github' as const, icon: <Github size={14} />, color: '#333' },
                        { id: 'slack' as const, icon: <Hash size={14} />, color: '#E01E5A' },
                      ].map(service => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => toggleService(service.id)}
                          className={cn(
                            "p-3 rounded-xl border transition-all flex items-center gap-2",
                            linkedServices[service.id] 
                              ? "bg-white/10 border-primary text-primary" 
                              : "glass border-white/5 text-slate-500 grayscale opacity-50 hover:opacity-100 hover:grayscale-0"
                          )}
                          title={`Connect ${service.id}`}
                        >
                          {service.icon}
                          <span className="text-[8px] font-bold uppercase tracking-widest">{service.id}</span>
                        </button>
                      ))}
                   </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className={cn(
                    "px-10 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] font-display transition-all flex items-center justify-center gap-3",
                    success 
                      ? "bg-green-500 text-white" 
                      : "bg-primary text-black glow-primary hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  )}
                >
                  {isUpdating ? t('ui.loading') : success ? (
                    <>
                       <BadgeCheck size={16} /> Update Successful
                    </>
                  ) : (
                    <>
                       <Save size={16} /> {t('profile.save')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Language Selection */}
          <div className="glass p-10 rounded-[3rem] border-white/5 border-l-4 border-l-secondary/30">
            <div className="flex items-center gap-4 mb-10">
               <div className="p-3 bg-secondary/10 rounded-2xl text-secondary border border-secondary/20">
                  <Languages size={20} />
               </div>
               <div>
                  <h3 className="text-2xl font-display font-bold text-white italic">{t('profile.language')}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Choose your neural linguistics protocol.</p>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as any);
                    playSound('success');
                  }}
                  className={cn(
                    "relative group p-6 rounded-[2rem] border transition-all duration-500 overflow-hidden",
                    language === lang.code 
                      ? "border-secondary bg-secondary/10 shadow-[0_0_20px_rgba(var(--secondary-rgb),0.1)]" 
                      : "border-white/5 hover:border-white/20 bg-white/5"
                  )}
                >
                  {language === lang.code && (
                    <motion.div 
                      layoutId="lang-glow"
                      className="absolute inset-0 bg-secondary/5 blur-xl"
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest transition-colors",
                      language === lang.code ? "text-secondary" : "text-slate-500 group-hover:text-white"
                    )}>
                      {lang.name}
                    </span>
                    <span className="text-2xl font-display italic text-white/50 group-hover:text-white transition-colors">
                      {lang.native}
                    </span>
                  </div>
                  {language === lang.code && (
                    <div className="absolute top-4 right-4 text-secondary">
                      <Check size={12} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Customization (Admin Only) */}
          {isAdmin && (
            <div className="glass p-10 rounded-[3rem] border-white/5 border-l-4 border-l-primary/30">
              <div className="flex items-center justify-between gap-4 mb-10">
                 <div className="flex items-center gap-4">
                   <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20">
                      <Palette size={20} />
                   </div>
                   <div>
                      <h3 className="text-2xl font-display font-bold text-white italic">Neural Interface</h3>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Customize your visual environment.</p>
                   </div>
                 </div>
                 
                 <div className="flex gap-1 bg-white/5 p-1 rounded-2xl">
                    {[
                      { id: 'colors', label: 'Identity', icon: <Palette size={14} /> },
                      { id: 'layout', label: 'Architecture', icon: <LayoutGrid size={14} /> },
                      { id: 'effects', label: 'Flow', icon: <Sparkles size={14} /> },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as any);
                          playSound('click');
                        }}
                        className={cn(
                          "flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                          activeTab === tab.id ? "bg-primary text-black" : "text-gray-500 hover:text-white"
                        )}
                      >
                        {tab.icon}
                        <span className="hidden md:inline">{tab.label}</span>
                      </button>
                    ))}
                  </div>
              </div>

              <div className="w-full mb-10">
                <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Layers size={14} className="text-primary" />
                  Quick Presets
                </h4>
                <div className="flex flex-wrap gap-3">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handlePresetSelect(preset)}
                      className="glass px-4 py-3 rounded-xl border-white/5 flex items-center gap-3 group hover:border-primary/30 transition-all"
                    >
                      <div className="flex -space-x-1.5">
                        <div className="w-3 h-3 rounded-full" style={{ background: preset.primary }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: preset.secondary }} />
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 group-hover:text-white uppercase tracking-widest transition-colors">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'colors' && (
                  <motion.div 
                    key="colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { label: 'Primary Node', key: 'primaryColor' as const, val: theme.primaryColor },
                        { label: 'Secondary Node', key: 'secondaryColor' as const, val: theme.secondaryColor },
                        { label: 'Accent Node', key: 'accentColor' as const, val: theme.accentColor },
                      ].map((color) => (
                        <div key={color.key} className="space-y-3">
                          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{color.label}</label>
                          <input 
                            type="color" 
                            value={color.val} 
                            onChange={(e) => {
                              updateTheme({ [color.key]: e.target.value });
                              playSound('pop');
                            }}
                            className="w-full h-14 rounded-2xl bg-black/40 border border-white/10 p-1.5 cursor-pointer transition-all hover:border-primary/50"
                          />
                          <div className="text-[10px] font-mono text-gray-600 text-center uppercase">{color.val}</div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <Layers size={14} className="text-primary" />
                          Atmosphere Mode
                        </h4>
                        <div className="grid grid-cols-5 gap-1.5 glass p-1.5 rounded-2xl">
                          {['stars', 'neural', 'dust', 'void', 'nebula'].map((bg) => (
                            <button
                              key={bg}
                              onClick={() => { updateTheme({ backgroundStyle: bg as any }); playSound('click'); }}
                              className={cn(
                                "py-2 text-[8px] font-bold uppercase tracking-tighter rounded-lg transition-all",
                                theme.backgroundStyle === bg ? "bg-primary text-black" : "text-gray-500 hover:text-white"
                              )}
                            >
                              {bg}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <SunMoon size={14} className="text-primary" />
                          Chronos Logic
                        </h4>
                        <div className="grid grid-cols-3 gap-1.5 glass p-1.5 rounded-2xl">
                          {['dark', 'light', 'auto'].map((m) => (
                            <button
                              key={m}
                              onClick={() => { updateTheme({ mode: m as any }); playSound('click'); }}
                              className={cn(
                                "py-2 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all",
                                theme.mode === m ? "bg-primary text-black" : "text-gray-500 hover:text-white"
                              )}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'layout' && (
                  <motion.div 
                    key="layout"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-8"
                  >
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                        <LayoutGrid size={14} className="text-primary" />
                        Visual Framework
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['glassmorphism', 'minimal', 'neon', '3d'].map((style) => (
                          <button
                            key={style}
                            onClick={() => { updateTheme({ uiStyle: style as any }); playSound('click'); }}
                            className={cn(
                              "py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl border transition-all",
                              theme.uiStyle === style ? "border-primary text-primary bg-primary/10" : "border-white/5 text-slate-500 hover:border-white/20 hover:text-white"
                            )}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                      {[
                        { label: 'Neural Radius', key: 'borderRadius' as const, val: theme.borderRadius, min: 0, max: 64, unit: 'px' },
                        { label: 'Spatial Density', key: 'fontSize' as const, val: theme.fontSize, min: 12, max: 24, unit: 'px' },
                      ].map((ctrl) => (
                        <div key={ctrl.key} className="space-y-3">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <span>{ctrl.label}</span>
                            <span className="text-primary font-mono">{ctrl.val}{ctrl.unit}</span>
                          </div>
                          <input 
                            type="range" min={ctrl.min} max={ctrl.max} value={ctrl.val}
                            onChange={(e) => updateTheme({ [ctrl.key]: parseInt(e.target.value) })}
                            className="w-full h-1 bg-white/10 rounded-full appearance-none accent-primary cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'effects' && (
                  <motion.div 
                    key="effects"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-8"
                  >
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                         <Maximize size={14} className="text-primary" />
                         Typographic Signature
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {['Inter', 'Space Grotesk', 'JetBrains Mono'].map((font) => (
                          <button
                            key={font}
                            onClick={() => { updateTheme({ fontFamily: font }); playSound('click'); }}
                            className={cn(
                              "w-full px-6 py-4 text-left text-xs transition-all flex items-center justify-between rounded-xl border",
                              theme.fontFamily === font ? "border-primary bg-primary/10 text-white" : "border-white/5 text-gray-500 hover:border-white/20 hover:text-white"
                            )}
                            style={{ fontFamily: font }}
                          >
                            {font} Node
                            {theme.fontFamily === font && <Check size={14} className="text-primary" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Antigravity Motion', key: 'animationsEnabled' as const, val: theme.animationsEnabled },
                        { label: 'Neural Glow', key: 'glowEnabled' as const, val: theme.glowEnabled },
                        { label: 'Bio-Acoustics', key: 'soundEnabled' as const, val: theme.soundEnabled },
                      ].map((eff) => (
                        <button 
                          key={eff.key}
                          onClick={() => { updateTheme({ [eff.key]: !eff.val }); playSound('toggle'); }}
                          className={cn(
                            "flex justify-between items-center p-4 glass rounded-2xl border transition-all",
                            eff.val ? "border-primary/30 bg-primary/5" : "border-white/5"
                          )}
                        >
                          <span className={cn("text-[9px] font-bold uppercase tracking-widest", eff.val ? "text-primary" : "text-slate-500")}>{eff.label}</span>
                          <div className={cn("w-2 h-2 rounded-full", eff.val ? "bg-primary shadow-[0_0_8px_primary]" : "bg-white/10")} />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-12 flex flex-col md:flex-row gap-4">
                <button 
                  onClick={() => { resetTheme(); playSound('alert'); }}
                  className="flex-1 py-4 glass text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} /> Reset Defaults
                </button>
                <button 
                  onClick={handlePublishTheme}
                  disabled={savingTheme}
                  className="flex-1 py-4 bg-primary text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-2xl glow-primary hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={14} /> {savingTheme ? 'Publishing...' : 'Sync Global Environment'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

