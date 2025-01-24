import React, { useState, useEffect, useRef } from 'react';
import { Sword, Shield, Star, Scroll, Crown, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import MemoryGrid from './memoryGrid';
import '../styles/MemoryGame.css';
import '../styles/Card.css';
import '../styles/MemoryGrid.css';
import '../styles/App.css';

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [mismatched, setMismatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  const audioRef = useRef(new Audio('/background-music.mp3'));
  
  const icons = [
    { id: 1, Icon: Sword, name: 'sword' },
    { id: 2, Icon: Shield, name: 'shield' },
    { id: 3, Icon: Star, name: 'star' },
    { id: 4, Icon: Scroll, name: 'scroll' },
    { id: 5, Icon: Crown, name: 'crown' },
  ];

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

      const isMatch = firstCard?.name === secondCard?.name;
      
      if (isMatch) {
        setMatched(prev => [...prev, firstCard.name]);
        setFlipped([]);
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

  useEffect(() => {
    if (matched.length === icons.length) {
      setTimeout(() => setShowSuccess(true), 500);
    }
  }, [matched, icons.length]);

  const initializeGame = () => {
    const shuffledCards = [...icons, ...icons]
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

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (moves >= 10 && matched.length < icons.length) {
      setGameOver(true);
      setTimeout(initializeGame, 2000);
    }
  }, [moves, matched.length, icons.length]);

  const handleClick = (index) => {
    if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(cards[index].name)) {
      setFlipped(prev => [...prev, index]);
    }
  };

  return (
    <div className="memory-game-container">
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
        <p>
          {matched.length === icons.length
            ? "Congratulations, you win!"
            : "Match the symbols to win"}
        </p>
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
        <span className="score">Moves: {moves}/10</span>
        <span className="score">Matches: {matched.length}/{icons.length}</span>
        <button onClick={initializeGame} className="restart-button">
          Restart
        </button>
      </div>

      <MemoryGrid
        cards={cards}
        flipped={flipped}
        matched={matched}
        mismatched={mismatched}
        handleClick={handleClick}
      />

      {showSuccess && (
        <div className="memory-game-success">
          <button className="restart-button">
            Continue Journey <ArrowRight size={20} />
          </button>
        </div>
      )}

      {gameOver && (
        <div className="memory-game-failure">
          Your memory fails you. Try again!
        </div>
      )}
    </div>
  );
};

export default MemoryGame;