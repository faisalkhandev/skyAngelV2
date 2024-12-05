/* GameOverScreen.jsx */
/* eslint-disable react/prop-types */
import { useState } from 'react';

const GameOverScreen = ({ data, onRestart }) => {
    const [name, setName] = useState('');
    const [ranking, setRanking] = useState([]);

    const handleSubmit = () => {
        if (!name) return;

        // Example: Send data to the server and fetch updated rankings
        fetch('http://abc.com/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, time: data.time, stars: data.stars }),
        })
            .then((response) => response.json())
            .then((rankings) => {
                setRanking(rankings);
            })
            .catch((error) => {
                console.error('Error submitting score:', error);
            });
    };

    return (
        <div
            className="game-over-screen"
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
            }}
        >
            <h2>Game Over</h2>
            <p>Time: {data.time} seconds</p>
            <p>Stars Collected: {data.stars}</p>
            <div>
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ padding: '5px', fontSize: '16px', marginTop: '10px' }}
                />
            </div>
            <button
                onClick={handleSubmit}
                disabled={!name}
                style={{ padding: '10px 20px', fontSize: '16px', marginTop: '10px', cursor: 'pointer' }}
            >
                Submit Score
            </button>

            {ranking.length > 0 && (
                <div style={{ marginTop: '20px', textAlign: 'left' }}>
                    <h3>Ranking</h3>
                    <ul>
                        {ranking.map((entry, index) => (
                            <li key={index}>
                                {entry.name} - Time: {entry.time}s - Stars: {entry.stars}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button
                onClick={onRestart}
                style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px', cursor: 'pointer' }}
            >
                Restart Game
            </button>
        </div>
    );
};

export default GameOverScreen;
