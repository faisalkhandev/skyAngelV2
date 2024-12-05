/* eslint-disable react/prop-types */
import { useState } from 'react';

const GameOverScreen = ({ data }) => {
    const [name, setName] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const handleInputChange = (e) => {
        setName(e.target.value);
        setIsButtonDisabled(e.target.value.trim() === '');
    };

    const submitScore = () => {
        if (name) {
            // Send data to server via AJAX
            fetch('http://xxxxxxxxx/register.php', {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    time: data.time,
                    stars: data.stars,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((ranking) => {
                    console.log('Ranking:', ranking);
                })
                .catch((error) => console.error('Error:', error));
        }
    };

    return (
        <div className="game-over-screen">
            <h2>Game Over</h2>
            <p>Time: {data.time}s</p>
            <p>Stars: {data.stars}</p>
            <input
                type="text"
                value={name}
                onChange={handleInputChange}
                placeholder="Enter your name"
            />
            <button onClick={submitScore} disabled={isButtonDisabled}>
                Continue
            </button>
        </div>
    );
};

export default GameOverScreen;
