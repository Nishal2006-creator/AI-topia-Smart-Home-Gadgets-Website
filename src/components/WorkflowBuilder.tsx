import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Zap, Clock, Smartphone, Mic, Play, ChevronRight, Save, X, Sparkles, Wand2, Loader2, Mail } from 'lucide-react';
import { cn, playSound } from '@/src/lib/utils';
import { Automation } from '@/src/services/db';
import { generateAutomationFromPrompt } from '@/src/services/geminiService';

const TRIGGER_TYPES = [
  { id: 'time', icon: Clock, label: 'Time Based', description: 'Trigger at a specific node cycle' },
  { id: 'device', icon: Smartphone, label: 'Device State', description: 'Trigger when a sensor detects event' },
  { id: 'voice', icon: Mic, label: 'Voice Command', description: 'Trigger via neural vocal link' },
  { id: 'email', icon: Mail, label: 'Email Received', description: 'Trigger when a message is received' }
];

const DEVICE_OPTIONS = [
  'Aumina Hub', 'Neon Strips', 'Ghost Speaker', 'Iris Cam', 'Cyber Kettle', 'Aura Mask', 'Nexus Mirror', 'Zenith Sensor'
];

interface WorkflowBuilderProps {
  onSave: (workflow: Omit<Automation, 'id' | 'userId' | 'createdAt'>) => void;
  onCancel: () => void;
}

const QUICK_PROMPTS = [
  "When I get an email with 'Order', dim the Neon Strips.",
  "At 08:00, turn on Cyber Kettle.",
  "If motion detected on Iris Cam, alert via Ghost Speaker.",
  "When I say 'Stealth Mode', turn off all Aumina nodes."
];

export const WorkflowBuilder = ({ onSave, onCancel }: WorkflowBuilderProps) => {
  const [name, setName] = useState('New Neural Sequence');
  const [description, setDescription] = useState('');
  const [trigger, setTrigger] = useState<Automation['trigger']>({ type: 'time', value: '07:00' });
  const [actions, setActions] = useState<Automation['actions']>([
    { deviceName: 'Aumina Hub', command: 'Activate morning mode' }
  ]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiGenerate = async (forcedPrompt?: string) => {
    const promptToUse = forcedPrompt || aiPrompt;
    if (!promptToUse.trim() || isGenerating) return;
    
    setIsGenerating(true);
    playSound('click');
    
    try {
      const suggested = await generateAutomationFromPrompt(promptToUse);
      if (suggested) {
        setName(suggested.name);
        setDescription(suggested.description);
        setTrigger(suggested.trigger);
        setActions(suggested.actions);
        playSound('success');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
      setAiPrompt('');
    }
  };

  const addAction = () => {
    setActions([...actions, { deviceName: 'Aumina Hub', command: '' }]);
    playSound('pop');
  };

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
    playSound('click');
  };

  const updateAction = (index: number, updates: Partial<Automation['actions'][0]>) => {
    const newActions = [...actions];
    newActions[index] = { ...newActions[index], ...updates };
    setActions(newActions);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name,
      description,
      trigger,
      actions,
      enabled: true
    });
    playSound('success');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-8 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white italic tracking-tight">Sequence <span className="text-primary">Architect</span></h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Configuring Neural Automation Node</p>
        </div>
        <button 
          onClick={onCancel}
          className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
        {/* AI Generator Section */}
        <section className="glass p-8 rounded-[2.5rem] border-primary/20 bg-primary/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles size={100} className="text-primary" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                <Wand2 size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">AI Neural Architect</h3>
                <p className="text-[9px] text-primary font-bold uppercase tracking-widest">Auto-generate complex sequences</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <input 
                type="text" 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe your workflow..."
                className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
              />
              <button 
                onClick={() => handleAiGenerate()}
                disabled={!aiPrompt.trim() || isGenerating}
                className={cn(
                  "px-8 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2",
                  aiPrompt.trim() ? "bg-primary text-black hover:scale-105 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]" : "bg-white/5 text-slate-500 cursor-not-allowed"
                )}
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : "Synthesize"}
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2 py-1">Neural Inspiration:</span>
              {QUICK_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleAiGenerate(p)}
                  disabled={isGenerating}
                  className="text-[9px] font-bold text-primary/70 hover:text-primary bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-full px-4 py-1.5 transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Name & Description */}
        <section className="space-y-4">
          <div className="group">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block group-focus-within:text-primary transition-colors">Sequence Identification</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50 transition-all font-display text-lg"
              placeholder="Enter sequence name..."
            />
          </div>
          <input 
            type="text" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-transparent border-none text-slate-400 text-sm focus:outline-none px-4"
            placeholder="Add a brief summary of this workflow..."
          />
        </section>

        {/* Trigger Selection */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Zap size={16} />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Initialization Trigger</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TRIGGER_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setTrigger({ ...trigger, type: type.id as any })}
                className={cn(
                  "p-6 rounded-3xl border transition-all text-left group",
                  trigger.type === type.id 
                    ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(34,211,238,0.1)]" 
                    : "glass border-white/5 hover:border-white/20"
                )}
              >
                <type.icon size={24} className={cn("mb-4 transition-colors", trigger.type === type.id ? "text-primary" : "text-slate-500")} />
                <div className={cn("text-xs font-bold uppercase tracking-wider mb-1", trigger.type === type.id ? "text-white" : "text-slate-400")}>
                  {type.label}
                </div>
                <div className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-widest font-medium">
                  {type.description}
                </div>
              </button>
            ))}
          </div>

          <div className="glass p-6 rounded-[2rem] border-white/5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Trigger Parameter</label>
            {trigger.type === 'time' && (
              <input 
                type="time" 
                value={trigger.value}
                onChange={(e) => setTrigger({ ...trigger, value: e.target.value })}
                className="bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary/50 font-mono text-xl w-40"
              />
            )}
            {trigger.type === 'device' && (
              <select 
                value={trigger.value}
                onChange={(e) => setTrigger({ ...trigger, value: e.target.value })}
                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary/50"
              >
                <option value="">Select sensing node...</option>
                <option value="Iris Cam: Motion Detected">Iris Cam: Motion Detected</option>
                <option value="Zenith Sensor: Lux < 100">Zenith Sensor: Lux &lt; 100</option>
                <option value="Aumina Hub: Door Opened">Aumina Hub: Door Opened</option>
              </select>
            )}
            {trigger.type === 'voice' && (
              <input 
                type="text" 
                value={trigger.value}
                onChange={(e) => setTrigger({ ...trigger, value: e.target.value })}
                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary/50 italic"
                placeholder='e.g., "Engage Stealth Mode"'
              />
            )}
            {trigger.type === 'email' && (
              <input 
                type="text" 
                value={trigger.value}
                onChange={(e) => setTrigger({ ...trigger, value: e.target.value })}
                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary/50 italic"
                placeholder='e.g., "Subject contains Order"'
              />
            )}
          </div>
        </section>

        {/* Action Sequence */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                <Play size={16} />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Instruction Loop</h3>
            </div>
            <button 
              onClick={addAction}
              className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
            >
              <Plus size={14} /> Append Instruction
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {actions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass p-6 rounded-[2rem] border-white/5 flex flex-col md:flex-row gap-4 items-end"
                >
                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Action Node</label>
                        <select 
                          value={action.deviceName}
                          onChange={(e) => updateAction(index, { deviceName: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
                        >
                          {DEVICE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div className="flex-[2]">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Neural Instruction</label>
                        <input 
                          type="text" 
                          value={action.command}
                          onChange={(e) => updateAction(index, { command: e.target.value })}
                          placeholder="e.g., Dim to 20% over 5 cycles"
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-primary/50"
                        />
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeAction(index)}
                    className="p-3 glass-dark rounded-xl text-slate-500 hover:text-accent transition-colors mb-0.5"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>

      <div className="p-8 border-t border-white/5 bg-black/40 backdrop-blur-xl flex gap-4">
        <button 
          onClick={onCancel}
          className="flex-1 py-4 glass text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-white/5 transition-all"
        >
          Discard Signal
        </button>
        <button 
          onClick={handleSave}
          className="flex-[2] py-4 bg-primary text-black text-[10px] font-bold uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
        >
          Initialize Sync <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
