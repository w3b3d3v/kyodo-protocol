require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();
require("hardhat-jest-plugin");
require("hardhat-gas-reporter");
require('hardhat-contract-sizer');
require('dotenv').config({ path: '../../.env' });
const { mnemonicToSeedSync } = require("bip39");
const { HDNode } = require("@ethersproject/hdnode");

const seed = mnemonicToSeedSync(process.env.MNEMONIC);
const masterNode = HDNode.fromSeed(seed);
const account = masterNode.derivePath("m/44'/60'/0'/0/5");  // The last number is the index. 9 gives us the 5th address.
console.log("pvt address: " + account.privateKey);
console.log("public address: " + account.address);

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
      url: "http://127.0.0.1:8545/"
    },
    scrollTestnet: {
      url: "https://sepolia-rpc.scroll.io" || "",
      accounts: [account.privateKey]
      // accounts:
      //   process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mumbai: {
      url: "https://rpc.ankr.com/polygon_mumbai" || "",
      accounts: [account.privateKey]
      // accounts:
      //   process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    goerli: {
      url: "https://rpc.ankr.com/eth_goerli" || "",
      accounts: [account.privateKey]
      //   process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    bnbTesnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545" || "",
      accounts: [account.privateKey]
      //   process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    fantomTesnet: {
      url: "https://rpc.testnet.fantom.network" || "",
      accounts: [account.privateKey]
      //   process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    gnosisChiado: {
      url: "https://rpc.chiado.gnosis.gateway.fm" || "",
      accounts: [account.privateKey]
      //   process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    neonDevnet: {
      url: "https://devnet.neonevm.org" || "",
      accounts: [account.privateKey]
      //   process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    CoreDaoTestnet: {
      url: "https://rpc.test.btcs.network" || "",
      accounts: [account.privateKey]
      //   process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    polygonZkEvmTestnet: {
      url: "https://rpc.public.zkevm-test.net" || "",
      accounts: [account.privateKey]
      //   process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    }
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