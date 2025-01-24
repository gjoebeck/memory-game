import React from 'react';
import { Scroll, Sword, Crown } from 'lucide-react';
import '../styles/StartMenu.css';

const StartMenu = ({ onStartGame }) => {
  return (
    <div className="start-menu">
      <div className="start-menu-content">
        <div className="title-section">
          <Crown className="crown-icon" size={80} />
          <h1 className="game-title">Memory Quest</h1>
          <div className="swords">
            <Sword className="sword-left" size={50} />
            <Sword className="sword-right" size={50} />
          </div>
        </div>
        
        <div className="scroll-section">
          <Scroll size={40} className="scroll-icon" />
          <p className="scroll-text">Embark on a journey to test your memory and claim the crown!</p>
        </div>

        <button onClick={onStartGame} className="start-button">
          Begin Quest
        </button>
      </div>
    </div>
  );
};

export default StartMenu;