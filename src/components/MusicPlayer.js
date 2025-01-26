import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import '../styles/MusicPlayer.css';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  const tracks = [
    { title: "Track 1", src: "track1.mp3" },
    { title: "Track 2", src: "track2.mp3" },
    { title: "Track 3", src: "track3.mp3"},
    { title: "Track 4", src: "track4.mp3"},
  ];

  useEffect(() => {
    const wasPlaying = isPlaying;
    audioRef.current = new Audio(tracks[currentTrack].src);
    audioRef.current.volume = volume;
    audioRef.current.loop = true;
    
    if (wasPlaying) {
      audioRef.current.play();
    }
    
    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, [currentTrack]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="music-player">
      <div className="music-controls">
        <button onClick={prevTrack} className="control-button">
          <SkipBack size={20} />
        </button>
        <button onClick={togglePlay} className="control-button">
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button onClick={nextTrack} className="control-button">
          <SkipForward size={20} />
        </button>
        <div className="volume-control">
          <Volume2 size={20} className="control-button" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
        <div className="track-title">
          {tracks[currentTrack].title}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;