import { useState, useEffect } from 'react';

interface AssetPreloaderState {
  isLoading: boolean;
  progress: number;
  error: string | null;
}

const ASSETS = {
  videos: [
    '/_videos/v1/01.mp4',
    '/_videos/v1/02.mp4',
    '/_videos/v1/03.mp4',
    '/_videos/v1/04.mp4',
    '/_videos/v1/05.mp4',
    '/_videos/v1/14.mp4',
    '/_videos/v1/15.mp4',
  ],
  images: [
    '/_videos/v1/06.jpg',
    '/_videos/v1/07.jpg',
    '/_videos/v1/08.jpg',
    '/_videos/v1/09.jpg',
    '/_videos/v1/10.jpg',
    '/_videos/v1/11.jpg',
    '/_videos/v1/12.jpg',
    '/_videos/v1/13.jpg',
    '/_videos/v1/16.jpg',
  ],
  audio: ['/assets/hasta_la_raiz.mp3'],
};

const preloadVideo = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.src = src;

    video.addEventListener('loadeddata', () => resolve());
    video.addEventListener('error', () => reject(new Error(`Failed to load video: ${src}`)));

    video.load();
  });
};

const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

const preloadAudio = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = src;

    audio.addEventListener('canplaythrough', () => resolve(), { once: true });
    audio.addEventListener('error', () => reject(new Error(`Failed to load audio: ${src}`)));

    audio.load();
  });
};

export function useAssetPreloader(): AssetPreloaderState {
  const [state, setState] = useState<AssetPreloaderState>({
    isLoading: true,
    progress: 0,
    error: null,
  });

  useEffect(() => {
    const allAssets = [
      ...ASSETS.videos,
      ...ASSETS.images,
      ...ASSETS.audio,
    ];

    const totalAssets = allAssets.length;
    let loadedCount = 0;

    const updateProgress = () => {
      loadedCount++;
      const progress = (loadedCount / totalAssets) * 100;
      setState(prev => ({ ...prev, progress }));
    };

    const loadAllAssets = async () => {
      try {
        const promises = [
          ...ASSETS.videos.map(src =>
            preloadVideo(src)
              .then(updateProgress)
              .catch(err => {
                console.warn(err);
                updateProgress(); // Continue even if one asset fails
              })
          ),
          ...ASSETS.images.map(src =>
            preloadImage(src)
              .then(updateProgress)
              .catch(err => {
                console.warn(err);
                updateProgress();
              })
          ),
          ...ASSETS.audio.map(src =>
            preloadAudio(src)
              .then(updateProgress)
              .catch(err => {
                console.warn(err);
                updateProgress();
              })
          ),
        ];

        await Promise.all(promises);

        setState({
          isLoading: false,
          progress: 100,
          error: null,
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load assets',
        }));
      }
    };

    loadAllAssets();
  }, []);

  return state;
}
