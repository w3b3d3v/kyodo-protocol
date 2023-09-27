const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
require('dotenv').config({ path: './.env.development.local' });

const TOTAL_FEE = 20;
const PROTOCOL_FEE = 500;
const COMMUNITY_FEE = 500;
const FAKE_STABLE_DECIMALS = 18;

function copyABI() {
  const sourcePath = path.join(__dirname, "../artifacts/contracts/AgreementContract.sol/AgreementContract.json");
  const destinationPath = path.join(__dirname, "../contexts/contracts/AgreementContract.json");

  const sourceData = fs.readFileSync(sourcePath, "utf8");
  fs.writeFileSync(destinationPath, sourceData);
  console.log(`Copied AgreementContract ABI to ${destinationPath}`);
}

function copyVaultABI() {
  const sourcePath = path.join(__dirname, "../artifacts/contracts/StableVault.sol/StableVault.json");
  const destinationPath = path.join(__dirname, "../contexts/contracts/StableVault.json");

  const sourceData = fs.readFileSync(sourcePath, "utf8");
  fs.writeFileSync(destinationPath, sourceData);
  console.log(`Copied StableVault ABI to ${destinationPath}`);
}

function updateConfig(agreementContractAddress, fakeStableAddress, vaultAddress) {
  const envPath = path.join(__dirname, '../.env.development.local');
  let envData = fs.readFileSync(envPath, 'utf8');
  const lines = envData.split('\n');

  const keysToUpdate = {
    'NEXT_PUBLIC_AGREEMENT_CONTRACT_ADDRESS': agreementContractAddress,
    'NEXT_PUBLIC_FAKE_STABLE_ADDRESS': fakeStableAddress,
    'NEXT_PUBLIC_STABLE_VAULT_ADDRESS': vaultAddress
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

async function deployAgreementsContract(vaultAddress) {
  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  contract = await AgreementContract
  .deploy
  (
    process.env.NEXT_PUBLIC_KYODO_TREASURY_CONTRACT_ADDRESS, 
    process.env.NEXT_PUBLIC_COMMUNITY_TREASURY_CONTRACT_ADDRESS,
  );

  await contract.deployed();

  console.log("AgreementContract deployed to:", contract.address);


  copyABI();


  const allowedTokensData = fs.readFileSync("public/allowedTokens.json", "utf8");
  const allowedTokens = JSON.parse(allowedTokensData);


  for (const token of allowedTokens) {
    await contract.addAcceptedPaymentToken(token.address);
  
  }

  await contract.setFees(TOTAL_FEE, PROTOCOL_FEE, COMMUNITY_FEE);
  await contract.setStableVaultAddress(vaultAddress);
  return contract.address
}

async function deployToken() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);


  const Token = await ethers.getContractFactory("fakeStable");
  const token = await Token.deploy(ethers.utils.parseEther("1000000"), FAKE_STABLE_DECIMALS);
  await token.deployed();

  console.log("Token deployed to:", token.address);


  const allowedTokensPath = 'public/allowedTokens.json';
  const allowedTokensData = fs.readFileSync(allowedTokensPath, 'utf8');
  const allowedTokens = JSON.parse(allowedTokensData);


  if (allowedTokens.length > 0) {
    
      const lastToken = allowedTokens[allowedTokens.length - 1];
      lastToken.address = token.address;
      lastToken.logo = "src/components/assets/your-token-logo.svg";
      lastToken.name = "fakeStable";
      lastToken.decimals = FAKE_STABLE_DECIMALS;

    
      const updatedAllowedTokensData = JSON.stringify(allowedTokens, null, 2);
      fs.writeFileSync(allowedTokensPath, updatedAllowedTokensData, 'utf8');

      console.log("Last token in allowedTokens.json updated");
      return token.address
  } else {
      console.log("No tokens found in allowedTokens.json");
  }
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


async function main() {
  try {
    const tokenAddress = await deployToken();
    const vaultAddress = await deployStableVault();  
    const agreementAddress = await deployAgreementsContract(vaultAddress);
    updateConfig(agreementAddress, tokenAddress, vaultAddress); 
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();