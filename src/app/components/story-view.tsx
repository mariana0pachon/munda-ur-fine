import React, { useEffect, useRef } from 'react';

interface Story {
  id: number;
  type: 'video' | 'image';
  src: string;
  content: React.ReactNode;
}

interface StoryViewProps {
  story: Story;
  isActive: boolean;
  onVideoEnd?: () => void;
}

export function StoryView({ story, isActive, onVideoEnd }: StoryViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(e => console.log("Video play failed", e));
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isActive]);

  return (
    <div className={`absolute inset-0 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
      {story.type === 'video' ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted // Stories are often muted by default or controlled by global state
          onEnded={onVideoEnd}
        >
          <source src={story.src} type="video/mp4" />
        </video>
      ) : (
        <img
          src={story.src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      {/* Overlay Content */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {story.content}
      </div>
    </div>
  );
}
