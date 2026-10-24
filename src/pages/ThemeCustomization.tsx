import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, SunMoon, Type, LayoutGrid, Sparkles, RefreshCw, Save, Check, Layers, Maximize, Copy, Share2, Eye, Zap } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/src/context/ThemeContext';
import { cn, playSound } from '@/src/lib/utils';
import { useAuth } from '@/src/context/AuthContext';
import { useLanguage } from '@/src/context/LanguageContext';

import { AuminaBot } from '@/src/components/AuminaBot';

const PRESETS = [
  { name: 'Aumina Default', primary: '#00f2ff', secondary: '#7000ff', accent: '#ff00d4', uiStyle: 'glassmorphism' as const },
  { name: 'Cyberpunk 2077', primary: '#fdf500', secondary: '#ff003c', accent: '#05d9e8', uiStyle: 'neon' as const },
  { name: 'Minimal Mono', primary: '#ffffff', secondary: '#333333', accent: '#666666', uiStyle: 'minimal' as const },
  { name: 'Deep Space', primary: '#3b82f6', secondary: '#1e3a8a', accent: '#1d4ed8', uiStyle: '3d' as const },
  { name: 'Royal Crimson', primary: '#ef4444', secondary: '#7f1d1d', accent: '#dc2626', uiStyle: 'glassmorphism' as const },
  { name: 'Forest Node', primary: '#10b981', secondary: '#064e3b', accent: '#34d399', uiStyle: 'minimal' as const },
];

export const ThemeCustomization = () => {
  const { theme, updateTheme, resetTheme, saveGlobalTheme } = useTheme();
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = React.useState<'colors' | 'layout' | 'effects' | 'bot'>('colors');
  const [saving, setSaving] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handlePublish = async () => {
    setSaving(true);
    try {
      await saveGlobalTheme();
      playSound('success');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
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

  const copyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(theme, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    playSound('success');
  };

  const { pathname } = useLocation();
  const isAdminView = pathname.includes('/admin');

  return (
    <div className={cn(
      "pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center",
      isAdminView ? "pt-6" : "pt-24"
    )}>
      <div className="text-center mb-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-6 border-accent/20"
        >
          <Palette size={14} className="text-accent" />
          <span className="text-[10px] font-bold text-accent tracking-widest uppercase">Visual Engine</span>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white mb-4 italic leading-tight">
          {t('theme.title').split(' ')[0]} <span className="text-primary">{t('theme.title').split(' ')[1]}</span>
        </h1>
        <p className="text-slate-500 dark:text-gray-400 max-w-2xl text-sm lg:text-base">{t('theme.subtitle')}</p>
      </div>

      {/* Preset Launcher */}
      <div className="w-full mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-slate-900 dark:text-white font-display font-bold text-sm uppercase tracking-[0.3em] flex items-center gap-2">
            <Layers size={16} className="text-primary" />
            {t('theme.presets')}
          </h3>
          <button 
            onClick={copyConfig}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {copied ? <Check size={12} className="text-primary" /> : <Copy size={12} />}
            {copied ? 'Copied Sig' : 'Export JSON'}
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {PRESETS.map((preset) => (
            <motion.button
              key={preset.name}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePresetSelect(preset)}
              className="glass p-4 rounded-2xl border-white/5 group relative overflow-hidden text-left"
            >
              <div className="flex gap-1 mb-3">
                <div className="w-4 h-4 rounded-full" style={{ background: preset.primary }} />
                <div className="w-4 h-4 rounded-full shadow-inner" style={{ background: preset.secondary }} />
                <div className="w-4 h-4 rounded-full" style={{ background: preset.accent }} />
              </div>
              <div className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors line-clamp-1">{preset.name}</div>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full items-start">
        {/* Controls Panel */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-[3rem] border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
            
            {/* Tabs */}
            <div className="flex gap-1 bg-white/5 p-1 rounded-2xl mb-8">
              {[
                { id: 'colors', label: t('theme.identity'), icon: <Palette size={14} /> },
                { id: 'layout', label: t('theme.architecture'), icon: <LayoutGrid size={14} /> },
                { id: 'effects', label: t('theme.neural_flow'), icon: <Sparkles size={14} /> },
                { id: 'bot', label: 'Robot Core', icon: <Zap size={14} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    playSound('click');
                  }}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                    activeTab === tab.id ? "bg-primary text-black shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]" : "text-gray-500 hover:text-white"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
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
                  {/* Color Pickers */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: 'Primary', key: 'primaryColor' as const, val: theme.primaryColor },
                      { label: 'Secondary', key: 'secondaryColor' as const, val: theme.secondaryColor },
                      { label: 'Accent', key: 'accentColor' as const, val: theme.accentColor },
                    ].map((color) => (
                      <div key={color.key} className="space-y-3">
                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest px-1">{color.label}</label>
                        <div className="relative group">
                          <input 
                            type="color" 
                            value={color.val} 
                            onChange={(e) => {
                              updateTheme({ [color.key]: e.target.value });
                              playSound('pop');
                            }}
                            className="w-full h-16 rounded-2xl bg-black/40 border border-white/10 p-1.5 cursor-pointer transition-all hover:border-primary/50 overflow-hidden"
                          />
                        </div>
                        <div className="text-[9px] font-mono text-gray-600 text-center uppercase tracking-widest">{color.val}</div>
                      </div>
                    ))}
                  </div>

                    <div className="space-y-6">
                      <h3 className="text-slate-900 dark:text-white font-display font-bold text-sm uppercase tracking-widest flex items-center gap-2 pt-4">
                         <Layers size={16} className="text-primary" />
                         Atmosphere Node
                      </h3>
                      <div className="grid grid-cols-5 gap-2 glass p-1.5 rounded-2xl">
                        {['stars', 'neural', 'dust', 'void', 'nebula'].map((bg) => (
                          <button
                            key={bg}
                            onClick={() => {
                              updateTheme({ backgroundStyle: bg as any });
                              playSound('click');
                            }}
                            className={cn(
                              "py-2 text-[9px] font-bold uppercase tracking-widest rounded-xl transition-all",
                              theme.backgroundStyle === bg ? "bg-white/10 text-primary border border-primary/20 shadow-inner" : "text-gray-500 hover:text-white"
                            )}
                          >
                            {bg}
                          </button>
                        ))}
                      </div>

                      {/* Motion Controls */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-3">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <span>Motion Flux (Speed)</span>
                            <span className="text-primary font-mono">{theme.backgroundSpeed}x</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="5" 
                            step="0.1"
                            value={theme.backgroundSpeed}
                            onChange={(e) => updateTheme({ backgroundSpeed: parseFloat(e.target.value) })}
                            className="w-full h-1 bg-white/5 rounded-full appearance-none accent-primary cursor-pointer hover:bg-white/10 transition-colors"
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <span>Particle Density</span>
                            <span className="text-primary font-mono">{theme.backgroundIntensity}x</span>
                          </div>
                          <input 
                            type="range" 
                            min="0.1" 
                            max="3" 
                            step="0.1"
                            value={theme.backgroundIntensity}
                            onChange={(e) => updateTheme({ backgroundIntensity: parseFloat(e.target.value) })}
                            className="w-full h-1 bg-white/5 rounded-full appearance-none accent-primary cursor-pointer hover:bg-white/10 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                  <div className="space-y-6">
                    <h3 className="text-slate-900 dark:text-white font-display font-bold text-sm uppercase tracking-widest flex items-center gap-2 pt-4">
                       <SunMoon size={16} className="text-primary" />
                       Chronos Mode
                    </h3>
                    <div className="grid grid-cols-3 gap-2 glass p-1.5 rounded-2xl">
                      {['dark', 'light', 'auto'].map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            updateTheme({ mode: m as any });
                            playSound('click');
                          }}
                          className={cn(
                            "py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all",
                            theme.mode === m ? "bg-white/10 text-primary shadow-inner" : "text-gray-500 hover:text-white"
                          )}
                        >
                          {m}
                        </button>
                      ))}
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
                  className="space-y-10"
                >
                  <div className="space-y-6">
                    <h3 className="text-slate-900 dark:text-white font-display font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                       <LayoutGrid size={16} className="text-primary" />
                       UI Framework
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['glassmorphism', 'minimal', 'neon', '3d'].map((style) => (
                        <button
                          key={style}
                          onClick={() => {
                            updateTheme({ uiStyle: style as any });
                            playSound('click');
                          }}
                          className={cn(
                            "py-4 px-6 text-left relative overflow-hidden text-[10px] font-bold uppercase tracking-widest rounded-2xl border transition-all flex items-center justify-between",
                            theme.uiStyle === style ? "border-primary text-primary bg-primary/5" : "border-white/5 text-gray-500 hover:text-white hover:bg-white/5"
                          )}
                        >
                          {style}
                          {theme.uiStyle === style && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                     <h3 className="text-slate-900 dark:text-white font-display font-bold text-sm uppercase tracking-widest flex items-center gap-2 pt-4">
                       <Maximize size={16} className="text-primary" />
                       Spatial Parameters
                    </h3>
                    <div className="space-y-8">
                      {[
                        { label: 'Neural Radius', key: 'borderRadius' as const, val: theme.borderRadius, min: 0, max: 64, unit: 'px' },
                        { label: 'Dock Padding', key: 'containerPadding' as const, val: theme.containerPadding, min: 0, max: 80, unit: 'px' },
                        { label: 'Glass Opacity', key: 'glassIntensity' as const, val: theme.glassIntensity, min: 0, max: 50, unit: '%' },
                        { label: 'Data Density', key: 'fontSize' as const, val: theme.fontSize, min: 12, max: 24, unit: 'px' },
                        { label: 'Neural Height', key: 'lineHeight' as const, val: theme.lineHeight, min: 1, max: 2, step: 0.1, unit: 'x' },
                      ].map((ctrl) => (
                        <div key={ctrl.key} className="space-y-4 px-1">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <span>{ctrl.label}</span>
                            <span className="text-primary font-mono">{ctrl.val}{ctrl.unit}</span>
                          </div>
                          <input 
                            type="range" 
                            min={ctrl.min} 
                            max={ctrl.max} 
                            step={ctrl.step || 1}
                            value={ctrl.val}
                            onChange={(e) => updateTheme({ [ctrl.key]: ctrl.step ? parseFloat(e.target.value) : parseInt(e.target.value) })}
                            className="w-full h-1 bg-white/5 rounded-full appearance-none accent-primary cursor-pointer hover:bg-white/10 transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'effects' && (
                <motion.div 
                  key="effects"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-10"
                >
                  <div className="space-y-6">
                    <h3 className="text-slate-900 dark:text-white font-display font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                       <Type size={16} className="text-primary" />
                       Typography Node
                    </h3>
                    <div className="space-y-6">
                      <div className="glass p-1.5 rounded-2xl overflow-hidden grid grid-cols-1 gap-1">
                        {['Inter', 'Space Grotesk', 'JetBrains Mono', 'Outfit', 'Plus Jakarta Sans'].map((font) => (
                          <button
                            key={font}
                            onClick={() => {
                              updateTheme({ fontFamily: font });
                              playSound('click');
                            }}
                            className={cn(
                              "w-full px-4 py-3 text-left text-xs transition-all flex items-center justify-between rounded-xl",
                              theme.fontFamily === font ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"
                            )}
                            style={{ fontFamily: font }}
                          >
                            {font} Identity
                            {theme.fontFamily === font && <Check size={14} className="text-primary" />}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest px-1">Weight Profiling</label>
                        <div className="grid grid-cols-4 gap-2">
                          {['300', '400', '600', '800'].map((w) => (
                            <button
                              key={w}
                              onClick={() => {
                                updateTheme({ fontWeight: w });
                                playSound('click');
                              }}
                              className={cn(
                                "py-2 text-[10px] font-bold rounded-xl transition-all border",
                                theme.fontWeight === w ? "border-primary text-primary bg-primary/5" : "border-white/5 text-slate-500"
                              )}
                              style={{ fontWeight: w }}
                            >
                              {w}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-slate-900 dark:text-white font-display font-bold text-sm uppercase tracking-widest flex items-center gap-2 pt-4">
                       <Sparkles size={16} className="text-primary" />
                       Neural Dynamics
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Kinetic Motion', key: 'animationsEnabled' as const, val: theme.animationsEnabled },
                        { label: 'Radiance Overlay', key: 'glowEnabled' as const, val: theme.glowEnabled },
                        { label: 'Haptic Audio', key: 'soundEnabled' as const, val: theme.soundEnabled },
                      ].map((eff) => (
                        <div key={eff.key} className="flex justify-between items-center p-5 glass rounded-2xl border-white/5 hover:border-white/10 transition-colors">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{eff.label}</span>
                          <button 
                            onClick={() => {
                              updateTheme({ [eff.key]: !eff.val });
                              playSound('toggle');
                            }}
                            className={cn(
                              "w-14 h-7 rounded-full p-1.5 transition-all flex items-center",
                              eff.val ? "bg-primary" : "bg-white/10"
                            )}
                          >
                            <motion.div 
                              layout
                              animate={{ x: eff.val ? 24 : 0 }}
                              className="w-4 h-4 bg-white rounded-full shadow-lg"
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'bot' && (
                <motion.div 
                  key="bot"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-8"
                >
                  <div className="flex justify-center py-6 bg-white/5 rounded-[2rem] border border-white/5 mb-8">
                     <AuminaBot size="lg" isThinking />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Chassis Primary', key: 'primaryColor' as const, val: theme.bot.primaryColor },
                      { label: 'Chassis Secondary', key: 'secondaryColor' as const, val: theme.bot.secondaryColor },
                      { label: 'Ocular Glow', key: 'eyeColor' as const, val: theme.bot.eyeColor },
                    ].map((color) => (
                      <div key={color.key} className="space-y-3">
                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest px-1">{color.label}</label>
                        <input 
                          type="color" 
                          value={color.val} 
                          onChange={(e) => {
                            updateTheme({ bot: { ...theme.bot, [color.key]: e.target.value } });
                            playSound('pop');
                          }}
                          className="w-full h-14 rounded-2xl bg-black/40 border border-white/10 p-1.5 cursor-pointer transition-all hover:border-primary/50"
                        />
                        <div className="text-[9px] font-mono text-gray-600 text-center uppercase tracking-widest">{color.val}</div>
                      </div>
                    ))}
                    
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest px-1">Tactile Pattern</label>
                      <div className="grid grid-cols-2 gap-2 h-14">
                        {['none', 'dots', 'grid', 'hex'].map((p) => (
                          <button
                            key={p}
                            onClick={() => {
                              updateTheme({ bot: { ...theme.bot, pattern: p as any } });
                              playSound('click');
                            }}
                            className={cn(
                              "text-[9px] font-bold uppercase tracking-widest rounded-xl transition-all border",
                              theme.bot.pattern === p ? "bg-primary text-black border-primary" : "text-gray-500 border-white/10 hover:text-white"
                            )}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-white/5">
              <button 
                onClick={() => {
                  resetTheme();
                  playSound('alert');
                }}
                className="flex-1 py-5 glass text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2 order-2 sm:order-1"
              >
                <RefreshCw size={14} />
                {t('theme.reset')}
              </button>
              <button 
                onClick={handlePublish}
                disabled={saving}
                className="flex-1 py-5 bg-primary text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 order-1 sm:order-2 disabled:opacity-50 shadow-[0_10px_20px_-5px_rgba(var(--primary-rgb),0.3)]"
              >
                <Save size={14} />
                {saving ? 'Publishing...' : t('theme.publish')}
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="sticky top-24 space-y-6">
          <div className="flex items-center justify-between px-6">
             <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 flex items-center gap-2">
                <Eye size={12} /> Neural Preview
             </h4>
             <div className="flex gap-1">
                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/20" />)}
             </div>
          </div>

          <div 
            className="glass p-10 lg:p-14 rounded-[3.5rem] border-primary/20 relative overflow-hidden transition-all duration-700 shadow-2xl"
            style={{ 
              borderRadius: `${theme.borderRadius}px`,
              fontFamily: theme.fontFamily 
            }}
          >
            <div className="absolute top-0 right-0 w-80 h-80 opacity-20 -z-10 blur-[120px] transition-all duration-1000" style={{ background: theme.primaryColor }} />
            <div className="absolute bottom-0 left-0 w-80 h-80 opacity-10 -z-10 blur-[120px] transition-all duration-1000" style={{ background: theme.secondaryColor }} />
            
            <div className="space-y-12">
              <div className="space-y-6">
                <motion.h2 
                  layout
                  className="text-4xl lg:text-6xl font-display font-bold text-white leading-[1.1] tracking-tight"
                  style={{ 
                    fontSize: `${theme.fontSize * 2.8}px`,
                    fontWeight: theme.fontWeight,
                    lineHeight: theme.lineHeight
                  }}
                >
                  Configure Your <span className="italic" style={{ color: theme.primaryColor }}>Neural</span> Experience.
                </motion.h2>
                <p className="text-gray-500 text-sm lg:text-base leading-relaxed max-w-sm">
                  The neural engine is hot-swapping parameters. Notice the kinetics and radiance adjustments in real-time.
                </p>
              </div>

              <div className="space-y-8">
                <div 
                  className="flex gap-6 p-6 glass rounded-3xl border-white/5 transition-all duration-500" 
                  style={{ 
                    borderRadius: `${theme.borderRadius * 0.8}px`,
                    backgroundColor: `rgba(255, 255, 255, ${theme.glassIntensity / 500})`
                  }}
                >
                  <div 
                    className="w-20 h-20 flex items-center justify-center rounded-2xl transition-all duration-500 shadow-xl" 
                    style={{ 
                      borderRadius: `${theme.borderRadius * 0.5}px` ,
                      background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                      boxShadow: theme.glowEnabled ? `0 10px 30px ${theme.primaryColor}66` : 'none',
                      color: '#fff'
                    }}
                  >
                    <Zap size={32} />
                  </div>
                  <div className="flex-1 space-y-3 py-3">
                    <div className="h-2 w-1/3 rounded-full" style={{ background: `${theme.primaryColor}44` }} />
                    <div className="h-2 w-full bg-white/5 rounded-full" />
                    <div className="h-5 w-1/2 bg-white/10 rounded-lg" style={{ borderRadius: `${theme.borderRadius * 0.3}px` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="glass p-8 rounded-3xl border-white/5" style={{ borderRadius: `${theme.borderRadius}px` }}>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">Sync Nodes</div>
                    <div className="text-3xl font-display font-bold text-white tracking-tighter italic">84X</div>
                  </div>
                  <div 
                    className="glass p-8 rounded-3xl border transition-all duration-500 shadow-lg" 
                    style={{ 
                      borderRadius: `${theme.borderRadius}px` ,
                      borderColor: `${theme.accentColor}44`,
                      background: `${theme.accentColor}05`
                    }}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: theme.accentColor }}>Stability</div>
                    <div 
                      className="text-3xl font-display font-bold italic tracking-tighter" 
                      style={{ color: theme.accentColor }}
                    >
                      99%
                    </div>
                  </div>
                </div>
              </div>

              <motion.button 
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-6 font-bold uppercase tracking-[0.4em] text-[10px] transition-all duration-500"
                style={{ 
                  borderRadius: `${theme.borderRadius}px`,
                  background: theme.primaryColor,
                  color: '#000',
                  boxShadow: theme.glowEnabled ? `0 15px 40px ${theme.primaryColor}55` : 'none'
                }}
              >
                Establish Neural Link
              </motion.button>
            </div>
          </div>
          
          <div className="glass p-6 px-8 rounded-[2.5rem] border-white/5 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-[pulse_2s_infinite]" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] italic">System Integrity: Nominal</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
               <Share2 size={12} />
               <div className="text-[9px] font-mono uppercase">AIT-THM-992</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

