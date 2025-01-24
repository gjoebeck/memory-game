import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const BackgroundMusic = () => {
  const [audio] = useState(new Audio('/background-music.mp3'));
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audio.loop = true;
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, audio]);

  return (
    <button 
      onClick={togglePlay}
      className="fixed top-4 right-4 p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
    >
      {isPlaying ? <Volume2 size={24} color="white" /> : <VolumeX size={24} color="white" />}
    </button>
  );
};

export default BackgroundMusic;