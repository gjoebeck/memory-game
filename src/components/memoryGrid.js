import React from "react";
import Card from "./Cards";

const MemoryGrid = ({ cards, flipped, matched, mismatched, lastMatchedPair, handleClick }) => {
  return (
    <div className="memory-game-grid">
      {cards.map((card, index) => (
        <Card
          key={index}
          card={card}
          isFlipped={flipped.includes(index)}
          isMatched={matched.includes(card.name)}
          isMismatch={mismatched.includes(index)}
          isLastMatched={lastMatchedPair.includes(index)}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};

export default MemoryGrid;