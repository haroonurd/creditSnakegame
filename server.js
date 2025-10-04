const express = require('express');
const cors = require('cors');
const Web3 = require('web3');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Web3 configuration
const web3 = new Web3(process.env.INFURA_URL || 'http://localhost:8545');
const contractABI = []; // Your contract ABI here
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Routes
app.post('/api/play', async (req, res) => {
    try {
        const { playerAddress, score, signature } = req.body;
        
        // Verify signature
        const message = web3.utils.soliditySha3(
            {type: 'address', value: playerAddress},
            {type: 'uint256', value: score}
        );
        const recovered = web3.eth.accounts.recover(message, signature);
        
        if (recovered.toLowerCase() !== playerAddress.toLowerCase()) {
            return res.status(401).json({ error: 'Invalid signature' });
        }
        
        // Call smart contract
        const tx = contract.methods.playGame(score);
        const gas = await tx.estimateGas({ from: playerAddress });
        
        res.json({
            success: true,
            gasEstimate: gas
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/leaderboard', async (req, res) => {
    try {
        // Implement leaderboard logic
        res.json({ leaderboard: [] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
