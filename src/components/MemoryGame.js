import React, { useState, useEffect, useRef } from 'react';
import { Sword, Shield, Star, Scroll, Crown, Heart, Gem, Sun, Moon, ArrowRight } from 'lucide-react';
import MemoryGrid from './memoryGrid';
import '../styles/MemoryGame.css';
import '../styles/Card.css';
import '../styles/Celebration.css';

const MemoryGame = () => {
  // Core state management
  const [level, setLevel] = useState(1);                    // Tracks current level (1-5)
  const [cards, setCards] = useState([]);                   // Array of cards to display
  const [flipped, setFlipped] = useState([]);               // Tracks currently flipped cards (max 2)
  const [matched, setMatched] = useState([]);               // Stores matched card names
  const [mismatched, setMismatched] = useState([]);         // Tracks temporary mismatches
  const [moves, setMoves] = useState(0);                    // Counts player moves
  const [gameOver, setGameOver] = useState(false);          // Tracks game over state
  const [showSuccess, setShowSuccess] = useState(false);    // Controls success overlay
  const [lastMatchedPair, setLastMatchedPair] = useState([]);  // Tracks last matched pair
  const [timeLeft, setTimeLeft] = useState(120);            // Timer countdown
  

  // Audio setup
  const matchSoundRef = useRef(new Audio('/match-sound.mp3'));
  const victorySoundRef = useRef(new Audio('/victory-sound.mp3'));

  // Game icons configuration
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

  // Helper functions
  const getLevelIcons = () => {
    // Each level adds one more pair of icons (4 + level)
    return allIcons.slice(0, 4 + level);
  };

  const getMovesLimit = () => {
    // Move limit increases with level
    return 8 + level * 2;
  };

  // Timer setup
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

  // Card matching logic
  useEffect(() => {
    if (flipped.length === 2) { // If two cards have been flipped
      const [first, second] = flipped; //  Get the indices of the first and second flipped cards
      const firstCard = cards[first];  // Get the card object for the first flipped card using its index
      const secondCard = cards[second]; // Retrieve the card object for the second flipped card using its index
      const levelIcons = getLevelIcons(); // Get the set of icons currently in play for this level

      if (firstCard?.name === secondCard?.name) { // If the name props of the cards match
        matchSoundRef.current.play(); // Play the match ding
        setMatched((prev) => {
          const newMatched = [...prev, firstCard.name]; // Add the name of the matched card to the matched list to keep track of how many matched cards there are
          // Check for level completion
          if (newMatched.length === levelIcons.length) { // If all the pairs have been matched
            victorySoundRef.current.play(); // Play the winning ding
            setShowSuccess(true); // Shows the "level win" overlay when all pairs are matched
          }
          return newMatched; // Return the updated list of matched cards to update the state properly
        });
        setFlipped([]);  // Clear the flipped cards array to reset for the next attempt
      } else { // Otherwise, the two cards aren't a match
        setMismatched([first, second]);  // Temporarily mark the mismatched cards
        setTimeout(() => {
          setFlipped([]); // Reset the flipped cards array after a delay to allow the player to see the mismatch
          setMismatched([]); // Clear the mismatched state, removing any mismatch-specific styles
          setMoves((m) => m + 1);  // Increment the moves counter to track the player's attempts
        }, 1000); // Delay for 1 second to discourage spamming, may increase this value in the future
      }
    }
  }, [flipped, cards]); // Whenever the list of flipped cards or the deck of cards changes, check if two cards have been flipped and handle the game logic

  // Game initialization
  const initializeGame = (newLevel = level) => {
    // Get the icons for a particular level
    const levelIcons = allIcons.slice(0, 4 + newLevel);
    // Create and shuffle card pairs
    const shuffledCards = [...levelIcons, ...levelIcons]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, index }));
    // Reset all game states
    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setMismatched([]);
    setMoves(0);
    setGameOver(false);
    setShowSuccess(false);
    setTimeLeft(120);
  };

  // Level progression
  const nextLevel = () => {
    if (level < 5) {
      const newLevel = level + 1;
      setLevel(newLevel);
      initializeGame(newLevel);
    }
  };

  // Initial game setup
  useEffect(() => {
    initializeGame();
  }, []);

  // Game over conditions check
  useEffect(() => {
    const movesLimit = getMovesLimit(); // Get the max number of moves allowed for the current level

    // Check if the game is over if the player used up all their moves or time has run out and all pairs aren't matched yet

    if ((moves >= movesLimit || timeLeft <= 0) && matched.length < getLevelIcons().length) {
      setGameOver(true);
      setTimeout(() => initializeGame(), 2000);
    }
  }, [moves, matched.length, level, timeLeft]);

  // Watching:
  // moves: To see if the player hits the move limit
  // matched.length: To check if all pairs are matched
  // level: To reset properly when the level changes
  // timeLeft: To trigger game over when the timer runs out

  // Card click handler
  const handleClick = (index) => {
    if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(cards[index].name)) { // Makes sure only two cards can be flipped at a time, prevents the same card from being flipped twice, and ensures that already matched cards cannot be flipped again.
      setFlipped((prev) => [...prev, index]); // Adds the clicked card's index to the list of currently flipped cards to keep track of which cards are currently flipped and visible on the board
    }
  };

  const movesLimit = getMovesLimit();
  const levelIcons = getLevelIcons();

  return (
    <div className="memory-game-container" data-level={level}>
      {/* Game header with level info and timer */}
      <div className="memory-game-header">
        <div className="icon-wrapper">
          <img
            src="/noun-brain-7484449.svg"
            alt="brain icon"
            width="40"
            height="40"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>
        <div className="header-content">
          <p className="level-indicator">Level {level}</p>
          <p className="timer">Time: {timeLeft}s</p>
          <p>
            {matched.length === levelIcons.length // Check if all pairs of cards have been matched
              ? "Level Complete!"
              : "Match the symbols to win"}
          </p>
        </div>
      </div>

      {/*Pair match tracker and restart button */}
      <div className="memory-game-scoreboard">
        <span className="score">Tries: {moves}/{movesLimit}</span>
        <span className="score">Matches: {matched.length}/{levelIcons.length}</span>
        <button onClick={() => initializeGame()} className="restart-button">
          Restart Level
        </button>
      </div>

      {/* Main game grid, lays out the cards in a grid and updates dynamically as levels progress. */}
      <MemoryGrid
        cards={cards}  // Array of card objects, each containing icon and identifier info
        flipped={flipped} // Indices of the currently flipped cards
        matched={matched} // List of card names that have been matched successfully
        mismatched={mismatched} // Indices of temporarily mismatched cards 
        lastMatchedPair={lastMatchedPair} // Tracks the last matched pair for effects or animations
        handleClick={handleClick} // Function to handle when a card is clicked
      />


      {/* Level completed overlay */}
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
              <div>
                <div className="success-heading">
                  Congratulations! You've completed all levels!
                </div>
                <button
                  onClick={() => { // Event handler for the star new game button 
                    setLevel(1);
                    initializeGame(1);
                  }}
                  className="next-level-button mt-4"
                >
                  Start New Game
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game over overlay */}
      {gameOver && (
        <div className="memory-game-failure">
          {timeLeft <= 0 ? "Time's up!" : "Out of moves!"} Try again!
        </div>
      )}
    </div>
  );
};

export default MemoryGame;