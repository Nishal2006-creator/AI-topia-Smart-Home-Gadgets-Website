import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Hexagon, Cpu } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  hideText?: boolean;
}

export const Logo = ({ size = 'md', className, hideText = false }: LogoProps) => {
  const sizes = {
    sm: { icon: 20, text: 'text-lg', subtext: 'text-[6px]' },
    md: { icon: 32, text: 'text-2xl', subtext: 'text-[8px]' },
    lg: { icon: 48, text: 'text-4xl', subtext: 'text-[10px]' },
  };

  return (
    <div className={cn("flex items-center gap-3 group cursor-pointer", className)}>
      {/* Animated Icon Core */}
      <div className="relative flex items-center justify-center">
        {/* Orbital Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-4px] border border-primary/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-8px] border border-primary/5 border-dashed rounded-full"
        />

        {/* Hexagon Base */}
        <div className="bg-black/80 border border-primary/30 p-1.5 rounded-xl shadow-[0_0_20px_rgba(0,255,195,0.2)] relative overflow-hidden">
          <Hexagon 
            size={sizes[size].icon} 
            className="text-primary fill-primary/10 transition-all group-hover:scale-110" 
          />
          
          {/* Pulse Effect */}
          <motion.div
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary blur-md"
          />
          
          {/* Center Chip */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu size={sizes[size].icon / 2} className="text-white/80" />
          </div>
        </div>
      </div>

      {!hideText && (
        <div className="flex flex-col">
          <div className={cn(
            "font-display italic font-bold text-white tracking-tighter leading-none flex items-baseline gap-0.5",
            sizes[size].text
          )}>
            AI<span className="text-primary">TOPIA</span>
          </div>
          <div className={cn(
            "font-mono font-bold text-slate-500 uppercase tracking-[0.3em] leading-none mt-1",
            sizes[size].subtext
          )}>
            Ectomeric <span className="text-primary/40">Systems</span>
          </div>
        </div>
      )}
    </div>
  );
};
