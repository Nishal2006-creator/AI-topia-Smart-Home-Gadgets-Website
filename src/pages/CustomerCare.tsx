import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, HelpCircle, ArrowLeft, MessageCircle, Shield, Globe, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { playSound } from '@/src/lib/utils';

export const CustomerCare = () => {
  const supportChannels = [
    {
      icon: <MessageCircle className="text-primary" />,
      title: "Neural Chat",
      desc: "Instant text link with local support nodes.",
      action: "Initialize Link",
      available: true
    },
    {
      icon: <Phone className="text-secondary" />,
      title: "Audio Link",
      desc: "Direct voice frequency transmission.",
      action: "+91 1800-NEURAL-01",
      available: true
    },
    {
      icon: <Mail className="text-accent" />,
      title: "Encrypted Mail",
      desc: "Send batch reports to our kernel.",
      action: "link@neuralrig.co",
      available: true
    }
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-16">
        <Link to="/" className="p-3 glass rounded-xl text-slate-400 hover:text-white transition-colors" onClick={() => playSound('click')}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-5xl font-display font-bold text-white italic">Support <span className="text-primary">Matrix</span></h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold mt-2 font-sans">Active nodes for system restoration and guidance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {supportChannels.map((channel, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-10 rounded-[3rem] border-white/5 hover:border-primary/20 transition-all group"
          >
            <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              {channel.icon}
            </div>
            <h3 className="text-2xl font-display font-bold text-white italic mb-4">{channel.title}</h3>
            <p className="text-slate-500 text-xs mb-10 leading-relaxed italic uppercase tracking-widest font-sans">{channel.desc}</p>
            <button 
              className="w-full py-4 glass border-white/10 hover:border-primary/50 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl transition-all"
              onClick={() => playSound('click')}
            >
              {channel.action}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-12 rounded-[3.5rem] border-l-4 border-l-primary/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
             <HelpCircle size={100} className="text-primary/5 -rotate-12" />
          </div>
          <h3 className="text-3xl font-display font-bold text-white italic mb-8">Base <span className="text-primary">Knowledge</span></h3>
          <div className="space-y-6">
            {[
              "Synchronizing hardware presets",
              "Payment gateway routing",
              "Neural rig assembly guide",
              "Return protocol v2.1"
            ].map((faq, i) => (
              <button 
                key={i} 
                className="w-full flex items-center justify-between p-5 glass border-white/5 rounded-2xl hover:bg-white/5 transition-all text-left group"
                onClick={() => playSound('pop')}
              >
                <span className="text-xs font-bold text-slate-400 group-hover:text-white uppercase tracking-widest">{faq}</span>
                <Zap size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
           <div className="glass p-10 rounded-[3rem] border-white/5 flex items-start gap-6">
              <div className="p-4 bg-secondary/10 rounded-2xl text-secondary">
                 <Globe size={24} />
              </div>
              <div>
                <h4 className="text-white font-display font-bold text-xl italic mb-2">Global Coverage</h4>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest font-sans">Network nodes available in 24 clusters worldwide.</p>
              </div>
           </div>

           <div className="glass p-10 rounded-[3rem] border-white/5 flex items-start gap-6">
              <div className="p-4 bg-accent/10 rounded-2xl text-accent">
                 <Clock size={24} />
              </div>
              <div>
                <h4 className="text-white font-display font-bold text-xl italic mb-2">Cycle Window</h4>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest font-sans">Active: 0600 - 2200 IST [Mon - Sat]</p>
              </div>
           </div>

           <div className="glass p-10 rounded-[3rem] bg-primary/5 border-primary/20 flex items-start gap-6">
              <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                 <Shield size={24} />
              </div>
              <div>
                <h4 className="text-white font-display font-bold text-xl italic mb-2">Safe Rig Seal</h4>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest font-sans">Encrypted support sessions active.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
