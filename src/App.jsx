import { useState } from 'react';

import './App.css';
import StartScreen from './components/StartScreen';
import GameCanvas from './components/GameCanvas';
import GameOverScreen from './components/GameOverScreen';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameData, setGameData] = useState(null);

  const handleStartGame = () => {
    setGameStarted(true);
    setGameOver(false);
  };

  const handleGameOver = (data) => {
    setGameData(data);
    setGameStarted(false);
    setGameOver(true);
  };

  return (
    <div className="App">
      {!gameStarted && !gameOver && (
        <StartScreen onStartGame={handleStartGame} />
      )}

      {gameStarted && !gameOver && (
        <GameCanvas onGameOver={handleGameOver} />
      )}

      {gameOver && <GameOverScreen data={gameData} />}
    </div>
  );
}

export default App;
