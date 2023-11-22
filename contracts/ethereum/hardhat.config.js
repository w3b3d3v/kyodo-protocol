require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require('dotenv').config();
require("hardhat-jest-plugin");
require("hardhat-gas-reporter");
require('hardhat-contract-sizer');
require('dotenv').config({ path: '../../.env' });
require('hardhat-deploy');
require('hardhat-deploy-ethers');

const MNEMONIC = process.env["MNEMONIC"];

/** @type import('hardhat/config').HardhatUserConfig */

let config = {
  solidity: "0.8.23",
  namedAccounts: {
    deployer: 0,
    kyodoTreasury: 0,
    communityTreasury: 3,
    user1: 5,
    user2: 6,
  },
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
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org',
      accounts: { mnemonic: MNEMONIC },
    },
    optimismGoerli: {
      url: process.env.OPTIMISM_GOERLI_RPC_URL || 'https://goerli.optimism.io',
      accounts: { mnemonic: MNEMONIC },
    },
    avalancheFuji: {
      url: process.env.AVALANCHE_FUJI_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts: { mnemonic: MNEMONIC },
    },
    arbitrumGoerli: {
      url: process.env.ARBITRUM_GOERLI_RPC_URL || 'https://goerli-rollup.arbitrum.io/rpc',
      accounts: { mnemonic: MNEMONIC },
    },
    polygonMumbai: {
      url: process.env.MUMBAI_RPC_URL || 'https://rpc.ankr.com/polygon_mumbai',
      accounts: { mnemonic: MNEMONIC },
    },
    bnbTesnet: {
      url: process.env.BNB_TESTNET_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545',
      accounts: { mnemonic: MNEMONIC },
    },
    baseGoerli: {
      url: process.env.BASE_GOERLI_RPC_URL || 'https://goerli.base.org',
      accounts: { mnemonic: MNEMONIC },
    },
    polygonZkEvmTestnet: {
      url: process.env.POLYGON_ZKEVM_TESTNET_RPC_URL || "https://rpc.public.zkevm-test.net",
      accounts: { mnemonic: MNEMONIC },
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL || "https://rpc.ankr.com/eth_goerli",
      accounts: { mnemonic: MNEMONIC },
    },
    scrollTestnet: {
      url: process.env.SCROLL_TESTNET_RPC_URL || "https://sepolia-rpc.scroll.io",
      accounts: { mnemonic: MNEMONIC },
    },
    fantomTestnet: {
      url: process.env.FANTOM_TESTNET_RPC_URL || "https://rpc.testnet.fantom.network",
      accounts: { mnemonic: MNEMONIC },
    },
    gnosisChiado: {
      url: process.env.GNOSIS_CHIADO_RPC_URL || "https://rpc.chiado.gnosis.gateway.fm",
      accounts: { mnemonic: MNEMONIC },
    },
    neonDevnet: {
      url: process.env.NEON_DEVNET_RPC_URL || "https://devnet.neonevm.org",
      accounts: { mnemonic: MNEMONIC },
    },
    coreDaoTestnet: {
      url: process.env.COREDAO_TESTNET_RPC_URL || "https://rpc.test.btcs.network",
      accounts: { mnemonic: MNEMONIC },
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