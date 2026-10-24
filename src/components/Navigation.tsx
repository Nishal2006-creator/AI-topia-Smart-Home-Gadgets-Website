import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, LogOut, Server, Terminal, BrainCog, Scan, Cog, Cloud, CloudDrizzle, Activity, CircuitBoard, Zap, Database, Languages, Check, MessageSquare, HelpCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn, playSound } from '@/src/lib/utils';
import { useTheme } from '@/src/context/ThemeContext';
import { useCart } from '@/src/context/CartContext';
import { useAuth } from '@/src/context/AuthContext';
import { useLanguage } from '@/src/context/LanguageContext';

import { Logo } from '@/src/components/Logo';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const location = useLocation();
  const { theme, updateTheme } = useTheme();
  const { items } = useCart();
  const { user, login, logout, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  ] as const;

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMode = () => {
    const nextMode = theme.mode === 'dark' ? 'light' : 'dark';
    updateTheme({ mode: nextMode });
    playSound('click');
  };

  const navLinks = [
    { name: t('nav.home'), path: '/', icon: <BrainCog size={12} /> },
    { name: t('nav.hardware'), path: '/rooms', icon: <CircuitBoard size={12} /> },
    { name: t('nav.consultant'), path: '/ai-consultant', icon: <Zap size={12} /> },
    { name: t('nav.feedback'), path: '/feedback', icon: <MessageSquare size={12} /> },
  ];

  if (user) {
    navLinks.push({ name: t('nav.orders'), path: '/orders', icon: <ShoppingCart size={12} /> });
    navLinks.push({ name: t('nav.workflows'), path: '/automations', icon: <Database size={12} /> });
  }

  if (isAdmin) {
    navLinks.push({ name: t('nav.admin'), path: '/admin', icon: <Activity size={12} /> });
  }

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-7xl z-50 print:hidden">
      <div className={cn(
        "glass rounded-2xl px-8 h-16 flex items-center justify-between transition-all duration-300",
        theme.glowEnabled && "hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
      )}>
        <Link 
          to="/" 
          className="flex items-center"
          onClick={() => playSound('click')}
        >
          <Logo size="sm" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "transition-colors hover:text-slate-900 dark:hover:text-white uppercase tracking-[0.2em] text-[10px] font-bold flex items-center gap-2",
                location.pathname === link.path ? "text-primary" : "text-slate-400"
              )}
              onClick={() => playSound('click')}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          {/* Language Selector */}
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={cn(
                "p-2 glass rounded-xl transition-all flex items-center gap-2",
                isLangOpen ? "text-primary border-primary/30" : "text-slate-400 hover:text-primary"
              )}
              title="Neural Linguistics"
            >
              <Languages size={18} />
              <span className="text-[10px] font-bold uppercase hidden lg:inline">{language}</span>
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-48 glass rounded-2xl border border-white/10 p-2 overflow-hidden shadow-2xl z-50 backdrop-blur-2xl"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setIsLangOpen(false);
                        playSound('success');
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
                        language === lang.code ? "bg-primary/10 text-primary" : "hover:bg-white/5 text-slate-400 hover:text-white"
                      )}
                    >
                      <div className="flex flex-col items-start leading-tight">
                        <span className="text-[10px] font-bold uppercase tracking-widest">{lang.name}</span>
                        <span className="text-xs italic opacity-50 group-hover:opacity-100">{lang.native}</span>
                      </div>
                      {language === lang.code && <Check size={12} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={toggleMode}
            className="p-2 glass rounded-xl text-slate-400 hover:text-primary transition-all"
            title="Toggle Neural Mode"
          >
            {theme.mode === 'dark' ? <Cloud size={18} /> : <CloudDrizzle size={18} />}
          </button>

          <Link to="/cart" className="relative group p-2 cursor-pointer" onClick={() => playSound('click')}>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-[10px] flex items-center justify-center rounded-full text-white font-bold animate-in zoom-in">
                {cartCount}
              </span>
            )}
            <ShoppingCart size={18} className="text-slate-400 group-hover:text-primary transition-colors" />
          </Link>
          
          {user ? (
            <div className="flex items-center gap-2 sm:gap-4 ml-2">
              <Link 
                to="/profile" 
                className="w-11 h-11 rounded-full border-2 border-primary/40 shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)] p-0.5 overflow-hidden group cursor-pointer relative transition-transform hover:scale-110 active:scale-95"
                onClick={() => playSound('click')}
              >
                <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/60">
                  <Scan size={16} className="text-primary animate-pulse" />
                </div>
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=0D0D0D&color=fff` || null} 
                  className="rounded-full w-full h-full object-cover transition-all" 
                  alt="User avatar" 
                />
              </Link>
              <button 
                onClick={() => {
                  logout();
                  playSound('alert');
                }}
                className="p-2 text-slate-500 hover:text-accent transition-colors hidden lg:block"
                title={t('nav.logout')}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              onClick={() => playSound('click')}
              className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all font-display"
            >
              {t('nav.sync')}
            </Link>
          )}
          
          <button 
            className="md:hidden p-2 text-slate-400" 
            onClick={() => {
              setIsOpen(!isOpen);
              playSound('click');
            }}
          >
            {isOpen ? <Terminal size={24} /> : <Server size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 glass rounded-2xl overflow-hidden p-6 flex flex-col gap-6 border border-white/10 shadow-2xl relative z-40"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "p-4 rounded-xl transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-4",
                    location.pathname.startsWith(link.path) && link.path !== '/' ? "bg-primary/10 text-primary border border-primary/20" : 
                    location.pathname === link.path ? "bg-primary/10 text-primary border border-primary/20" : "text-slate-400 hover:bg-white/5"
                  )}
                  onClick={() => {
                    setIsOpen(false);
                    playSound('click');
                  }}
                >
                  <div className={cn(
                    "p-2 rounded-lg",
                    location.pathname === link.path ? "bg-primary text-black" : "bg-white/5 text-slate-400"
                  )}>
                    {link.icon}
                  </div>
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Language Selection */}
            <div className="pt-4 border-t border-white/5">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 block px-2">Neural Linguistics</span>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as any);
                      playSound('success');
                    }}
                    className={cn(
                      "p-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                      language === lang.code 
                        ? "bg-secondary/10 border-secondary text-secondary" 
                        : "bg-white/5 border-transparent text-slate-400"
                    )}
                  >
                    {lang.native}
                  </button>
                ))}
              </div>
            </div>

            {user ? (
              <button 
                onClick={() => {
                  logout();
                  setIsOpen(false);
                  playSound('alert');
                }}
                className="w-full p-4 rounded-xl text-accent border border-accent/20 bg-accent/5 text-[10px] font-bold uppercase tracking-widest text-center mt-2 group"
              >
                {t('nav.logout')}
              </button>
            ) : (
              <Link 
                to="/login"
                onClick={() => {
                  setIsOpen(false);
                  playSound('click');
                }}
                className="w-full p-4 rounded-xl text-primary border border-primary/20 bg-primary/5 text-[10px] font-bold uppercase tracking-widest text-center mt-2"
              >
                {t('nav.sync')}
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const Footer = () => (
  <footer className="fixed bottom-0 left-0 right-0 h-12 bg-black/40 backdrop-blur-xl border-t border-white/5 px-10 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500 z-40 print:hidden">
    <div className="flex items-center gap-8">
      <Logo size="sm" hideText className="opacity-50" />
      <span>System: <span className="text-green-400 font-bold">Optimal</span></span>
      <span className="hidden sm:inline">Active Nodes: <span className="text-slate-900 dark:text-white font-bold tracking-tighter">42 Synchronized</span></span>
    </div>
    <div className="flex gap-8">
      <span className="hidden md:inline">Neural Gateway: <span className="text-primary font-bold">ENCRYPTED</span></span>
      <span>GMT: <span className="text-slate-900 dark:text-white font-bold">22:45</span></span>
    </div>
  </footer>
);
