require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();
require("hardhat-jest-plugin");
require("hardhat-gas-reporter");
require('hardhat-contract-sizer');
require('dotenv').config({ path: '../../.env.development.local' });

/** @type import('hardhat/config').HardhatUserConfig */

let config = {
  defaultNetwork: "testing",
  solidity: "0.8.1",
  settings: {
    optimizer: {
      enabled: false,
      runs: 200
    }
  },
  networks: {
    testing: {
      url: "http://127.0.0.1:8545/",
    },
    scroll: {
      url: "https://sepolia-rpc.scroll.io" || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  contractSizer: {
    alphaSort: false,
    disambiguatePaths: false,
    runOnCompile: false,
    strict: true,
  },
  gasReporter: {
    enabled: false,
  }
};

module.exports = config;