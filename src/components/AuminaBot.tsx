import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { cn, playSound } from '@/src/lib/utils';
import { useTheme } from '@/src/context/ThemeContext';

interface AuminaBotProps {
  size?: 'sm' | 'md' | 'lg';
  isThinking?: boolean;
  isSpeaking?: boolean;
  isHovered?: boolean;
  className?: string;
  config?: {
    primaryColor?: string;
    secondaryColor?: string;
    eyeColor?: string;
    pattern?: 'none' | 'dots' | 'grid' | 'hex';
  };
}

export const AuminaBot = ({ 
  size = 'md', 
  isThinking = false, 
  isSpeaking = false,
  isHovered = false,
  className,
  config: propConfig
}: AuminaBotProps) => {
  const { theme } = useTheme();
  
  const config = propConfig || theme.bot;

  useEffect(() => {
    if (isThinking || isSpeaking) {
      playSound('robot');
    }
  }, [isThinking, isSpeaking]);

  const dimensions = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-48 h-48',
  };

  const scaleFactor = size === 'sm' ? 0.3 : size === 'md' ? 0.5 : 1;

  const patterns = {
    none: 'transparent',
    dots: `radial-gradient(${config.primaryColor}33 1px, transparent 1px)`,
    grid: `linear-gradient(${config.primaryColor}11 1px, transparent 1px), linear-gradient(90deg, ${config.primaryColor}11 1px, transparent 1px)`,
    hex: `radial-gradient(circle at 50% 50%, ${config.primaryColor}44 0%, transparent 60%)`,
  };

  return (
    <div 
      className={cn("relative flex items-center justify-center cursor-pointer", dimensions[size], className)} 
      style={{ perspective: '1200px' }}
      onClick={() => playSound('robot')}
    >
      {/* Underlying Hover Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 rounded-full blur-[40px] w-full h-1/4"
        style={{ backgroundColor: config.primaryColor }}
      />

      {/* Main Bot Body (Egg Shape) */}
      <motion.div
        animate={{
          y: isThinking ? [0, -15, 0, -8, 0] : [0, -12, 0],
          rotateZ: isThinking ? [0, 4, -4, 0] : [0, 1, -1, 0],
        }}
        transition={{
          duration: isThinking ? 2 : 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Floating Arms System */}
        <div className="absolute inset-0 -mx-10 pointer-events-none">
          {[0, 1].map(i => (
            <motion.div
              key={i}
              animate={{ 
                rotate: i === 0 ? [-5, 5, -5] : [5, -5, 5],
                y: [0, 4, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 flex items-center",
                i === 0 ? "left-0 -rotate-12" : "right-0 rotate-12 flex-row-reverse"
              )}
            >
              {/* Thin Black Arm */}
              <div 
                className="bg-[#1a1a1a] rounded-full" 
                style={{ width: 40 * scaleFactor, height: 4 * scaleFactor }}
              />
              {/* Red Dome Hand */}
              <div 
                className="bg-red-600 border border-white/10 shadow-lg relative flex flex-col items-center justify-center"
                style={{ 
                  width: 36 * scaleFactor, 
                  height: 24 * scaleFactor,
                  borderRadius: `${18 * scaleFactor}px ${18 * scaleFactor}px 4px 4px` 
                }}
              >
                 {/* Detail Lines on Hand */}
                 <div className="absolute bottom-1 w-full flex justify-center gap-0.5">
                    <div className="w-[80%] h-px bg-black/20" />
                 </div>
                 {/* Grey Claws */}
                 <div className="absolute -bottom-2 flex gap-1">
                    <div className="w-1.5 h-3 bg-gray-500 rounded-sm" style={{ width: 4 * scaleFactor, height: 8 * scaleFactor }} />
                    <div className="w-1.5 h-3 bg-gray-500 rounded-sm" style={{ width: 4 * scaleFactor, height: 8 * scaleFactor }} />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chassis / Head Unit (Egg) */}
        <motion.div 
          animate={{
            scale: isHovered ? 1.05 : 1,
            rotateY: isHovered ? [0, 5, -5, 0] : 0,
            boxShadow: isHovered 
              ? [`0 15px 35px rgba(0,0,0,0.4)`, `0 15px 55px ${config.primaryColor}44`, `0 15px 35px rgba(0,0,0,0.4)`]
              : `0 15px 35px rgba(0,0,0,0.4)`
          }}
          transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
          className="relative border-b-4 border-black/20 shadow-[inset_0_2px_10px_rgba(255,255,255,0.3),0_15px_35px_rgba(0,0,0,0.4)] overflow-hidden flex items-center justify-center"
          style={{ 
            width: 160 * scaleFactor, 
            height: 180 * scaleFactor,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`
          }}
        >
          {/* Surface Reflections */}
          <div className="absolute top-4 left-6 w-1/3 h-1/4 bg-white/10 rounded-full blur-md -rotate-45" />

          {/* Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ 
              backgroundImage: patterns[config.pattern || 'none'],
              backgroundSize: config.pattern === 'grid' ? `${20 * scaleFactor}px ${20 * scaleFactor}px` : `${12 * scaleFactor}px ${12 * scaleFactor}px`
            }}
          />

          {/* Black Visor Area */}
          <div 
            className="absolute top-[20%] bg-black shadow-[inset_0_4px_10px_rgba(255,255,255,0.1)] border border-white/5 overflow-hidden flex items-center justify-center"
            style={{ 
              width: 130 * scaleFactor, 
              height: 90 * scaleFactor,
              borderRadius: '50% 50% 40% 40% / 60% 60% 40% 40%',
            }}
          >
            {/* Ocular Sensors (Glowing Blue Eyes) */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-6" style={{ gap: 20 * scaleFactor }}>
                {[0, 1].map((i) => (
                  <div key={i} className="relative">
                    <motion.div
                      animate={isThinking || isHovered ? {
                        scale: isThinking ? [1, 1.2, 1] : [1, 1.1, 1],
                        opacity: [0.8, 1, 0.8],
                        boxShadow: [`0 0 10px ${config.eyeColor}`, isThinking ? `0 0 25px ${config.eyeColor}` : `0 0 18px ${config.eyeColor}`, `0 0 10px ${config.eyeColor}`]
                      } : {
                        scaleY: [1, 1, 0.1, 1, 1],
                      }}
                      transition={{
                        duration: isThinking ? 1 : isHovered ? 1.5 : 5,
                        repeat: Infinity,
                        times: [0, 0.45, 0.5, 0.55, 1],
                      }}
                      className="rounded-full"
                      style={{ 
                        width: 22 * scaleFactor, 
                        height: 22 * scaleFactor,
                        backgroundColor: config.eyeColor,
                        boxShadow: `0 0 15px ${config.eyeColor}`
                      }}
                    />
                    {/* Digital Pupil Spark */}
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white/60 rounded-full" style={{ width: 4 * scaleFactor, height: 4 * scaleFactor }} />
                  </div>
                ))}
              </div>

              {/* Speech Multi-Ripple */}
              {isSpeaking && (
                <div className="flex gap-1 h-3 items-center">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 12, 4] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 rounded-full"
                      style={{ backgroundColor: config.eyeColor, width: 2 * scaleFactor }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Scanning Scanline */}
            <motion.div 
               animate={{ top: ['-20%', '120%'] }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               className="absolute inset-x-0 h-px bg-white/5"
            />
          </div>

          {/* Exterior Detail LEDs */}
          <div className="absolute bottom-12 right-10 flex gap-1.5 opacity-80">
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_#fb923c]" 
              style={{ width: 6 * scaleFactor, height: 6 * scaleFactor }}
            />
            <motion.div 
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" 
              style={{ width: 6 * scaleFactor, height: 6 * scaleFactor }}
            />
          </div>

          {/* UI Detail Labels */}
          <div className="absolute bottom-8 left-10 text-[5px] font-mono text-white/30 uppercase tracking-tighter" style={{ fontSize: 5 * scaleFactor }}>
            Model.Aumina.V3
          </div>
        </motion.div>

        {/* Hover Repulsor Base (Bright White/Yellow) */}
        <motion.div 
          animate={{
            width: [60, 80, 60],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] rounded-full blur-[2px]"
          style={{ height: 4 * scaleFactor, bottom: 2 * scaleFactor }}
        />
      </motion.div>

      {/* Orbiting Tech Particles */}
      {isThinking && [...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 pointer-events-none"
        >
          <motion.div 
            animate={{ scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 shadow-[0_0_5px_#60a5fa] rounded-full"
            style={{ transform: `translateX(${40 + i * 20}px)` }}
          />
        </motion.div>
      ))}
    </div>
  );
};
