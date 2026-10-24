import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { UserPlus, Mail, Lock, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { cn, playSound } from '@/src/lib/utils';

export const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    playSound('click');

    try {
      await register(email, password);
      navigate('/profile');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already linked to a neural identity. Try logging in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Encryption key (password) is too weak. Must be at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email transmission format.');
      } else {
        setError(err.message || 'Registration failed. Neural mismatch detected.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.05),transparent_50%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -ml-16 -mb-16" />

          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20"
            >
              <UserPlus className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white tracking-tight">New Identity</h1>
            <p className="text-slate-400 text-sm mt-2 font-mono uppercase tracking-[0.2em]">Initialize Neural Profile</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest px-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm"
                  placeholder="name@nexus.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest px-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm"
                  placeholder="Min 6 characters"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest px-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm"
                  placeholder="Repeat encryption key"
                />
              </div>
            </div>

            <div className="py-2 flex items-start gap-3">
               <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
               <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-wider font-medium">
                 Your neural data is end-to-end encrypted across the nexus grid.
               </p>
            </div>

            <button
              id="signup-submit"
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full bg-primary text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 mt-6",
                isLoading && "animate-pulse"
              )}
            >
              {isLoading ? "Synchronizing..." : "Create Identity"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-400 text-sm">
            Already registered?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Access Neural Core
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
