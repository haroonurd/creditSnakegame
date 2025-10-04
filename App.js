import React, { useState, useEffect } from 'react';
import SnakeGame from './components/SnakeGame';
import WalletConnect from './components/WalletConnect';
import './styles/App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [score, setScore] = useState(0);

  return (
    <div className="App">
      <header className="app-header">
        <h1>🚀 Crypto Snake Game</h1>
        <p>Play Snake, Earn USDT!</p>
      </header>
      
      <WalletConnect account={account} setAccount={setAccount} />
      
      {account ? (
        <div className="game-container">
          <SnakeGame 
            account={account} 
            onScoreUpdate={setScore}
          />
        </div>
      ) : (
        <div className="connect-wallet-prompt">
          <p>Please connect your wallet to play</p>
        </div>
      )}
    </div>
  );
}

export default App;
