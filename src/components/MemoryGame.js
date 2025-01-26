import React, { useState, useEffect, useRef } from 'react';
import { Sword, Shield, Star, Scroll, Crown, Heart, Gem, Sun, Moon, ArrowRight } from 'lucide-react';
import MemoryGrid from './memoryGrid';
import '../styles/MemoryGame.css';
import '../styles/Card.css';
import '../styles/Celebration.css';

const MemoryGame = () => {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [mismatched, setMismatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastMatchedPair, setLastMatchedPair] = useState([]);
  const [timeLeft, setTimeLeft] = useState(120);
  
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
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [level]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      const firstCard = cards[first];
      const secondCard = cards[second];
      const levelIcons = getLevelIcons();

      if (firstCard?.name === secondCard?.name) {
        matchSoundRef.current.play();
        setMatched(prev => {
          const newMatched = [...prev, firstCard.name];
          if (newMatched.length === levelIcons.length) {
            victorySoundRef.current.play();
            setShowSuccess(true);
          }
          return newMatched;
        });
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
    setTimeLeft(120);
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
    if ((moves >= movesLimit || timeLeft <= 0) && matched.length < getLevelIcons().length) {
      setGameOver(true);
      setTimeout(() => initializeGame(), 2000);
    }
  }, [moves, matched.length, level, timeLeft]);

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
          <p className="timer">Time: {timeLeft}s</p>
          <p>
            {matched.length === levelIcons.length
              ? "Level Complete!"
              : "Match the symbols to win"}
          </p>
        </div>
      </div>

      <div className="memory-game-scoreboard">
        <span className="score">Tries: {moves}/{movesLimit}</span>
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
          <div className="firework"></div>
          <div className="firework"></div>
          <div className="firework"></div>
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
          {timeLeft <= 0 ? "Time's up!" : "Out of moves!"} Try again!
        </div>
      )}
    </div>
  );
};

export default MemoryGame;