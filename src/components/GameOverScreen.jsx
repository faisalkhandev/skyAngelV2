/* eslint-disable react/prop-types */
import { useState } from 'react';
import './GameOver.css';

const GameOverScreen = ({ data, onRestart }) => {
    const [name, setName] = useState('');
    const [ranking, setRanking] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // MockAPI endpoint
    const API_URL = 'https://6751d259d1983b9597b47df0.mockapi.io/api/v1/userData';

    const handleSubmit = () => {
        if (!name.trim()) {
            setError('Name cannot be empty.');
            return;
        }

        setError('');

        if (!name || isSubmitting) return;
        setIsSubmitting(true);

        // Prepare the score data
        const scoreData = {
            name: name.trim(),
            time: data.time,
            stars: data.stars,
        };

        // Send POST request to store the score
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scoreData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to submit score.');
                }
                return response.json();
            })
            .then(() => {

                return fetch(API_URL);
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch rankings.');
                }
                return response.json();
            })
            .then((rankingsData) => {
                console.log("rankingData::", rankingsData);
                const sortedRankings = rankingsData.sort((a, b) => {
                    if (b.time !== a.time) {
                        return b.time - a.time; // Higher time first
                    }
                    return b.stars - a.stars; // If time equal, higher stars first
                });
                setRanking(sortedRankings);
                setName('');
                setShowDialog(true);
                setIsSubmitting(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                setError('An error occurred while submitting your score.');
            });
    };

    const handleDialogClose = () => {
        setShowDialog(false);
    };

    return (
        <div className="game-over-screen">
            <h2>Game Over</h2>
            <p>Time Survived: {data?.time} seconds</p>
            <p>Stars Collected: {data?.stars}</p>
            <div className="score-submission">
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="name-input"
                />
                <button onClick={handleSubmit} className="submit-button" disabled={!name.trim() || isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Score'}
                </button>
            </div>
            {error && <p className="error-message">{error}</p>}
            {ranking.length > 0 && (
                <div className="ranking">
                    <h3>Top Scores</h3>
                    <ol>
                        {ranking.map((entry, index) => (
                            <li key={index}>
                                {entry.name} - {entry.time}s - {entry.stars} Stars
                            </li>
                        ))}
                    </ol>
                </div>
            )}
            <button onClick={onRestart} className="restart-button">
                Restart Game
            </button>

            {showDialog && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Success!</h3>
                        <p>Your score has been submitted.</p>
                        <button onClick={handleDialogClose} className="close-button">
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

};

export default GameOverScreen;
