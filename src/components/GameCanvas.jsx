/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import { initializeGame, moveLeft, moveRight, moveUp, moveDown, checkCollision, generateBirds, generateParachutes, generateStars, updateGameState } from '../utils/gameLogic';

const GameCanvas = ({ onGameOver }) => {
    const canvasRef = useRef(null);
    const [game, setGame] = useState(null);
    const [paused, setPaused] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [animationFrameId, setAnimationFrameId] = useState(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const imageSources = {
        aircraft: '/images/aircraft.png',
        bird: '/images/bird.png',
        parachute: '/images/parachute.png',
        cloud: '/images/cloud.png',
        star: '/images/star.png',
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
                img.onerror = reject;
            });
        });

        Promise.all(imagePromises)
            .then(() => {
                setImagesLoaded(true);
            })
            .catch((error) => {
                console.error('Error loading images:', error);
            });
    };

    useEffect(() => {
        preloadImages();
    }, []);

    useEffect(() => {
        if (!game) return;

        window.addEventListener('keydown', handleKeyDown);

        const loop = () => {
            if (!paused && game) {
                if (canvasRef.current) {
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Drawing the game elements (aircraft, birds, parachutes, etc.)
                    if (game.aircraft && game.aircraft.image) {
                        ctx.drawImage(game.aircraft.image, game.aircraft.x, game.aircraft.y, game.aircraft.width, game.aircraft.height);
                    }

                    game.birds.forEach((bird) => {
                        if (bird.image) {
                            ctx.drawImage(bird.image, bird.x, bird.y, bird.width, bird.height);
                        }
                    });

                    game.parachutes.forEach((parachute) => {
                        if (parachute.image) {
                            ctx.drawImage(parachute.image, parachute.x, parachute.y, parachute.width, parachute.height);
                        }
                    });

                    game.stars.forEach((star) => {
                        if (star.image) {
                            ctx.drawImage(star.image, star.x, star.y, star.width, star.height);
                        }
                    });

                    game.clouds.forEach((cloud) => {
                        if (cloud.image) {
                            ctx.drawImage(cloud.image, cloud.x, cloud.y, cloud.width, cloud.height);
                        }
                    });

                    // Draw UI elements (Fuel, Time, Stars)
                    ctx.fillStyle = 'white';
                    ctx.font = '20px Arial';
                    ctx.fillText(`Fuel: ${game.fuel}`, 10, 30);
                    ctx.fillText(`Time: ${game.time}`, 10, 60);
                    ctx.fillText(`Stars: ${game.starsCollected}`, 10, 90);
                }
            }

            // Update game state every frame
            updateGameState(game, setGame);

            // Check for collision after updating the game state
            if (checkCollision(game)) {
                endGame();
            }

            // Periodically generate new game elements (birds, parachutes, stars)
            if (Math.random() < 0.02) generateBirds(game);
            if (Math.random() < 0.01) generateParachutes(game);
            if (Math.random() < 0.01) generateStars(game);

            const raf = requestAnimationFrame(loop);
            setAnimationFrameId(raf);
        };

        loop();

        const fuelTimer = setInterval(() => {
            if (!paused && game) {
                if (game.fuel > 0) {
                    game.fuel -= 1;
                    setGame({ ...game });
                } else {
                    game.fuel = 0;
                    if (!game.collision) game.collision = true;
                }
                if (game.fuel <= 0) {
                    endGame();
                }
            }
        }, 1000);
        setIntervalId(fuelTimer);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearInterval(fuelTimer);
            cancelAnimationFrame(animationFrameId);
        };
    }, [game, paused]);



    useEffect(() => {
        if (imagesLoaded) {
            const canvas = canvasRef.current;
            if (canvas) {
                const initialGame = initializeGame(canvas.width, canvas.height, images.current);
                setGame(initialGame);
            }
        }
    }, [imagesLoaded]);

    const handleKeyDown = (e) => {
        e.preventDefault();
        if (paused || !game) return;

        switch (e.key) {
            case 'ArrowLeft':
                moveLeft(game, setGame);
                break;
            case 'ArrowRight':
                moveRight(game, setGame);
                break;
            case 'ArrowUp':
                moveUp(game, setGame);
                break;
            case 'ArrowDown':
                moveDown(game, setGame);
                break;
            case ' ':
                togglePause();
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (!game) return;

        window.addEventListener('keydown', handleKeyDown);

        const loop = () => {
            if (!paused && game) {
                if (canvasRef.current) {
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Drawing the game elements (aircraft, birds, parachutes, etc.)
                    if (game.aircraft && game.aircraft.image) {
                        ctx.drawImage(game.aircraft.image, game.aircraft.x, game.aircraft.y, game.aircraft.width, game.aircraft.height);
                    }

                    game.birds.forEach((bird) => {
                        if (bird.image) {
                            ctx.drawImage(bird.image, bird.x, bird.y, bird.width, bird.height);
                        }
                    });

                    game.parachutes.forEach((parachute) => {
                        if (parachute.image) {
                            ctx.drawImage(parachute.image, parachute.x, parachute.y, parachute.width, parachute.height);
                        }
                    });

                    game.stars.forEach((star) => {
                        if (star.image) {
                            ctx.drawImage(star.image, star.x, star.y, star.width, star.height);
                        }
                    });

                    game.clouds.forEach((cloud) => {
                        if (cloud.image) {
                            ctx.drawImage(cloud.image, cloud.x, cloud.y, cloud.width, cloud.height);
                        }
                    });

                    // Draw UI elements (Fuel, Time, Stars)
                    ctx.fillStyle = 'white';
                    ctx.font = '20px Arial';
                    ctx.fillText(`Fuel: ${game.fuel}`, 10, 30);
                    ctx.fillText(`Time: ${game.time}`, 10, 60);
                    ctx.fillText(`Stars: ${game.starsCollected}`, 10, 90);
                }
            }
            const raf = requestAnimationFrame(loop);
            setAnimationFrameId(raf);
        };

        loop();

        const fuelTimer = setInterval(() => {
            if (!paused && game) {
                if (game.fuel > 0) {
                    game.fuel -= 1;
                    setGame({ ...game });
                } else {
                    game.fuel = 0;
                    if (!game.collision) game.collision = true;
                }
                if (game.fuel <= 0) {
                    endGame();
                }
            }
        }, 1000);
        setIntervalId(fuelTimer);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearInterval(fuelTimer);
            cancelAnimationFrame(animationFrameId);
        };
    }, [game, paused]);

    const togglePause = () => {
        setPaused(!paused);
    };

    const endGame = () => {
        clearInterval(intervalId);
        cancelAnimationFrame(animationFrameId);
        onGameOver({
            name: '',
            time: game.time,
            stars: game.starsCollected,
        });
    };

    return (
        <div className="game-canvas-container">
            <canvas ref={canvasRef} width={1024} height={768} />
            <button className="pause-button" onClick={togglePause}>
                {paused ? 'Resume' : 'Pause'}
            </button>
        </div>
    );
};

export default GameCanvas;
