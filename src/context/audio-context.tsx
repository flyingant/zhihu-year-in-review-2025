'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from 'react';
import { useAssets } from '@/context/assets-context';

interface AudioContextType {
  isPlaying: boolean;
  togglePlayPause: () => void;
  play: () => void;
  pause: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const { assets } = useAssets();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const audioUrl = assets?.report.audio.bgAudio?.url;

  const play = () => {
    if (!audioRef.current || !audioUrl) return;

    audioRef.current.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
    setIsPlaying(true);
  };

  const pause = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  // Handle audio ended event
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlayPause, play, pause }}>
      {/* Hidden audio element */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} loop />}
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
