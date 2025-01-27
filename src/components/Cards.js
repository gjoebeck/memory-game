import React from 'react';

const Card = ({ card, isFlipped, isMatched, isMismatch, onClick }) => {
  const showIcon = isFlipped || isMatched; // Determine if the icon should be visible 
  
  return (
    <div
      onClick={() => !isFlipped && !isMatched && onClick()}
      className={`memory-game-card ${showIcon ? "flipped" : ""} ${isMatched ? "matched" : ""} ${isMismatch ? "mismatch" : ""}`}
    >
      <div className="card-inner">
        <div className="card-front" />
        <div className="card-back">
          {card.Icon && <card.Icon size={40} color="white" strokeWidth={2} />}
        </div>
      </div>
    </div>
  );
};

export default Card;