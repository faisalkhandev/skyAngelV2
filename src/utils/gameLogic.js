// Initialize the game state
export const initializeGame = (width, height, images) => {
    return {
        aircraft: {
            x: width / 2 - 50, // Center the aircraft initially
            y: height / 2 - 50,
            width: 100,
            height: 100,
            speed: 5,
            image: images.aircraft,
        },
        birds: [],
        parachutes: [],
        stars: [],
        clouds: [],
        fuel: 10,
        time: 0,
        starsCollected: 0,
        collision: false,
    };
};

// Move aircraft left
export const moveLeft = (game, setGame) => {
    if (game.aircraft.x > 0) {
        game.aircraft.x -= game.aircraft.speed;
        setGame({ ...game });
    }
};

// Move aircraft right
export const moveRight = (game, setGame) => {
    if (game.aircraft.x + game.aircraft.width < game.width) {
        game.aircraft.x += game.aircraft.speed;
        setGame({ ...game });
    }
};

// Move aircraft up
export const moveUp = (game, setGame) => {
    if (game.aircraft.y > 0) {
        game.aircraft.y -= game.aircraft.speed;
        setGame({ ...game });
    }
};

// Move aircraft down
export const moveDown = (game, setGame) => {
    if (game.aircraft.y + game.aircraft.height < game.height) {
        game.aircraft.y += game.aircraft.speed;
        setGame({ ...game });
    }
};

// Check if the aircraft collides with birds
export const checkCollision = (game) => {
    const aircraft = game.aircraft;

    // Check if any bird intersects the aircraft
    for (let i = 0; i < game.birds.length; i++) {
        const bird = game.birds[i];
        if (
            aircraft.x < bird.x + bird.width &&
            aircraft.x + aircraft.width > bird.x &&
            aircraft.y < bird.y + bird.height &&
            aircraft.y + aircraft.height > bird.y
        ) {
            game.collision = true;
            break;
        }
    }

    return game.collision;
};

// Generate birds (flying from right to left)
export const generateBirds = (game) => {
    const birdWidth = 50;
    const birdHeight = 50;
    const randomY = Math.random() * (game.height - birdHeight);
    const bird = {
        x: game.width,
        y: randomY,
        width: birdWidth,
        height: birdHeight,
        speed: Math.random() * 2 + 2, // Random speed for the birds
        image: game.images.bird,
    };

    game.birds.push(bird);
};

// Generate parachutes (falling from top to bottom)
export const generateParachutes = (game) => {
    const parachuteWidth = 50;
    const parachuteHeight = 50;
    const randomX = Math.random() * (game.width - parachuteWidth);
    const parachute = {
        x: randomX,
        y: 0, // Start from the top
        width: parachuteWidth,
        height: parachuteHeight,
        speed: 2, // Speed of falling parachutes
        image: game.images.parachute,
    };

    game.parachutes.push(parachute);
};

// Generate stars (falling from top to bottom)
export const generateStars = (game) => {
    const starWidth = 30;
    const starHeight = 30;
    const randomX = Math.random() * (game.width - starWidth);
    const star = {
        x: randomX,
        y: 0, // Start from the top
        width: starWidth,
        height: starHeight,
        speed: 1, // Speed of falling stars
        image: game.images.star,
    };

    game.stars.push(star);
};

// Update game state (move objects, check collisions, etc.)
export const updateGameState = (game, setGame) => {
    // Move birds and check if they are off-screen
    game.birds.forEach((bird, index) => {
        bird.x -= bird.speed;
        if (bird.x + bird.width < 0) {
            game.birds.splice(index, 1);
        }
    });

    // Move parachutes and check if they are off-screen
    game.parachutes.forEach((parachute, index) => {
        parachute.y += parachute.speed;
        if (parachute.y > game.height) {
            game.parachutes.splice(index, 1);
        }
    });

    // Move stars and check if they are off-screen
    game.stars.forEach((star, index) => {
        star.y += star.speed;
        if (star.y > game.height) {
            game.stars.splice(index, 1);
        }
    });

    // Check for collision
    const collision = checkCollision(game);
    if (collision) {
        game.fuel = 0; // End the game if there is a collision
        game.collision = true;
    }

    // Update game state
    setGame({ ...game });
};
