# Gas Estimation Script for Linea & Ethereum

This project provides a Node.js-based solution to estimate gas costs for Ethereum and Linea networks using the `linea_estimateGas` method with a fallback to `eth_estimateGas` in case of failure. It supports both simple ETH token transfers and more complex custom contract transactions, specifically for a Single Heir Inheritance smart contract.

The two main scripts, `estimateGasToken.js` and `estimateGasCustom.js`, handle simple token transfers and custom smart contract function executions respectively.
The `estimateGasWithFallback` function is used in both scripts to attempt using Linea's custom gas estimation API, and if it fails, it will default to Ethereum's gas estimation.

## Features

- Estimates gas for both ETH token transfers and contract methods.
- Utilizes the `linea_estimateGas` method for gas estimation with fallback to `eth_estimateGas`.
- Handles custom contract methods such as `takeControlAndChangeHeir` and `withdraw`.

## Dependencies

- `web3`: Used to interact with the Ethereum and Linea blockchain networks.
- `axios`: Helps make HTTP requests to the Linea JSON-RPC API for gas estimation.
- `dotenv`: Loads environment variables from `.env`.

## Project Structure

├── abis  
│&nbsp;&nbsp;&nbsp;&nbsp;└── SingleHeirInheritance.json # ABI file for the Single Heir contract  
├── src  
│&nbsp;&nbsp;&nbsp;&nbsp;├── main.js # Main script to manage gas estimation  
│&nbsp;&nbsp;&nbsp;&nbsp;├── estimateGasToken.js # Script to estimate gas for token transfers  
│&nbsp;&nbsp;&nbsp;&nbsp;└── estimateGasCustom.js # Script to estimate gas for contract methods  
├── .env # Environment variables  
├── README.md # Project documentation  
└── package.json # Project dependencies and metadata

## Setup Instructions

### Prerequisites

- **Node.js (v20.17.0)**
- **npm** (Node Package Manager)

### 1. Clone the Repository

```bash
git clone https://github.com/emuthuri/gas-estimator.git
cd gas-estimator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a `.env` file

Create a `.env` file in the root directory of your project. This file will contain your environment variables like `LINEA_RPC_URL`, `NEW_HEIR_ADDRESS`, and `PRIVATE_KEY`. Below is an example of what your `.env` file might look like:

```plaintext
LINEA_RPC_URL=https://linea-sepolia.infura.io/v3/yourApiKey
ETH_RECIPIENT=0xTheAddressToReciveETH
INHERITANCE_CONTRACT_ADDRESS=0xFA185da6dDAB54C52Da97eaa7671d106F09B8F64
CURRENT_OWNER=0x6888a8dd7DEFC00Ffb0385221F4e4019B7CD463a
CURRENT_HEIR=0x6888a8dd7DEFC00Ffb0385221F4e4019B7CD463a
NEW_HEIR=0xValidAddressOfYourChoice
```

### 4. Add ABI for Custom Contract

Ensure that the ABI for the SingleHeirInheritance contract is located in the abis/ folder as SingleHeirInheritance.json.

### 5. Run the Script

To estimate gas for both token transfers and custom contract methods, use:

```bash
node src/main.js
```
