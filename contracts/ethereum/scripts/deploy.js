const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
require('dotenv').config({ path: '../../.env.development.local' });

const TOTAL_FEE = 20;
const PROTOCOL_FEE = 500;
const COMMUNITY_FEE = 500;
const FAKE_STABLE_DECIMALS = 18;

let = SPARK_DATA_PROVIDER = "0x0000000000000000000000000000000000000000";
let = SPARK_INCENTIVES_CONTROLLER= "0x0000000000000000000000000000000000000000"; //doesn't exist for kovan
let = SPARK_LENDING_POOL= "0x26ca51Af4506DE7a6f0785D20CD776081a05fF6d";

const DAI_GOERLI = "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844"

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

function updateConfig(agreementContractAddress, fakeStableAddress, vaultAddress, deploymentBlockNumber) {
  const envPath = path.join(__dirname, '../../../.env.development.local');
  let envData = fs.readFileSync(envPath, 'utf8');
  const lines = envData.split('\n');

  const keysToUpdate = {
    'NEXT_PUBLIC_AGREEMENT_CONTRACT_ADDRESS': agreementContractAddress,
    'NEXT_PUBLIC_FAKE_STABLE_ADDRESS': DAI_GOERLI,
    'NEXT_PUBLIC_STABLE_VAULT_ADDRESS': vaultAddress,
    'NEXT_PUBLIC_DEPLOYMENT_BLOCK_NUMBER': deploymentBlockNumber
  };

  Object.keys(keysToUpdate).forEach(key => {
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
  const tx = await contract.addAcceptedPaymentToken(DAI_GOERLI);
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
    
  // Wait for the deployment transaction to be mined
  await vault.deployTransaction.wait();

  const tx =await vault.setSparkSettings(SPARK_DATA_PROVIDER, SPARK_INCENTIVES_CONTROLLER, SPARK_LENDING_POOL);
  await tx.wait(); // Wait for the transaction to be mined
  console.log("setSparkSettings transaction hash: ", tx.hash);

  console.log("StableVault deployed to:", vault.address);
  copyVaultABI();
  return vault.address;
}


async function main() {
  try {
    const tokenAddress = await deployToken();
    const vaultAddress = await deployStableVault();
    
    const agreementData = await deployAgreementsContract(vaultAddress, tokenAddress);
    updateConfig(agreementData["address"], tokenAddress, vaultAddress, agreementData["deploymentBlock"]); 
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();