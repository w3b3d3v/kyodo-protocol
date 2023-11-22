const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
require('dotenv').config({ path: '../../.env.development.local' });

const PROTOCOL_FEE = 10;
const FAKE_STABLE_DECIMALS = 18;

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

async function deployAgreementsContract(tokenAddress) {
  console.log(`\nDeploying AgreementsContract...`)
  const AgreementContract = await ethers.getContractFactory("AgreementContract")
  const {deployer, kyodoTreasury} = await getNamedAccounts();
  const contract = await AgreementContract.deploy(
    kyodoTreasury,
    PROTOCOL_FEE,
    deployer
  )

  await contract.deployed()

  // Wait for the deployment transaction to be mined
  const deployReceipt = await contract.deployTransaction.wait(1)
  console.log(`Deployed AgreementContract ${contract.address} | Block ${deployReceipt.blockNumber}: `)

  // Now that the deployment is mined, you can call contract methods safely
  const tx = await contract.addAcceptedPaymentToken(tokenAddress)
  await tx.wait(1) // Wait for the transaction to be mined
  console.log("addAcceptedPaymentToken transaction hash: ", tx.hash)
  
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

async function updateRegistry(agreementData, tokenData) {
  const KyodoRegistry = await ethers.getContractFactory("KyodoRegistry");
  const kyodoRegistry = KyodoRegistry.attach(process.env.NEXT_PUBLIC_KYODO_REGISTRY);

  const keysToUpdate = {
    'FAKE_STABLE': tokenData,
    'AGREEMENT_CONTRACT': agreementData
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

  const address = await kyodoRegistry.getRegistry("AGREEMENT_CONTRACT");
  console.log("address Saved", address)

  return kyodoRegistry.address;
}

async function main() {
  try {

    const codeAtAddress = await ethers.provider.getCode(process.env.NEXT_PUBLIC_KYODO_REGISTRY);
    if (codeAtAddress === '0x') {
        console.error("No contract found at the specified address. Please deploy the registry contract on this network before proceeding.");
        process.exit(1);
    }

    const [deployer] = await hre.ethers.getSigners();
    const chainId = await deployer.getChainId();
    const nonce = await deployer.getTransactionCount();
    const balance = await deployer.getBalance(); 
    
    console.log(`\nDeploying contracts with the account: ${deployer.address}`);
    console.log(`Chain ID: ${chainId}`);
    console.log(`Nonce: ${nonce}`);
    console.log(`Balance: ${hre.ethers.utils.formatEther(balance)} ETH\n`); 
    
    const tokenData = await deployToken();
    const agreementData = await deployAgreementsContract(tokenData["address"]);

    const kyodoRegistry = await updateRegistry(
      agreementData,
      tokenData
    );

    console.log(`\nUpdated! KyodoRegistry at address: ${kyodoRegistry}`);
    
    updateConfig(kyodoRegistry); 
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();