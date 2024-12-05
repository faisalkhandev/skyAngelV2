

// eslint-disable-next-line react/prop-types
const StartScreen = ({ onStartGame }) => {
    return (
        <div className="start-screen">
            <h1>Sky Angel</h1>
            <button onClick={onStartGame}>Start Game</button>
        </div>
    );
};

export default StartScreen;
