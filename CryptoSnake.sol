// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract CryptoSnake {
    address public owner;
    IERC20 public usdtToken;
    
    uint256 public entryFee = 1 * 10**6; // 1 USDT (6 decimals)
    uint256 public rewardMultiplier = 2;
    
    mapping(address => uint256) public playerScores;
    mapping(address => uint256) public lastPlayed;
    
    event GamePlayed(address player, uint256 score, uint256 reward);
    event Withdrawal(address owner, uint256 amount);
    
    constructor(address _usdtAddress) {
        owner = msg.sender;
        usdtToken = IERC20(_usdtAddress);
    }
    
    function playGame(uint256 score) external {
        require(score > 0, "Score must be positive");
        require(usdtToken.transferFrom(msg.sender, address(this), entryFee), "Payment failed");
        
        if (score > playerScores[msg.sender]) {
            playerScores[msg.sender] = score;
        }
        
        lastPlayed[msg.sender] = block.timestamp;
        
        // Calculate reward (example: 2x for scores above 50)
        uint256 reward = 0;
        if (score >= 50) {
            reward = entryFee * rewardMultiplier;
            usdtToken.transfer(msg.sender, reward);
        }
        
        emit GamePlayed(msg.sender, score, reward);
    }
    
    function withdrawFunds() external {
        require(msg.sender == owner, "Only owner can withdraw");
        uint256 balance = usdtToken.balanceOf(address(this));
        usdtToken.transfer(owner, balance);
        emit Withdrawal(owner, balance);
    }
    
    function setEntryFee(uint256 newFee) external {
        require(msg.sender == owner, "Only owner can set fee");
        entryFee = newFee;
    }
}
