import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import '../styles/MusicPlayer.css';

const MusicPlayer = () => {
  // State variables to manage playback, current track, and volume
  const [isPlaying, setIsPlaying] = useState(false); // Whether the music is currently playing
  const [currentTrack, setCurrentTrack] = useState(0); // Index of the current track
  const [volume, setVolume] = useState(0.5); // Volume level 
  const audioRef = useRef(null); // Ref to manage the Audio object

  // Array of track objects with titles and file paths
  const tracks = [
    { title: "Track 1", src: "track1.mp3" },
    { title: "Track 2", src: "track2.mp3" },
    { title: "Track 3", src: "track3.mp3" },
    { title: "Track 4", src: "track4.mp3" },
  ];

  // Effect to handle track changes
  useEffect(() => {
    const wasPlaying = isPlaying;  // Save the current play state
    audioRef.current = new Audio(tracks[currentTrack].src); // Load the new track
    audioRef.current.volume = volume;  // Set the volume for the new track
    audioRef.current.loop = true; // Enable looping for the track

    if (wasPlaying) {
      audioRef.current.play(); // Resume playback if the previous track was playing
    }
    // Cleanup: Pause and remove the previous track's audio object
    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, [currentTrack]); // Runs whenever the current track changes

  // Toggle play/pause state
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause(); // Pause playback if currently playing
    } else {
      audioRef.current.play(); // Start playback if paused
    }
    setIsPlaying(!isPlaying); // Update the play state
  };


  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  // Handle volume slider changes
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value); // Event handler to get the new volume value from the slider
    setVolume(newVolume); // Update the volume state
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="music-player">
      <div className="music -controls">
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
      {/* Dancing Cat GIF */}
      <div className="cat-container">
        <img
          src="/cat-jam-cat.gif"
          alt="Dancing Cat"
          className={`cat-gif ${isPlaying ? "playing" : "paused"}`}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;