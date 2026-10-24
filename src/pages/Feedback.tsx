import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Send, Star, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { cn, playSound } from '@/src/lib/utils';
import { createFeedback } from '@/src/services/db';

export const Feedback = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [type, setType] = useState('suggestion');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || rating === 0 || !message.trim()) return;

    setSubmitting(true);
    try {
      const feedbackData = {
        userId: user.uid,
        userName: user.displayName || 'Anonymous User',
        userEmail: user.email || 'no-email',
        type,
        rating,
        message,
      };

      // 1. Save to Database
      await createFeedback(feedbackData);

      // 2. Transmit to Make.com Automation via Backend
      await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'feedback_submission',
          ...feedbackData,
          source: 'Neural Rig Feedback Interface'
        })
      });

      setSubmitted(true);
      playSound('success');
    } catch (error) {
      console.error('Feedback error:', error);
      playSound('alert');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-40 pb-20 px-6 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass p-12 rounded-[3.5rem] border-primary/20"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="text-primary" size={40} />
          </div>
          <h2 className="text-4xl font-display font-bold text-white italic mb-4">Transmission Received</h2>
          <p className="text-slate-500 uppercase tracking-[0.2em] text-xs font-bold font-sans mb-10">
            Your neural input has been indexed in our development database.
          </p>
          <Link to="/">
            <button className="px-10 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-2xl glow-primary">
              Return to Grid
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <Link to="/" className="p-3 glass rounded-xl text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-5xl font-display font-bold text-white italic">Neural <span className="text-primary">Feedback</span></h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold mt-2 font-sans">Submit your system logs and suggestions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="glass p-10 rounded-[3rem] border-white/5 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              {['suggestion', 'bug', 'complaint', 'other'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setType(t); playSound('click'); }}
                  className={cn(
                    "py-4 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                    type === t ? "bg-primary/10 border-primary text-primary" : "glass border-white/5 text-slate-500 hover:text-white"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Interface Rating</label>
              <div className="flex gap-4 p-4 glass rounded-2xl border-white/5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => { setRating(star); playSound('pop'); }}
                    className="transition-transform active:scale-90"
                  >
                    <Star 
                      size={28} 
                      className={cn(
                        "transition-all",
                        (hoveredRating || rating) >= star ? "text-primary fill-primary glow-primary" : "text-slate-700"
                      )} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Log Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your experience or suggest hardware enhancements..."
                className="w-full h-48 bg-black/40 border border-white/10 rounded-[2rem] p-6 text-white text-sm focus:outline-none focus:border-primary/50 transition-all resize-none placeholder:text-slate-700"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting || rating === 0 || !message.trim()}
              className="w-full py-5 bg-primary text-black font-bold uppercase tracking-[0.3em] rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:grayscale glow-primary"
            >
              <Send size={18} />
              {submitting ? 'Transmitting...' : 'Send Transcript'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border-l-4 border-l-primary/30">
            <ShieldCheck size={32} className="text-primary mb-6" />
            <h3 className="text-xl font-display font-bold text-white italic mb-4">Encryption Ready</h3>
            <p className="text-slate-500 text-xs leading-relaxed italic font-sans uppercase tracking-widest">
              All feedback is direct-linked to our master kernel for immediate analysis.
            </p>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border-white/5">
            <MessageSquare size={32} className="text-secondary mb-6" />
            <h3 className="text-xl font-display font-bold text-white italic mb-4">Why Submit?</h3>
            <ul className="space-y-4">
              {[
                "Hardware optimizations",
                "UI path corrections",
                "Neural efficiency",
                "Feature requests"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
