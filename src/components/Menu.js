import React from 'react';
import { Scroll, Sword, Crown, Brain } from 'lucide-react';
import '../styles/StartMenu.css';

const StartMenu = ({ onStartGame }) => {
  return (
    <div className="start-menu">
      <div className="start-menu-content">
        <div className="title-section">
            <Brain className="memory-icon" size={80} />
          <h1 className="game-title">Card Matcher</h1>
        </div>
        
        <div className="scroll-section">
          <Scroll size={40} className="scroll-icon" />
          <p className="scroll-text">Test your memory!</p>
        </div>

        <button onClick={onStartGame} className="start-button">
          Start
        </button>
      </div>
    </div>
  );
};

export default StartMenu;