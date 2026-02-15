import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { StoryProgress } from "./components/story-progress";
import { AudioPlayer } from "./components/audio-player";
import { Play, Loader2 } from "lucide-react";
import { useAssetPreloader } from "./hooks/useAssetPreloader";

// Import the Figma components
import Story1 from "../imports/InstagramStory1";
import Story2 from "../imports/InstagramStory2";
import Story3 from "../imports/InstagramStory3";
import Story4 from "../imports/InstagramStory4";
import Story5 from "../imports/InstagramStory5";
import Story6 from "../imports/InstagramStory6";
import Story7 from "../imports/InstagramStory7";
import Story8 from "../imports/InstagramStory8";
import Story9 from "../imports/InstagramStory9";
import Story10 from "../imports/InstagramStory10";
import Story11 from "../imports/InstagramStory11";
import Story12 from "../imports/InstagramStory12";
import Story13 from "../imports/InstagramStory13";
import Story14 from "../imports/InstagramStory14";
import Story15 from "../imports/InstagramStory15";
import Story16 from "../imports/InstagramStory16";

const STORIES = [
  { id: 1, Component: Story1 },
  { id: 2, Component: Story2 },
  { id: 3, Component: Story3 },
  { id: 4, Component: Story4 },
  { id: 5, Component: Story5 },
  { id: 6, Component: Story6 },
  { id: 7, Component: Story7 },
  { id: 8, Component: Story8 },
  { id: 9, Component: Story9 },
  { id: 10, Component: Story10 },
  { id: 11, Component: Story11 },
  { id: 12, Component: Story12 },
  { id: 13, Component: Story13 },
  { id: 14, Component: Story14 },
  { id: 15, Component: Story15 },
  { id: 16, Component: Story16 },
];

const STORY_DURATION = 10000;

function StoryWrapper({
  Component,
  isActive,
  currentIndex,
  progress,
  count,
}: {
  Component: React.ComponentType;
  isActive: boolean;
  currentIndex: number;
  progress: number;
  count: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { innerHeight } = window;
        const designHeight = 1920;
        setScale(innerHeight / designHeight);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const videos = containerRef.current.querySelectorAll("video");
    if (isActive) {
      videos.forEach((video) => {
        video.currentTime = 0;
        video.removeAttribute("muted");
        video.muted = false;
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");
        video.play().catch(e => {
          // If unmuted play fails, try muted then unmute
          video.muted = true;
          video.play().then(() => {
            setTimeout(() => { video.muted = false; }, 100);
          }).catch(e2 => console.warn("Autoplay blocked", e2));
        });
      });
    } else {
      videos.forEach((video) => {
        video.pause();
      });
    }
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 bg-black ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"}`}
    >
      <div
        style={{
          width: "1080px",
          height: "1920px",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          flexShrink: 0,
        }}
        className="relative overflow-hidden story-text-stroke"
      >
        <Component />
        
        {/* Progress bar fixed inside the frame container */}
        <div className="absolute top-0 inset-x-0 z-50 px-4">
          <StoryProgress
            count={count}
            currentIndex={currentIndex}
            progress={progress}
            isVisible={isActive}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const { isLoading, progress: loadingProgress } = useAssetPreloader();

  const nextStory = useCallback(() => {
    setCurrentIndex((prev) => (prev < STORIES.length - 1 ? prev + 1 : 0));
    setProgress(0);
  }, []);

  const prevStory = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!hasStarted || isPaused) return;
    const interval = 50;
    const step = (interval / STORY_DURATION) * 100;
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextStory();
          return 0;
        }
        return prev + step;
      });
    }, interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [hasStarted, isPaused, nextStory]);

  const handlePointerDown = () => {
    startTimeRef.current = Date.now();
    setIsPaused(true);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const duration = Date.now() - startTimeRef.current;
    setIsPaused(false);
    if (duration < 200) {
      const { clientX } = e;
      const { innerWidth } = window;
      if (clientX < innerWidth * 0.4) prevStory();
      else nextStory();
    }
  };

  if (!hasStarted) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white p-6 text-center space-y-6">
        <h1 className="font-['Instrument_Serif'] text-5xl italic text-[#e9ac3f]">
          Munda you're fine
        </h1>
        <p className="opacity-70 max-w-xs text-lg">
          Feliz cumpleaños hermana. Espero que te lo disfrutes.
        </p>

        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2
              size={64}
              className="text-[#e9ac3f] animate-spin"
            />
            <p className="text-sm opacity-50">
              Loading... {Math.round(loadingProgress)}%
            </p>
          </div>
        ) : (
          <button
            onClick={() => setHasStarted(true)}
            className="w-24 h-24 bg-[#e9ac3f] rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-[0_0_30px_rgba(233,172,63,0.3)]"
          >
            <Play size={40} fill="currentColor" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black overflow-hidden select-none touch-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <AudioPlayer
        src="/assets/hasta_la_raiz.mp3"
        isStarted={hasStarted}
      />
      {STORIES.map((story, index) => (
        <StoryWrapper
          key={story.id}
          Component={story.Component}
          isActive={index === currentIndex}
          currentIndex={currentIndex}
          progress={progress}
          count={STORIES.length}
        />
      ))}
    </div>
  );
}
