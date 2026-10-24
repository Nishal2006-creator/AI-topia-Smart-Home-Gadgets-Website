import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { LogIn, Mail, Lock, ArrowRight, Github, Chrome, AlertCircle } from 'lucide-react';
import { cn, playSound } from '@/src/lib/utils';

export const Login = () => {
  const [email, setEmail] = useState('aitopia26@gmail.com');
  const [password, setPassword] = useState('aitopia2026');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithEmail, login } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    playSound('click');

    try {
      await loginWithEmail(email, password);
      navigate('/profile');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid credentials. If you haven\'t registered this identity yet, please use the "Create Neural Identity" link below.');
      } else if (err.code === 'auth/user-not-found') {
        setError('Neural identity not found. Please register first.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect encryption key (password).');
      } else {
        setError(err.message || 'Failed to sign in. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    playSound('click');
    try {
      await login();
      navigate('/profile');
    } catch (err: any) {
      console.error(err);
      setError('Google sign-in failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.05),transparent_50%)] pointer-events-none" />
      
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
              <LogIn className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 text-sm mt-2 font-mono uppercase tracking-[0.2em]">Neural Access Required</p>
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

          <form onSubmit={handleEmailLogin} className="space-y-4">
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
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Password</label>
              <Link to="/forgot-password" className="text-[10px] text-primary hover:text-primary/80 uppercase font-bold tracking-widest transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full bg-primary text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 mt-6",
                isLoading && "animate-pulse"
              )}
            >
              {isLoading ? "Authenticating..." : "Connect to Core"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <span className="relative px-3 bg-slate-900 text-[10px] text-slate-500 uppercase font-bold tracking-widest">Other Protocols</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-2.5 hover:bg-white/10 transition-all text-sm font-medium"
              >
                <Chrome className="w-4 h-4" />
                Google
              </button>
              <button
                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-2.5 hover:bg-white/10 transition-all text-sm font-medium opacity-50 cursor-not-allowed"
              >
                <Github className="w-4 h-4" />
                GitHub
              </button>
            </div>
          </div>

          <p className="text-center mt-8 text-slate-400 text-sm">
            New user?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Create Neural Identity
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
