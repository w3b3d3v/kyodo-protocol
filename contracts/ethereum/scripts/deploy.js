const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
require('dotenv').config({ path: '../../.env.development.local' });

const TOTAL_FEE = 20;
const PROTOCOL_FEE = 500;
const COMMUNITY_FEE = 500;
const FAKE_STABLE_DECIMALS = 18;
const SPARK_VALID_CHAIN_IDS = [31337, 1, 5];

let = SPARK_DATA_PROVIDER = "0x86C71796CcDB31c3997F8Ec5C2E3dB3e9e40b985"; // GOERLY_ADDRESS
let = SPARK_INCENTIVES_CONTROLLER= "0x0000000000000000000000000000000000000000"; // GOERLY_ADDRESS
let = SPARK_LENDING_POOL= "0x26ca51Af4506DE7a6f0785D20CD776081a05fF6d"; // GOERLY_ADDRESS

function copyABI() {
  const sourcePath = path.join(
    __dirname,
    "../artifacts/contracts/AgreementContract.sol/AgreementContract.json"
  )
  const destinationPath = path.join(__dirname, "../../../chains/ethereum/abis/AgreementContract.json")

  const sourceData = fs.readFileSync(sourcePath, "utf8")
  fs.writeFileSync(destinationPath, sourceData)
  console.log(`Copied AgreementContract ABI to ${destinationPath}`)
}

function copyVaultABI() {
  const sourcePath = path.join(__dirname, "../artifacts/contracts/StableVault.sol/StableVault.json")
  const destinationPath = path.join(__dirname, "../../../chains/ethereum/abis/StableVault.json")

  const sourceData = fs.readFileSync(sourcePath, "utf8")
  fs.writeFileSync(destinationPath, sourceData)
  console.log(`Copied StableVault ABI to ${destinationPath}`)
}

function updateConfig(agreementData, vaultData, fakeStableAddress, kyodoRegistryAddress) {
  const envPath = path.join(__dirname, '../../../.env.development.local');
  let envData = fs.readFileSync(envPath, 'utf8');
  const lines = envData.split('\n');

  const keysToUpdate = {
    'NEXT_PUBLIC_KYODO_REGISTRY': kyodoRegistryAddress,
    'NEXT_PUBLIC_FAKE_STABLE_ADDRESS': fakeStableAddress,
    'NEXT_PUBLIC_AGREEMENT_DEPLOYMENT_BLOCK_NUMBER': agreementData["deploymentBlock"],
    'NEXT_PUBLIC_VAULT_DEPLOYMENT_BLOCK_NUMBER': vaultData["deploymentBlock"],
  };

  Object.keys(keysToUpdate).forEach(async key => {
    let found = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith(`${key}=`)) {
        lines[i] = `${key}=${keysToUpdate[key]}`
        found = true
        break
      }
    }
    if (!found) {
      lines.push(`${key}=${keysToUpdate[key]}`)
    }
  })

  envData = lines.join("\n")
  fs.writeFileSync(envPath, envData)
  console.log(`Updated contract addresses in ${envPath}`)
}

async function deployAgreementsContract(vaultAddress, tokenAddress) {
  const AgreementContract = await ethers.getContractFactory("AgreementContract")
  const contract = await AgreementContract.deploy(
    process.env.NEXT_PUBLIC_KYODO_TREASURY_CONTRACT_ADDRESS,
    process.env.NEXT_PUBLIC_COMMUNITY_TREASURY_CONTRACT_ADDRESS
  )

  await contract.deployed()

  console.log("AgreementContract deployed to:", contract.address)

  // Wait for the deployment transaction to be mined
  const deployReceipt = await contract.deployTransaction.wait()

  // Now that the deployment is mined, you can call contract methods safely
  const tx = await contract.addAcceptedPaymentToken(tokenAddress)
  await tx.wait() // Wait for the transaction to be mined
  console.log("addAcceptedPaymentToken transaction hash: ", tx.hash)

  const tx2 = await contract.setFees(TOTAL_FEE, PROTOCOL_FEE, COMMUNITY_FEE)
  await tx2.wait() // Wait for the transaction to be mined
  console.log("setFees transaction hash: ", tx2.hash)

  const tx3 = await contract.setStableVaultAddress(vaultAddress)
  await tx3.wait() // Wait for the transaction to be mined
  console.log(`setStableVaultAddress ${vaultAddress} transaction hash: `, tx3.hash)

  copyABI()

  return {
    address: contract.address,
    deploymentBlock: deployReceipt.blockNumber,
  }
}

async function deployToken() {
  const Token = await ethers.getContractFactory("fakeStable")
  const token = await Token.deploy(ethers.utils.parseEther("1000000"), FAKE_STABLE_DECIMALS)
  await token.deployed()

  console.log("Token deployed to:", token.address)
  return token.address
}

async function deployStableVault() {
  const StableVault = await ethers.getContractFactory("StableVault")
  const [admin] = await ethers.getSigners()
  const vault = await StableVault.deploy(admin.address, "StableVaultToken", "STBLV")
  await vault.deployed()

  // Wait for the deployment transaction to be mined
  const deployReceipt = await vault.deployTransaction.wait()

  const tx = await vault.setSparkSettings(
    SPARK_DATA_PROVIDER,
    SPARK_INCENTIVES_CONTROLLER,
    SPARK_LENDING_POOL
  )
  await tx.wait() // Wait for the transaction to be mined
  console.log("setSparkSettings transaction hash: ", tx.hash)

  await vault.updateValidNetworks("depositSpark", SPARK_VALID_CHAIN_IDS)
  await vault.addProfile(admin.address)
  // await vault.setUserCompoundPreference(true)
  // FIXME add real address or way to user set its own wallet.
  // this wallet is the second hardhat wallet
  await vault.setUserCompoundPreference(false, admin.address) // LOCALNETWORK: False, otherwise will fail because Spark/AAve does not exist in local network
  console.log("StableVault deployed to:", vault.address)

  copyVaultABI()
  return {
    address: vault.address,
    deploymentBlock: deployReceipt.blockNumber,
  }
}

async function deployKyodoRegistry(agreementData, vaultData, fakeStableAddress) {
  const KyodoRegistry = await ethers.getContractFactory("KyodoRegistry");
  const [admin] = await ethers.getSigners();
  const kyodoRegistry = await KyodoRegistry.deploy(admin.address);
  await kyodoRegistry.deployed()

  const keysToUpdate = {
    'FAKE_STABLE_ADDRESS': fakeStableAddress,
    'AGREEMENT_CONTRACT_ADDRESS': agreementData["address"],
    'VAULT_CONTRACT_ADDRESS': vaultData["address"]
  };

  for (const [key, value] of Object.entries(keysToUpdate)) {
    try {
      const tx = await kyodoRegistry.createRegistry(key, value);
      
      await tx.wait();
    } catch (error) {
      console.log(`error trying to save ${key} on KyodoRegistry`, error);
    }
  }

  const address = await kyodoRegistry.getRegistry("AGREEMENT_CONTRACT_ADDRESS");
  console.log("address Saved", address)

  console.log("KyodoRegistry deployed to:", kyodoRegistry.address);
  return kyodoRegistry.address;
}


async function main() {
  try {
    const [deployer] = await ethers.getSigners()
    console.log("Deploying contracts with the account:", deployer.address)

    const tokenAddress = await deployToken();
    const vaultData = await deployStableVault();
    const agreementData = await deployAgreementsContract(vaultData['address'], tokenAddress);

    const kyodoRegistry = await deployKyodoRegistry(
      agreementData,
      vaultData,
      tokenAddress
    );
    
    updateConfig(
      agreementData,
      vaultData,
      tokenAddress,
      kyodoRegistry
    ); 
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();