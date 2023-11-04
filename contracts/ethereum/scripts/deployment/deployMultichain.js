const { ethers } = require("hardhat");
const path = require("path");
require('dotenv').config({ path: '../../.env' });
const { mnemonicToSeedSync } = require("bip39");
const { HDNode } = require("@ethersproject/hdnode");
const fs = require('fs');
const networks = require("./networks.json");

const seed = mnemonicToSeedSync(process.env.MNEMONIC);
const masterNode = HDNode.fromSeed(seed);
const account = masterNode.derivePath("m/44'/60'/0'/0/5");  // The last /9 defines the account index

function updateConfig(kyodoRegistryAddress) {
  const envPath = path.join(__dirname, '../../../../.env.development.local');
  let envData = fs.readFileSync(envPath, 'utf8');

  const key = 'NEXT_PUBLIC_KYODO_REGISTRY';
  const newLine = `${key}=${kyodoRegistryAddress}`;
  
  if (envData.includes(key)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    envData = envData.replace(regex, newLine);
  } else {
    envData += `\n${newLine}`;
  }

  fs.writeFileSync(envPath, envData);
  console.log(`Updated contract address in ${envPath}`);
}

async function deployKyodoRegistry(rpcUrl) {
  console.log(`\nDeploying to ${rpcUrl}...`);

  // Create a provider for the network
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(account.privateKey, provider);

  // Deploy the KyodoRegistry
  const KyodoRegistry = await ethers.getContractFactory("KyodoRegistry", wallet);
  const kyodoRegistry = await KyodoRegistry.deploy(wallet.address);
  await kyodoRegistry.deployed();
  console.log(`KyodoRegistry deployed to: ${kyodoRegistry.address}`);

  return kyodoRegistry.address;
}

async function main() {
  const deployedAddresses = {};

  for (const [networkName, rpcUrl] of Object.entries(networks.rpcList)) {
    console.log("rpcUrl")
    const address = await deployKyodoRegistry(rpcUrl);
    deployedAddresses[networkName] = address;
  }

  const uniqueAddresses = new Set(Object.values(deployedAddresses));
  if (uniqueAddresses.size === 1) {
    const commonAddress = Array.from(uniqueAddresses)[0];

    updateConfig(commonAddress);
    console.log(`All KyodoRegistry addresses are the same. Saved address to .env: ${commonAddress}`);
  } else {
    console.error("\n\n\n!!! Deployed KyodoRegistry addresses across networks are not the same.");
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
