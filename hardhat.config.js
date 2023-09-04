require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();
require("hardhat-jest-plugin");
require("hardhat-gas-reporter");

const { WALLET_PRIVATE_KEY } = process.env;
const { POLYGONSCAN_API_KEY } = process.env;
const { TESTNET_ALCHEMY_URL } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "testing",
  solidity: "0.8.19",
  networks: {
    testing: {
      url: "http://127.0.0.1:8545/",
    },
    mumbai: {
      url: TESTNET_ALCHEMY_URL,
      accounts: [`0x${WALLET_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY,
  },
};