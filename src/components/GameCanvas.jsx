/* eslint-disable react/prop-types */
/* GameCanvas.jsx */
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
    const gameRef = useRef(null);
    const [started, setStarted] = useState(false);
    const [paused, setPaused] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const animationFrameId = useRef(null);
    const fuelIntervalId = useRef(null);

    const imageSources = {
        aircraft: '/images/aircraft.png',
        bird: '/images/bird.png',
        parachute: '/images/parachute.png',
        star: '/images/star.png',
        cloud: '/images/cloud.png',
    };

    const images = useRef({});

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

    useEffect(() => {
        preloadImages();
    }, []);

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

    useEffect(() => {
        if (started) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [started, paused]);

    const togglePause = () => {
        setPaused((prev) => !prev);
    };

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

    const startGameLoop = () => {
        const loop = () => {
            if (!paused && gameRef.current) {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const { aircraft, birds, parachutes, stars, clouds } = gameRef.current;

                if (aircraft.image) {
                    ctx.drawImage(aircraft.image, aircraft.x, aircraft.y, aircraft.width, aircraft.height);
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

                ctx.fillStyle = 'white';
                ctx.font = '20px Arial';
                ctx.fillText(`Fuel: ${gameRef.current.fuel}`, 15, 50);
                ctx.fillText(`Time: ${gameRef.current.time}`, 15, 80);
                ctx.fillText(`Stars: ${gameRef.current.starsCollected}`, 15, 110);

                updateGameState(gameRef.current);

                gameRef.current.clouds.forEach((cloud) => {
                    cloud.x -= cloud.speed;
                    if (cloud.x + cloud.width < 0) {
                        cloud.x = canvas.width;
                        cloud.y = Math.random() * (canvas.height / 2);
                    }
                });

                if (Math.random() < 0.02) generateBirds(gameRef.current);
                if (Math.random() < 0.01) generateParachutes(gameRef.current);
                if (Math.random() < 0.01) generateStars(gameRef.current);

                if (checkCollision(gameRef.current)) {
                    endGame();
                    return;
                }
            }

            animationFrameId.current = requestAnimationFrame(loop);
        };

        animationFrameId.current = requestAnimationFrame(loop);
    };

    const startFuelTimer = () => {
        fuelIntervalId.current = setInterval(() => {
            if (!paused && gameRef.current) {
                gameRef.current.fuel = Math.max(0, gameRef.current.fuel - 1);
                gameRef.current.time += 1;

                if (gameRef.current.fuel === 0) {
                    endGame();
                }
            }
        }, 1000);
    };

    const startGame = () => {
        if (!imagesLoaded) {
            console.error('Images not loaded yet');
            return;
        }
        const canvas = canvasRef.current;
        if (canvas) {
            const initialGame = initializeGame(canvas.width, canvas.height, images.current);
            gameRef.current = initialGame;

            for (let i = 0; i < 5; i++) {
                gameRef.current.clouds.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * (canvas.height / 2),
                    width: 100,
                    height: 60,
                    speed: 0.5 + Math.random() * 1,
                    image: images.current.cloud,
                });
            }

            setStarted(true);
            startGameLoop();
            startFuelTimer();
        }
    };

    return (
        <div className="game-canvas-container">
            {!started && (
                <div className="start-screen">
                    <h1>Airplane Adventure</h1>
                    <button className="start-button" onClick={startGame}>
                        Start Game
                    </button>
                </div>
            )}
            <canvas ref={canvasRef} className="game-canvas" width="1024" height="768" />
            {started && (
                <button className="pause-button" onClick={togglePause}>
                    {paused ? 'Resume' : 'Pause'}
                </button>
            )}
        </div>
    );
};

export default GameCanvas;
