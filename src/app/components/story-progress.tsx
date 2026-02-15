import React from 'react';
import { motion } from 'motion/react';

interface StoryProgressProps {
  count: number;
  currentIndex: number;
  progress: number; // 0 to 100
  isVisible?: boolean;
}

export function StoryProgress({ count, currentIndex, progress, isVisible }: StoryProgressProps) {
  if (!isVisible) return null;

  return (
    <div className="flex gap-1.5 bg-gradient-to-b from-black/30 to-transparent pt-3 pb-6 px-1">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden"
        >
          {i < currentIndex && (
            <div className="h-full w-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          )}
          {i === currentIndex && (
            <motion.div 
              className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          )}
          {i > currentIndex && (
            <div className="h-full w-0 bg-white" />
          )}
        </div>
      ))}
    </div>
  );
}
