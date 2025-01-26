import React from 'react';

const Card = ({ card, isFlipped, isMatched, isMismatch, isLastMatched, onClick }) => {
  const showIcon = isFlipped || isMatched;
  
  return (
    <div
      onClick={() => !isFlipped && !isMatched && onClick()}
      className={`memory-game-card ${showIcon ? "flipped" : ""} ${isMatched ? "matched" : ""} ${isMismatch ? "mismatch" : ""} ${isLastMatched ? "last-matched" : ""}`}
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