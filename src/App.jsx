/* App.jsx */
import { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import GameOverScreen from './components/GameOverScreen';
import './App.css';

function App() {
  const [gameOverData, setGameOverData] = useState(null);

  const handleGameOver = (data) => {
    setGameOverData(data);
  };

  const handleRestart = () => {
    setGameOverData(null);
  };

  return (
    <div className="App">
      {!gameOverData ? (
        <GameCanvas onGameOver={handleGameOver} />
      ) : (
        <GameOverScreen data={gameOverData} onRestart={handleRestart} />
      )}
    </div>
  );
}

export default App;
