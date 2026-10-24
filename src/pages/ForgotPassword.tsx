import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { Keyboard, Mail, ArrowRight, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import { cn, playSound } from '@/src/lib/utils';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);
    playSound('click');

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Quantum reset failed. Ensure email exists.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(56,189,248,0.05),transparent_50%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <Link 
            to="/login" 
            className="absolute top-6 left-6 text-slate-500 hover:text-white transition-colors flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest"
          >
            <ChevronLeft className="w-3 h-3" />
            Back
          </Link>

          <div className="text-center mb-8 mt-4">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20"
            >
              <Keyboard className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Recover Core</h1>
            <p className="text-slate-400 text-sm mt-2 font-mono uppercase tracking-[0.2em]">Reset Encrypted Keys</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Transmission Sent</h3>
              <p className="text-slate-400 text-sm mb-8">
                Neural reset link has been dispatched to <span className="text-primary font-mono">{email}</span>. Please check your inbox.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-primary hover:underline font-bold uppercase text-[10px] tracking-widest"
              >
                Return to Login Console
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleResetRequest} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest px-1">Verification Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm"
                    placeholder="authorized@nexus.com"
                  />
                </div>
              </div>

              <button
                id="reset-submit"
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full bg-primary text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100",
                  isLoading && "animate-pulse"
                )}
              >
                {isLoading ? "Broadcasting..." : "Initialize Reset"}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
              
              <p className="text-center text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                Protocol: NEXUS-AUTO-RECOVERY-V4
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
