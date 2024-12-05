/* gameLogic.js */

// Initialize the game state
export const initializeGame = (width, height, images) => {
    return {
        aircraft: {
            x: width / 2 - 25, // Center the aircraft horizontally
            y: height / 2 - 25, // Center the aircraft vertically
            width: 50,
            height: 50,
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
        width,
        height,
        images,
    };
};

// Aircraft movement functions
export const moveLeft = (game) => {
    if (game.aircraft.x > 0) {
        game.aircraft.x -= game.aircraft.speed;
    }
};

export const moveRight = (game) => {
    if (game.aircraft.x + game.aircraft.width < game.width) {
        game.aircraft.x += game.aircraft.speed;
    }
};

export const moveUp = (game) => {
    if (game.aircraft.y > 0) {
        game.aircraft.y -= game.aircraft.speed;
    }
};

export const moveDown = (game) => {
    if (game.aircraft.y + game.aircraft.height < game.height) {
        game.aircraft.y += game.aircraft.speed;
    }
};

// Collision detection between aircraft and birds
export const checkCollision = (game) => {
    const aircraft = game.aircraft;

    for (let bird of game.birds) {
        if (
            aircraft.x < bird.x + bird.width &&
            aircraft.x + aircraft.width > bird.x &&
            aircraft.y < bird.y + bird.height &&
            aircraft.y + aircraft.height > bird.y
        ) {
            return true;
        }
    }

    return false; // No collision
};

// Generate a new bird flying from right to left
export const generateBirds = (game) => {
    const birdWidth = 35;
    const birdHeight = 35;
    const bird = {
        x: game.width, // Start at the right edge
        y: Math.random() * (game.height - birdHeight), // Random vertical position
        width: birdWidth,
        height: birdHeight,
        speed: 2 + Math.random() * 2, // Random speed between 2-4
        image: game.images.bird,
    };
    game.birds.push(bird);
};

// Generate a new parachute falling from the top
export const generateParachutes = (game) => {
    const parachuteWidth = 40;
    const parachuteHeight = 40;
    const parachute = {
        x: Math.random() * (game.width - parachuteWidth), // Random horizontal position
        y: 0, // Start at the top
        width: parachuteWidth,
        height: parachuteHeight,
        speed: 2 + Math.random() * 2, // Random speed between 2-4
        image: game.images.parachute,
    };
    game.parachutes.push(parachute);
};

// Generate a new star falling from the top
export const generateStars = (game) => {
    const starWidth = 30;
    const starHeight = 30;
    const star = {
        x: Math.random() * (game.width - starWidth), // Random horizontal position
        y: 0, // Start at the top
        width: starWidth,
        height: starHeight,
        speed: 1 + Math.random() * 2, // Random speed between 1-3
        image: game.images.star,
    };
    game.stars.push(star);
};

// Update the game state: move objects, handle collections
export const updateGameState = (game) => {
    // Move birds
    game.birds = game.birds.filter((bird) => {
        bird.x -= bird.speed;
        return bird.x + bird.width > 0; // Keep birds that are still on screen
    });

    // Move parachutes and handle collection
    game.parachutes = game.parachutes.filter((parachute) => {
        parachute.y += parachute.speed;

        // Check collision with aircraft
        if (
            parachute.x < game.aircraft.x + game.aircraft.width &&
            parachute.x + parachute.width > game.aircraft.x &&
            parachute.y < game.aircraft.y + game.aircraft.height &&
            parachute.y + parachute.height > game.aircraft.y
        ) {
            game.fuel += 10;
            return false;
        }

        return parachute.y < game.height;
    });


    game.stars = game.stars.filter((star) => {
        star.y += star.speed;

        // Check collision with aircraft
        if (
            star.x < game.aircraft.x + game.aircraft.width &&
            star.x + star.width > game.aircraft.x &&
            star.y < game.aircraft.y + game.aircraft.height &&
            star.y + star.height > game.aircraft.y
        ) {
            game.starsCollected += 1;
            return false;
        }

        return star.y < game.height;
    });

    // NOTE:::: Clouds are handled in GameCanvas.jsx for movement and rendering
};
