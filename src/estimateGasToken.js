const { Web3 } = require('web3');
const { axios } = require('axios');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Initialize Web3 provider
const web3 = new Web3(process.env.LINEA_RPC_URL);

// Function to estimate gas using linea_estimateGas with fallback to eth_estimateGas
async function estimateGasWithFallback(transaction) {
    try {
        const response = await axios.post(process.env.LINEA_RPC_URL, {
            jsonrpc: "2.0",
            method: "linea_estimateGas",
            params: [transaction],
            id: 1,
        });

        if (response.data.result) {
            console.log(`ETH transfer estimated gas (via linea_estimateGas) -> ${response.data.result} wei`);
            return response.data.result;
        } else {
            throw new Error("linea_estimateGas failed, falling back to eth_estimateGas.");
        }
    } catch (error) {
        const fallbackGasEstimate = await web3.eth.estimateGas(transaction);
        console.log(`ETH transfer estimated gas (via eth_estimateGas fallback) -> ${fallbackGasEstimate} wei`);
        return fallbackGasEstimate;
    }
}

// Defining the token transaction and gas estimation logic
async function estimateGasToken() {
    const transaction = {
        to: process.env.ETH_RECIPIENT,
        value: web3.utils.toWei('0.1', 'ether'),
        gasLimit: 21000,
    };

    try {
        await estimateGasWithFallback(transaction);
    } catch (error) {
        console.error("Error estimating gas for token:", error);
    }
}

module.exports = estimateGasToken;
