const estimateGasToken = require('./estimateGasToken.js');
const estimateGasCustom = require('./estimateGasCustom.js');

// Define an async function to manage gas estimation for both token transfers and custom transactions
async function run() {
    try {
        console.log("-------------Estimating gas for ETH transfer------------- \n");
        await estimateGasToken();
        console.log("\n-------------Estimating gas for transactions on the Inheritance contract------------- \n",);
        await estimateGasCustom();
    } catch (err) {
        console.error("Error occurred:", err);
    }
}

// Running the main function
run();
