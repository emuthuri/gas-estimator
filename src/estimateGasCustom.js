const { Web3 } = require('web3');
const { axios } = require('axios');
const SingleHeirABI = require('../abis/SingleHeirInheritance.json');
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
            params: [{
                from: transaction.from,
                to: transaction.to,
                data: transaction.data,
                gasLimit: transaction.gasLimit || web3.utils.toHex(21000),
                gasPrice: transaction.gasPrice || web3.utils.toHex(await web3.eth.getGasPrice()),
                value: transaction.value || '0x0'
            }],
            id: 1,
        });

        if (response.data.result) {
            return response.data.result;
        } else {
            throw new Error("Falling back to eth_estimateGas.");
        }
    } catch (error) {
        const fallbackGasEstimate = await web3.eth.estimateGas(transaction);
        console.log(`linea_estimateGas failed. Using estimateGas as fallback...`);
        return fallbackGasEstimate;
    }
}

// Custom transaction logic
async function estimateGasCustom() {
    const contractAddress = process.env.INHERITANCE_CONTRACT_ADDRESS;
    const contract = new web3.eth.Contract(SingleHeirABI, contractAddress);

    try {
        const gasEstimateTakeControl = await estimateGasWithFallback({
            from: process.env.CURRENT_HEIR,
            to: contractAddress,
            data: contract.methods.takeControlAndChangeHeir(process.env.NEW_HEIR).encodeABI()
        });

        console.log(`Estimated gas to take control and change heir: ${gasEstimateTakeControl} wei`);

        const gasEstimateWithdraw = await estimateGasWithFallback({
            from: process.env.CURRENT_OWNER,
            to: contractAddress,
            data: contract.methods.withdraw(web3.utils.toWei('0', 'ether')).encodeABI()
        });

        console.log(`Estimated gas for withdraw ETH from Inheritance contract: ${gasEstimateWithdraw} wei`);
    } catch (error) {
        console.error("Error estimating gas for withdrawing ETH from Inheritance contract:", error);
    }
}

module.exports = estimateGasCustom;
