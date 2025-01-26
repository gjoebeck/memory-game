import React, { useState, useEffect, useRef } from 'react';
import { Sword, Shield, Star, Scroll, Crown, Heart, Gem, Sun, Moon, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import MemoryGrid from './memoryGrid';
import '../styles/MemoryGame.css';
import '../styles/Card.css';
import '../styles/Celebration.css'

const MemoryGame = () => {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [mismatched, setMismatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [lastMatchedPair, setLastMatchedPair] = useState([]);
  
  const audioRef = useRef(new Audio('/background-music.mp3'));
  const matchSoundRef = useRef(new Audio('/match-sound.mp3'));
  const victorySoundRef = useRef(new Audio('/victory-sound.mp3'));
  
  const allIcons = [
    { id: 1, Icon: Sword, name: 'sword' },
    { id: 2, Icon: Shield, name: 'shield' },
    { id: 3, Icon: Star, name: 'star' },
    { id: 4, Icon: Scroll, name: 'scroll' },
    { id: 5, Icon: Crown, name: 'crown' },
    { id: 6, Icon: Heart, name: 'heart' },
    { id: 7, Icon: Gem, name: 'gem' },
    { id: 8, Icon: Sun, name: 'sun' },
    { id: 9, Icon: Moon, name: 'moon' },
  ];

  const getLevelIcons = () => {
    return allIcons.slice(0, 4 + level);
  };

  const getMovesLimit = () => {
    return 8 + (level * 2);
  };

  useEffect(() => {
    audioRef.current.loop = true;
    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  const toggleMusic = () => {
    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      const firstCard = cards[first];
      const secondCard = cards[second];
      const levelIcons = getLevelIcons();

      if (firstCard?.name === secondCard?.name) {
        // Play match sound
        matchSoundRef.current.play();
        
        // Add to matched cards
        setMatched(prev => {
          const newMatched = [...prev, firstCard.name];
          // Check if this completes the level
          if (newMatched.length === levelIcons.length) {
            victorySoundRef.current.play();
            setTimeout(() => setShowSuccess(true), 500);
          }
          return newMatched;
        });

        setLastMatchedPair([first, second]);
        setTimeout(() => {
          setLastMatchedPair([]);
          setFlipped([]);
        }, 1000);
      } else {
        setMismatched([first, second]);
        setTimeout(() => {
          setFlipped([]);
          setMismatched([]);
          setMoves(m => m + 1);
        }, 1000);
      }
    }
  }, [flipped, cards]);

  const initializeGame = (newLevel = level) => {
    const levelIcons = allIcons.slice(0, 4 + newLevel);
    const shuffledCards = [...levelIcons, ...levelIcons]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, index }));
    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setMismatched([]);
    setMoves(0);
    setGameOver(false);
    setShowSuccess(false);
  };

  const nextLevel = () => {
    if (level < 5) {
      const newLevel = level + 1;
      setLevel(newLevel);
      initializeGame(newLevel);
    }
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    const movesLimit = getMovesLimit();
    if (moves >= movesLimit && matched.length < getLevelIcons().length) {
      setGameOver(true);
      setTimeout(() => initializeGame(), 2000);
    }
  }, [moves, matched.length, level]);

  const handleClick = (index) => {
    if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(cards[index].name)) {
      setFlipped(prev => [...prev, index]);
    }
  };

  const movesLimit = getMovesLimit();
  const levelIcons = getLevelIcons();

  return (
    <div className="memory-game-container" data-level={level}>
      <div className="memory-game-header">
        <div className="icon-wrapper">
          <img 
            src="/noun-brain-7484449.svg" 
            alt="brain icon" 
            width="40" 
            height="40" 
            style={{filter: "brightness(0) invert(1)"}} 
          />
        </div>
        <div className="header-content">
          <p className="level-indicator">Level {level}</p>
          <p>
            {matched.length === levelIcons.length
              ? "Level Complete!"
              : "Match the symbols to win"}
          </p>
        </div>
        <button 
          onClick={toggleMusic}
          className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
        >
          {isMusicPlaying ? 
            <Volume2 size={24} color="white" /> : 
            <VolumeX size={24} color="white" />
          }
        </button>
      </div>

      <div className="memory-game-scoreboard">
        <span className="score">Moves: {moves}/{movesLimit}</span>
        <span className="score">Matches: {matched.length}/{levelIcons.length}</span>
        <button onClick={() => initializeGame()} className="restart-button">
          Restart Level
        </button>
      </div>

      <MemoryGrid
        cards={cards}
        flipped={flipped}
        matched={matched}
        mismatched={mismatched}
        lastMatchedPair={lastMatchedPair}
        handleClick={handleClick}
      />

{showSuccess && (
  <div className="celebration-overlay">
    <div className="success-content">
      <h2 className="success-heading">Level {level} Complete!</h2>
      {level < 5 ? (
        <button onClick={nextLevel} className="next-level-button">
          Start Level {level + 1}
          <ArrowRight size={24} />
        </button>
      ) : (
        <div className="success-heading">
          Congratulations! You've completed all levels!
        </div>
      )}
    </div>
  </div>
)}

      {gameOver && (
        <div className="memory-game-failure">
          Out of moves! Try again!
        </div>
      )}
    </div>
  );
};

export default MemoryGame;