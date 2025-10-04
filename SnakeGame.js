import React, { useState, useEffect, useCallback } from 'react';
import '../styles/SnakeGame.css';

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = 'RIGHT';

const SnakeGame = ({ account, onScoreUpdate }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(generateFood());
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function generateFood() {
    return {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE)
    };
  }

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      
      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];
      
      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
        const newScore = score + 10;
        setScore(newScore);
        onScoreUpdate(newScore);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, score, onScoreUpdate]);

  const handleKeyPress = useCallback((e) => {
    if (!isPlaying) return;
    
    switch (e.key) {
      case 'ArrowUp': setDirection(prev => prev !== 'DOWN' ? 'UP' : prev); break;
      case 'ArrowDown': setDirection(prev => prev !== 'UP' ? 'DOWN' : prev); break;
      case 'ArrowLeft': setDirection(prev => prev !== 'RIGHT' ? 'LEFT' : prev); break;
      case 'ArrowRight': setDirection(prev => prev !== 'LEFT' ? 'RIGHT' : prev); break;
    }
  }, [isPlaying]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  const submitScore = async () => {
    try {
      // Implement score submission to blockchain
      console.log('Submitting score:', score);
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      const gameInterval = setInterval(moveSnake, 200);
      return () => clearInterval(gameInterval);
    }
  }, [isPlaying, gameOver, moveSnake]);

  return (
    <div className="snake-game">
      <div className="game-info">
        <div className="score">Score: {score}</div>
        <div className="account">Player: {account?.slice(0, 8)}...</div>
      </div>

      <div className="game-board">
        {Array(BOARD_SIZE).fill().map((_, y) => (
          <div key={y} className="board-row">
            {Array(BOARD_SIZE).fill().map((_, x) => {
              const isSnake = snake.some(segment => segment.x === x && segment.y === y);
              const isFood = food.x === x && food.y === y;
              
              return (
                <div
                  key={`${x}-${y}`}
                  className={`board-cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="game-controls">
        {!isPlaying ? (
          <button onClick={startGame} className="play-button">
            Start Game (1 USDT)
          </button>
        ) : gameOver ? (
          <div className="game-over">
            <h3>Game Over! Final Score: {score}</h3>
            <button onClick={submitScore} className="submit-button">
              Submit Score to Blockchain
            </button>
            <button onClick={startGame} className="play-again">
              Play Again
            </button>
          </div>
        ) : (
          <div className="game-instructions">
            <p>Use arrow keys to control the snake</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
