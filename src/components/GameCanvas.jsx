/* GameCanvas.jsx */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import {
    initializeGame,
    moveLeft,
    moveRight,
    moveUp,
    moveDown,
    checkCollision,
    generateBirds,
    generateParachutes,
    generateStars,
    updateGameState,
} from '../utils/gameLogic';

const GameCanvas = ({ onGameOver }) => {
    const canvasRef = useRef(null);
    const gameRef = useRef(null); // Reference to the game state
    const [started, setStarted] = useState(false); // Tracks if the game has started
    const [paused, setPaused] = useState(false); // Tracks if the game is paused
    const animationFrameId = useRef(null); // Stores the ID for requestAnimationFrame
    const fuelIntervalId = useRef(null); // Stores the ID for fuel decrease interval
    const [imagesLoaded, setImagesLoaded] = useState(false); // Tracks if images are loaded

    // Image sources
    const imageSources = {
        aircraft: '/images/aircraft.png',
        bird: '/images/bird.png',
        parachute: '/images/parachute.png',
        star: '/images/star.png',
        cloud: '/images/cloud.png',
    };

    const images = useRef({}); // Stores loaded images

    // Preload images function
    const preloadImages = () => {
        const imagePromises = Object.keys(imageSources).map((key) => {
            const img = new Image();
            img.src = imageSources[key];
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    images.current[key] = img;
                    resolve();
                };
                img.onerror = () => {
                    console.error(`Failed to load image: ${imageSources[key]}`);
                    reject(`Failed to load image: ${imageSources[key]}`);
                };
            });
        });

        Promise.all(imagePromises)
            .then(() => setImagesLoaded(true))
            .catch((error) => console.error('Error loading images:', error));
    };

    // Load images on component mount
    useEffect(() => {
        preloadImages();
    }, []);

    // Handle keydown events for aircraft movement and pause
    const handleKeyDown = (e) => {
        if (!started || paused || !gameRef.current) return;

        switch (e.key) {
            case 'ArrowLeft':
                moveLeft(gameRef.current);
                break;
            case 'ArrowRight':
                moveRight(gameRef.current);
                break;
            case 'ArrowUp':
                moveUp(gameRef.current);
                break;
            case 'ArrowDown':
                moveDown(gameRef.current);
                break;
            case ' ':
                togglePause();
                break;
            default:
                break;
        }
    };

    // Add event listener for keydown when game starts
    useEffect(() => {
        if (started) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [started, paused]);

    // Toggle pause state
    const togglePause = () => {
        setPaused((prev) => !prev);
    };

    // End the game
    const endGame = () => {
        setStarted(false);
        setPaused(false);
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
        if (fuelIntervalId.current) {
            clearInterval(fuelIntervalId.current);
        }
        onGameOver({
            name: '',
            time: gameRef.current.time,
            stars: gameRef.current.starsCollected,
        });
    };

    // Start the game loop using requestAnimationFrame
    const startGameLoop = () => {
        const loop = () => {
            if (!paused && gameRef.current) {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw game elements
                const { aircraft, birds, parachutes, stars, clouds } = gameRef.current;

                if (aircraft.image) {
                    ctx.drawImage(
                        aircraft.image,
                        aircraft.x,
                        aircraft.y,
                        aircraft.width,
                        aircraft.height
                    );
                }

                birds.forEach((bird) => {
                    if (bird.image) {
                        ctx.drawImage(bird.image, bird.x, bird.y, bird.width, bird.height);
                    }
                });

                parachutes.forEach((parachute) => {
                    if (parachute.image) {
                        ctx.drawImage(parachute.image, parachute.x, parachute.y, parachute.width, parachute.height);
                    }
                });

                stars.forEach((star) => {
                    if (star.image) {
                        ctx.drawImage(star.image, star.x, star.y, star.width, star.height);
                    }
                });

                clouds.forEach((cloud) => {
                    if (cloud.image) {
                        ctx.drawImage(cloud.image, cloud.x, cloud.y, cloud.width, cloud.height);
                    }
                });

                // Draw UI Elements
                ctx.fillStyle = 'white';
                ctx.font = '20px Arial';
                ctx.fillText(`Fuel: ${gameRef.current.fuel}`, 10, 30);
                ctx.fillText(`Time: ${gameRef.current.time}`, 10, 60);
                ctx.fillText(`Stars: ${gameRef.current.starsCollected}`, 10, 90);

                // Update game state
                updateGameState(gameRef.current);

                // Move clouds to simulate movement
                gameRef.current.clouds.forEach((cloud) => {
                    cloud.x -= cloud.speed;
                    if (cloud.x + cloud.width < 0) {
                        cloud.x = canvas.width;
                        cloud.y = Math.random() * (canvas.height / 2); // Random Y position for clouds
                    }
                });

                // Generate new game elements randomly
                if (Math.random() < 0.02) generateBirds(gameRef.current); // 2% chance each frame
                if (Math.random() < 0.01) generateParachutes(gameRef.current); // 1% chance each frame
                if (Math.random() < 0.01) generateStars(gameRef.current); // 1% chance each frame

                // Check for collisions with birds
                if (checkCollision(gameRef.current)) {
                    endGame();
                    return; // Stop the loop after game ends
                }
            }

            // Continue the loop
            animationFrameId.current = requestAnimationFrame(loop);
        };

        // Start the loop
        animationFrameId.current = requestAnimationFrame(loop);
    };

    // Start the fuel and timer interval
    const startFuelTimer = () => {
        fuelIntervalId.current = setInterval(() => {
            if (!paused && gameRef.current) {
                gameRef.current.fuel = Math.max(0, gameRef.current.fuel - 1); // Decrease fuel by 1
                gameRef.current.time += 1; // Increase time by 1 second

                if (gameRef.current.fuel === 0) {
                    endGame();
                }
            }
        }, 1000); // Every second
    };

    // Start the game when "Start Game" button is clicked
    const startGame = () => {
        if (!imagesLoaded) {
            console.error('Images not loaded yet');
            return;
        }
        const canvas = canvasRef.current;
        if (canvas) {
            const initialGame = initializeGame(canvas.width, canvas.height, images.current);
            gameRef.current = initialGame;

            // Initialize clouds for movement
            for (let i = 0; i < 5; i++) {
                gameRef.current.clouds.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * (canvas.height / 2),
                    width: 100,
                    height: 60,
                    speed: 0.5 + Math.random() * 1, // Cloud speed between 0.5 - 1.5
                    image: images.current.cloud,
                });
            }

            setStarted(true);
            startGameLoop();
            startFuelTimer();
        }
    };

    // Render the component
    return (
        <div
            className="game-canvas-container"
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#87CEEB', // Sky blue background
            }}
        >
            {/* Start Screen */}
            {!started && imagesLoaded && (
                <div
                    className="start-screen"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1,
                    }}
                >
                    <button
                        onClick={startGame}
                        style={{
                            padding: '10px 20px',
                            fontSize: '20px',
                            cursor: 'pointer',
                        }}
                    >
                        Start Game
                    </button>
                </div>
            )}

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                width={1024}
                height={768}
                style={{
                    backgroundColor: '#87CEEB', // Sky blue background
                    border: '2px solid #000', // Optional: border for visibility
                }}
            />

            {/* Pause/Resume Button */}
            {started && (
                <button
                    onClick={togglePause}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        zIndex: 1,
                    }}
                >
                    {paused ? 'Resume' : 'Pause'}
                </button>
            )}
        </div>
    );
};

export default GameCanvas;
