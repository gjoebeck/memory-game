import React, { useState } from "react";
import MemoryGame from "./components/MemoryGame";
import StartMenu from "./components/Menu"; 
import MusicPlayer from "./components/MusicPlayer.js";
import "./styles/App.css";

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="memory-game-container">
      {gameStarted ? (
        <MemoryGame />
      ) : (
        <StartMenu onStartGame={() => setGameStarted(true)} />
      )}
      <MusicPlayer />
    </div>
  );
}

export default App;