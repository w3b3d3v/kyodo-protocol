const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

const TOTAL_FEE = 20; // using 1000 basis points for fee calculation
const PROTOCOL_FEE = 500; // using 1000 basis points for fee calculation
const COMMUNITY_FEE = 500; // using 1000 basis points for fee calculation

function copyABI() {
  const sourcePath = path.join(__dirname, "../artifacts/contracts/AgreementContract.sol/AgreementContract.json");
  const destinationPath = path.join(__dirname, "../components/contracts/AgreementContract.json");

  const sourceData = fs.readFileSync(sourcePath, "utf8");
  fs.writeFileSync(destinationPath, sourceData);
  console.log(`Copied ABI to ${destinationPath}`);
}

function updateConfig(contractAddress) {
  const configPath = path.join(__dirname, "../src/config.json");
  let configData = fs.readFileSync(configPath, "utf8");

  configData = JSON.parse(configData);
  configData.contractAgreement = contractAddress;

  fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
  console.log(`Updated contract address in ${configPath}`);
}

async function main() {
  const configPath = path.join(__dirname, "../src/config.json");
  let configData = fs.readFileSync(configPath, "utf8");

  configData = JSON.parse(configData);

  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  contract = await AgreementContract.deploy(configData.kyodoTreasury, configData.communityDAO);

  await contract.deployed();

  console.log("AgreementContract deployed to:", contract.address);

  // Copy ABI
  copyABI();

  // Update config.json
  updateConfig(contract.address);

  // Load allowedTokens.json
  const allowedTokensData = fs.readFileSync("public/allowedTokens.json", "utf8");
  const allowedTokens = JSON.parse(allowedTokensData);

  // Add allowed tokens to the contract
  for (const token of allowedTokens) {
    await contract.addAcceptedPaymentToken(token.address);
    console.log(`Added ${token.name} (${token.address}) as an accepted payment token`);
  }

  await contract.setFees(TOTAL_FEE, PROTOCOL_FEE, COMMUNITY_FEE);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
