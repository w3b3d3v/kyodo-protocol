const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
require('dotenv').config({ path: '../../.env.development.local' });

const TOTAL_FEE = 20;
const PROTOCOL_FEE = 500;
const COMMUNITY_FEE = 500;
const FAKE_STABLE_DECIMALS = 18;

function copyABI() {
  const sourcePath = path.join(__dirname, "../artifacts/contracts/AgreementContract.sol/AgreementContract.json");
  const destinationPath = path.join(__dirname, "../../../contexts/contracts/AgreementContract.json");

  const sourceData = fs.readFileSync(sourcePath, "utf8");
  fs.writeFileSync(destinationPath, sourceData);
  console.log(`Copied AgreementContract ABI to ${destinationPath}`);
}

function copyVaultABI() {
  const sourcePath = path.join(__dirname, "../artifacts/contracts/StableVault.sol/StableVault.json");
  const destinationPath = path.join(__dirname, "../../../contexts/contracts/StableVault.json");

  const sourceData = fs.readFileSync(sourcePath, "utf8");
  fs.writeFileSync(destinationPath, sourceData);
  console.log(`Copied StableVault ABI to ${destinationPath}`);
}

function updateKyodoRegistry(kyodoRegistryContract){
  const keysToUpdate = {
    'NEXT_PUBLIC_AGREEMENT_CONTRACT_ADDRESS': agreementContractAddress,
    'NEXT_PUBLIC_FAKE_STABLE_ADDRESS': fakeStableAddress,
    'NEXT_PUBLIC_STABLE_VAULT_ADDRESS': vaultAddress,
    'NEXT_PUBLIC_DEPLOYMENT_BLOCK_NUMBER': deploymentBlockNumber,
    'NEXT_PUBLIC_KYODO_REGISTRY': kyodoRegistryContract.address,
  };
  Object.keys(keysToUpdate).forEach(async key => {
    let found = false;
    for (let i = 0; i < lines.length; i++) {
      // Saving on KyodoRegistry
      try {
        await kyodoRegistryContract.setRegistry(key, value)
      } catch (error) {
        console.log('error trying to save key on KyodoRegistry', error)
      }
    }
  });
}

function updateConfig(agreementContractAddress, fakeStableAddress, vaultAddress, deploymentBlockNumber, kyodoRegistryAddress) {
  console.log('agreement', agreementContractAddress);
  console.log('vault', vaultAddress);
  console.log('deploymentblock', deploymentBlockNumber);
  console.log('endereco', kyodoRegistryAddress);
  const envPath = path.join(__dirname, '../../../.env.development.local');
  let envData = fs.readFileSync(envPath, 'utf8');
  const lines = envData.split('\n');

  const keysToUpdate = {
    'NEXT_PUBLIC_AGREEMENT_CONTRACT_ADDRESS': agreementContractAddress,
    'NEXT_PUBLIC_FAKE_STABLE_ADDRESS': fakeStableAddress,
    'NEXT_PUBLIC_STABLE_VAULT_ADDRESS': vaultAddress,
    'NEXT_PUBLIC_DEPLOYMENT_BLOCK_NUMBER': deploymentBlockNumber,
    'NEXT_PUBLIC_KYODO_REGISTRY': kyodoRegistryAddress,
  };

  Object.keys(keysToUpdate).forEach(async key => {
    let found = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith(`${key}=`)) {
        lines[i] = `${key}=${keysToUpdate[key]}`;
        found = true;
        break;
      }
    }
    if (!found) {
      lines.push(`${key}=${keysToUpdate[key]}`);
    }
  });

  envData = lines.join('\n');
  fs.writeFileSync(envPath, envData);
  console.log(`Updated contract addresses in ${envPath}`);
}

async function deployAgreementsContract(vaultAddress, tokenAddress) {
  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  console.log(process.env.NEXT_PUBLIC_KYODO_TREASURY_CONTRACT_ADDRESS, process.env.NEXT_PUBLIC_COMMUNITY_TREASURY_CONTRACT_ADDRESS)
  const contract = await AgreementContract.deploy(
    process.env.NEXT_PUBLIC_KYODO_TREASURY_CONTRACT_ADDRESS,
    process.env.NEXT_PUBLIC_COMMUNITY_TREASURY_CONTRACT_ADDRESS
  );

  await contract.deployed();

  console.log("AgreementContract deployed to:", contract.address);

  // Wait for the deployment transaction to be mined
  const deployReceipt = await contract.deployTransaction.wait();

  // Now that the deployment is mined, you can call contract methods safely
  const tx = await contract.addAcceptedPaymentToken(tokenAddress);
  console.log("addAcceptedPaymentToken transaction hash: ", tx.hash);
  await tx.wait(); // Wait for the transaction to be mined

  const tx2 = await contract.setFees(TOTAL_FEE, PROTOCOL_FEE, COMMUNITY_FEE);
  console.log("setFees transaction hash: ", tx2.hash);
  await tx2.wait(); // Wait for the transaction to be mined
  
  const tx3 = await contract.setStableVaultAddress(vaultAddress);
  console.log("setStableVaultAddress transaction hash: ", tx3.hash);
  await tx3.wait(); // Wait for the transaction to be mined

  return {
    address: contract.address,
    deploymentBlock: deployReceipt.blockNumber
  };
}


async function deployToken() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);


  const Token = await ethers.getContractFactory("fakeStable");
  const token = await Token.deploy(ethers.utils.parseEther("1000000"), FAKE_STABLE_DECIMALS);
  await token.deployed();

  console.log("Token deployed to:", token.address);
  return token.address
}

async function deployStableVault() {
  const StableVault = await ethers.getContractFactory("StableVault");
  const [admin] = await ethers.getSigners();
  const vault = await StableVault.deploy(admin.address, "StableVaultToken", "STBLV");
  await vault.deployed();

  console.log("StableVault deployed to:", vault.address);
  copyVaultABI();
  return vault.address;
}

async function deployKyodoRegistry() {
  const KyodoRegistry = await ethers.getContractFactory("KyodoRegistry");
  const [admin] = await ethers.getSigners();
  const kyodoRegistry = await KyodoRegistry.deploy(admin.address);
  await kyodoRegistry.deployed();

  console.log("KyodoRegistry deployed to:", kyodoRegistry.address);
  copyVaultABI();
  return kyodoRegistry;
}


async function main() {
  try {
    const tokenAddress = await deployToken();
    const vaultAddress = await deployStableVault();
    const kyodoRegistryContract = await deployKyodoRegistry();
    
    const agreementData = await deployAgreementsContract(vaultAddress, tokenAddress);
    // updateKyodoRegistry(agreementData["address"], tokenAddress, vaultAddress, agreementData["deploymentBlock"], kyodoRegistryContract); 
    updateConfig(agreementData["address"], tokenAddress, vaultAddress, agreementData["deploymentBlock"], kyodoRegistryContract.address); 
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();