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

function updateConfig(kyodoRegistryAddress) {
  const envPath = path.join(__dirname, '../../../.env.development.local');
  let envData = fs.readFileSync(envPath, 'utf8');
  const lines = envData.split('\n');

  const keysToUpdate = {
    'NEXT_PUBLIC_KYODO_REGISTRY': kyodoRegistryAddress
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
  console.log(`\nDeploying AgreementsContract...`)
  const AgreementContract = await ethers.getContractFactory("AgreementContract")
  const contract = await AgreementContract.deploy(
    process.env.NEXT_PUBLIC_KYODO_TREASURY_CONTRACT_ADDRESS,
    process.env.NEXT_PUBLIC_COMMUNITY_TREASURY_CONTRACT_ADDRESS
  )

  await contract.deployed()

  // Wait for the deployment transaction to be mined
  const deployReceipt = await contract.deployTransaction.wait(1)
  console.log(`Deployed AgreementContract ${contract.address} | Block ${deployReceipt.blockNumber}: `)

  // Now that the deployment is mined, you can call contract methods safely
  const tx = await contract.addAcceptedPaymentToken(tokenAddress)
  await tx.wait(1) // Wait for the transaction to be mined
  console.log("addAcceptedPaymentToken transaction hash: ", tx.hash)

  const tx2 = await contract.setFees(TOTAL_FEE, PROTOCOL_FEE, COMMUNITY_FEE)
  await tx2.wait(1) // Wait for the transaction to be mined
  console.log("setFees transaction hash: ", tx2.hash)

  const tx3 = await contract.setStableVaultAddress(vaultAddress)
  await tx3.wait(1) // Wait for the transaction to be mined
  
  copyABI()

  return {
    address: contract.address,
    deploymentBlock: deployReceipt.blockNumber,
  }
}

async function deployToken() {
  console.log(`\nDeploying Token...`)
  const Token = await ethers.getContractFactory("fakeStable")
  const token = await Token.deploy(ethers.utils.parseEther("1000000"), FAKE_STABLE_DECIMALS)
  await token.deployed()
  const deployReceipt = await token.deployTransaction.wait(1)
  console.log(`Deployed Token ${token.address} | Block ${deployReceipt.blockNumber}: `)
  return {
    address: token.address,
    deploymentBlock: deployReceipt.blockNumber,
  }
}

async function deployStableVault() {
  console.log(`\nDeploying StableVault...`)
  const StableVault = await ethers.getContractFactory("StableVault")
  const [admin] = await ethers.getSigners()
  const vault = await StableVault.deploy(admin.address, "StableVaultToken", "STBLV")
  await vault.deployed()

  // Wait for the deployment transaction to be mined
  const deployReceipt = await vault.deployTransaction.wait(1)
  console.log(`Deployed setStableVaultAddress ${vault.address} | Block ${deployReceipt.blockNumber}: `)

  // const tx = await vault.setSparkSettings(
  //   SPARK_DATA_PROVIDER,
  //   SPARK_INCENTIVES_CONTROLLER,
  //   SPARK_LENDING_POOL
  // )
  // await tx.wait(1) // Wait for the transaction to be mined
  // console.log("setSparkSettings transaction hash: ", tx.hash)

  // await vault.updateValidNetworks("depositSpark", SPARK_VALID_CHAIN_IDS)
  // await vault.addProfile(admin.address)
  // // await vault.setUserCompoundPreference(true)
  // // FIXME add real address or way to user set its own wallet.
  // // this wallet is the second hardhat wallet
  // await vault.setUserCompoundPreference(false, admin.address) // LOCALNETWORK: False, otherwise will fail because Spark/AAve does not exist in local network
  
  copyVaultABI()
  return {
    address: vault.address,
    deploymentBlock: deployReceipt.blockNumber,
  }
}

async function deployKyodoRegistry(agreementData, vaultData, tokenData) {
  const KyodoRegistry = await ethers.getContractFactory("KyodoRegistry");
  const [admin] = await ethers.getSigners();
  
  let kyodoRegistry;
  // Check if a contract already exists at the specified address
  const codeAtAddress = await ethers.provider.getCode(process.env.NEXT_PUBLIC_KYODO_REGISTRY);
  if (codeAtAddress === '0x') {
    // Deploy if no contract exists at the address
    kyodoRegistry = await KyodoRegistry.deploy(admin.address);
    await kyodoRegistry.deployed()
    await kyodoRegistry.deployTransaction.wait(1)
  } else {
    // If a contract is already deployed, connect to it instead of redeploying
    kyodoRegistry = KyodoRegistry.attach(process.env.NEXT_PUBLIC_KYODO_REGISTRY);
  }

  // kyodoRegistry = KyodoRegistry.attach(process.env.NEXT_PUBLIC_KYODO_REGISTRY);

  const keysToUpdate = {
    'FAKE_STABLE_ADDRESS': tokenData,
    'AGREEMENT_CONTRACT_ADDRESS': agreementData,
    'VAULT_CONTRACT_ADDRESS': vaultData
  };

  for (const [key, data] of Object.entries(keysToUpdate)) {
    try {
      const tx = await kyodoRegistry.createRegistry(key, data["address"], data["deploymentBlock"]);
      await tx.wait(1);
      console.log(`\nKey ${key} stored on KyodoRegistry`, tx.hash);
    } catch (error) {
      if (error.message.includes("The registry already exists")) {
        try {
          const updateTx = await kyodoRegistry.updateRegistry(key, data["address"], data["deploymentBlock"]);
          await updateTx.wait(1);
          console.log(`\nKey ${key} updated on KyodoRegistry`, updateTx.hash);
        } catch (updateError) {
          console.log(`error trying to update ${key} on KyodoRegistry`, updateError);
        }
      } else {
        console.log(`error trying to save ${key} on KyodoRegistry`, error);
      }
    }
  }  

  const address = await kyodoRegistry.getRegistry("AGREEMENT_CONTRACT_ADDRESS");
  console.log("address Saved", address)

  return kyodoRegistry.address;
}

async function main() {
  try {
    const [deployer] = await hre.ethers.getSigners();
    const chainId = await deployer.getChainId();
    const nonce = await deployer.getTransactionCount();
    const balance = await deployer.getBalance(); 
    
    console.log(`\nDeploying contracts with the account: ${deployer.address}`);
    console.log(`Chain ID: ${chainId}`);
    console.log(`Nonce: ${nonce}`);
    console.log(`Balance: ${hre.ethers.utils.formatEther(balance)} ETH\n`); 
    
    const tokenData = await deployToken();
    const vaultData = await deployStableVault();
    const agreementData = await deployAgreementsContract(vaultData['address'], tokenData["address"]);

    const kyodoRegistry = await deployKyodoRegistry(
      agreementData,
      vaultData,
      tokenData
    );

    console.log(`\nKyodoRegistry Contract deployed at address: ${kyodoRegistry}`);
    
    updateConfig(kyodoRegistry); 
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();