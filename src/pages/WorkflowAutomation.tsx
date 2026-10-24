import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Plus, 
  Workflow, 
  Trash2, 
  Power, 
  Clock, 
  Mic, 
  Smartphone, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Monitor,
  Mail,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { 
  subscribeToAutomations, 
  createAutomation, 
  updateAutomation, 
  deleteAutomation, 
  Automation 
} from '@/src/services/db';
import { cn, playSound } from '@/src/lib/utils';
import { Link } from 'react-router-dom';
import { WorkflowBuilder } from '@/src/components/WorkflowBuilder';

const TRIGGER_ICONS = {
  time: Clock,
  device: Smartphone,
  voice: Mic,
  email: Mail
};

export const WorkflowAutomation = () => {
  const { user } = useAuth();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToAutomations(user.uid, (fetched) => {
        setAutomations(fetched);
        setLoading(false);
      });
      return unsubscribe;
    }
  }, [user]);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    await updateAutomation(id, { enabled: !currentStatus });
    playSound('click');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this neural sequence?')) {
      await deleteAutomation(id);
      playSound('alert');
    }
  };

  const handleCreate = async (workflow: Omit<Automation, 'id' | 'userId' | 'createdAt'>) => {
    if (user) {
      await createAutomation({
        ...workflow,
        userId: user.uid
      });
      setIsBuilderOpen(false);
    }
  };

  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}/api/signals/external`);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
    playSound('success');
  };

  const copyJson = () => {
    const json = JSON.stringify({
      signalType: "email",
      value: "Subject contains Order",
      secret: "Aumina-Node-84X"
    }, null, 2);
    navigator.clipboard.writeText(json);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
    playSound('success');
  };

  if (loading) {
    return (
      <div className="pt-32 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em]">Mapping Neural Nodes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4 border border-primary/20">
            <Cpu size={12} /> Sync Node 44-X Active
          </div>
          <h1 className="text-5xl font-display font-bold text-white italic tracking-tight flex items-center gap-6">
            Neural <span className="text-primary">Automation</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-4 max-w-md leading-relaxed">
            Construct complex sequences across your smart hardware infrastructure via AI-assisted links.
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            to="/ai-consultant"
            className="px-6 py-4 glass border-white/5 text-primary text-[10px] font-bold uppercase tracking-widest rounded-2xl flex items-center gap-2 hover:bg-primary/5 transition-all group"
            onClick={() => playSound('success')}
          >
            <Sparkles size={16} className="group-hover:scale-110 transition-transform" /> AI Architect
          </Link>
          <button
            onClick={() => { setIsBuilderOpen(true); playSound('click'); }}
            className="px-8 py-4 bg-primary text-black text-[10px] font-bold uppercase tracking-widest rounded-2xl glow-primary hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> New Sequence
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {automations.map((automation, index) => {
            const TriggerIcon = TRIGGER_ICONS[automation.trigger.type];
            return (
              <motion.div
                key={automation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "glass p-8 rounded-[3rem] border-white/5 group hover:border-primary/20 transition-all relative overflow-hidden",
                  !automation.enabled && "opacity-60"
                )}
              >
                {/* Background Glow */}
                <div className={cn(
                  "absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] transition-colors duration-1000",
                  automation.enabled ? "bg-primary/20" : "bg-white/5"
                )} />

                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                    automation.enabled ? "bg-primary text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]" : "glass text-slate-500"
                  )}>
                    <TriggerIcon size={24} />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDelete(automation.id)}
                      className="p-3 glass rounded-xl text-slate-500 hover:text-accent transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => handleToggle(automation.id, automation.enabled)}
                      className={cn(
                        "p-3 rounded-xl flex items-center justify-center transition-all",
                        automation.enabled ? "bg-primary/10 text-primary border border-primary/30" : "glass text-slate-600"
                      )}
                    >
                      <Power size={18} className={automation.enabled ? "animate-pulse" : ""} />
                    </button>
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-display font-bold text-white italic mb-2 tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                    {automation.name}
                  </h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest line-clamp-2 min-h-[3em] leading-relaxed">
                    {automation.description || 'System generated neural sequence...'}
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                      {automation.actions.length} Action{automation.actions.length !== 1 ? 's' : ''}
                    </div>
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                    <div className="text-[10px] text-primary uppercase font-bold tracking-widest">
                      {automation.trigger.value}
                    </div>
                  </div>
                  <div className="text-[8px] font-mono text-slate-600 group-hover:text-primary transition-colors uppercase">
                    ID: {automation.id.slice(-8).toUpperCase()}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {automations.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3 py-20 glass rounded-[4rem] border-dashed border-2 border-white/10 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-slate-600 mb-6">
              <Workflow size={40} />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">No active neural links found.</p>
            <button 
              onClick={() => setIsBuilderOpen(true)}
              className="mt-6 text-primary text-[10px] font-bold uppercase tracking-widest hover:underline"
            >
              Initialize first sequence link &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Feature Grid / Real-time Data visualization */}
      <div className="mt-32 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 glass p-8 rounded-[3rem] border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <Monitor size={18} className="text-primary" />
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Node Metrics</h4>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                <span className="text-slate-500">Signal Integrity</span>
                <span className="text-primary">99.4%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '99.4%' }}
                  className="h-full bg-primary shadow-[0_0_10px_#22d3ee]"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                <span className="text-slate-500">Latency Link</span>
                <span className="text-primary">4 ms</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '12%' }}
                  className="h-full bg-primary shadow-[0_0_10px_#22d3ee]"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 pt-10 border-t border-white/5">
            <div className="flex items-center gap-3 mb-4 text-orange-400">
               <Zap size={14} />
               <h4 className="text-[10px] font-bold uppercase tracking-widest">Make.com Sync</h4>
            </div>
            <p className="text-[9px] text-slate-500 leading-relaxed mb-4">
              Trigger automations from external signals. Set this as your HTTP request destination in Make.com:
            </p>
            <div className="relative group mb-4">
               <div className="p-3 pr-10 bg-black/40 rounded-xl border border-white/5 group-hover:border-primary/30 transition-colors overflow-hidden">
                  <code className="text-[8px] text-primary break-all font-mono">
                    {window.location.origin}/api/signals/external
                  </code>
               </div>
               <button 
                 onClick={copyUrl}
                 className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-primary transition-colors"
               >
                 {copiedUrl ? <Check size={14} /> : <Copy size={14} />}
               </button>
            </div>
            
            <p className="text-[9px] text-slate-500 mb-2 font-bold uppercase flex justify-between items-center">
              JSON Payload:
              <button 
                onClick={copyJson}
                className="text-primary hover:underline lowercase tracking-normal flex items-center gap-1"
              >
                {copiedJson ? <Check size={10} /> : <Copy size={10} />}
                {copiedJson ? 'copied' : 'copy'}
              </button>
            </p>
            <div className="p-3 bg-black/40 rounded-xl border border-white/5">
               <pre className="text-[8px] text-slate-400 font-mono">
{`{
  "signalType": "email",
  "value": "Subject contains Order",
  "secret": "Aumina-Node-84X"
}`}
               </pre>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 glass p-10 rounded-[4rem] border-white/5 flex flex-col md:flex-row items-center gap-10">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border border-primary/20 shrink-0">
            <Sparkles size={36} className="animate-pulse" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-display font-bold text-white italic mb-2 tracking-tight">AI Assisted <span className="text-primary">Architecting</span></h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Our neural core can automatically generate optimal sequences based on your voice prompts. Talk to Aumina to establish high-efficiency workflows in seconds.
            </p>
          </div>
          <Link 
            to="/ai-consultant"
            className="px-8 py-5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-primary transition-all shrink-0"
          >
            Launch Neural Link
          </Link>
        </div>
      </div>

      {/* Builder Modal */}
      <AnimatePresence>
        {isBuilderOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBuilderOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl h-[90vh] glass-none bg-[#0D0D10] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-[0_0_80px_rgba(34,211,238,0.15)]"
            >
              <WorkflowBuilder 
                onSave={handleCreate}
                onCancel={() => setIsBuilderOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
