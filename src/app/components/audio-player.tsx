import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  isStarted: boolean;
}

export function AudioPlayer({ src, isStarted }: AudioPlayerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isStarted && audioRef.current) {
      audioRef.current.volume = 0.7;
      audioRef.current.play().catch(e => console.log("Audio play failed", e));
    }
  }, [isStarted]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="absolute bottom-8 right-4 z-50">
      <button 
        onClick={toggleMute}
        className="p-2 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-colors"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
      <audio 
        ref={audioRef}
        src={src}
        loop
        preload="auto"
      />
    </div>
  );
}
