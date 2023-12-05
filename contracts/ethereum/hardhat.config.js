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
    user1: 0,
    user2: 1,
    user3: 7,
    user4: 8,
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
      url: process.env.SEPOLIA_RPC_URL || 'https://rpc-sepolia.rockx.com',
      accounts: { mnemonic: MNEMONIC },
    },
    optimismGoerli: {
      url: process.env.OPTIMISM_GOERLI_RPC_URL || 'https://goerli.optimism.io',
      accounts: { mnemonic: MNEMONIC },
    },
    avalancheFuji: {
      url: process.env.AVALANCHE_FUJI_RPC_URL || 'https://rpc.ankr.com/avalanche_fuji',
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
    bnbTestnet: {
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
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      sepolia: process.env.VERIFY_APIKEY_SEPOLIA || "",
      optimismGoerli: process.env.VERIFY_APIKEY_OPTMINSM_GOERLI || "",
      avalancheFujiTestnet: process.env.VERIFY_APIKEY_AVALANCHE_FUJI || "",
      arbitrumGoerli: process.env.VERIFY_APIKEY_ARBITRUM_GOERLI || "",
      polygonMumbai: process.env.VERIFY_APIKEY_POLYGON_MUMBAI || "",
      bnbTesnet: process.env.VERIFY_APIKEY_BNB_TESTNET || "",
      baseGoerli: process.env.VERIFY_APIKEY_BASE_GOERLI || "",
      polygonZkEvmTestnet: process.env.VERIFY_POLYGON_ZK_TESTNET || "",
      goerli: process.env.VERIFY_APIKEY_GOERLI || "",
      scrollTestnet: process.env.VERIFY_APIKEY_SCROLL_TESTNET || "",
      fantomTestnet: process.env.VERIFY_APIKEY_FANTOM_TESTNET || "",
      gnosisChiado: process.env.VERIFY_APIKEY_GNOSIS_CHIADO || "",
      neonDevnet: process.env.VERIFY_APIKEY_NEON_DEVNET || "",
      coreDaoTestnet: process.env.VERIFY_APIKEY_COREDAO_TESTNET || "",   
    }
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: true
  }
};

module.exports = config;