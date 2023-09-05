const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../src/config.json");
let configData = fs.readFileSync(configPath, "utf8");

configData = JSON.parse(configData);
const contractAddress = configData.contractAgreement;

async function main() {

  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  const agreementContract = await AgreementContract.attach(contractAddress);

  const agreements = await agreementContract.getAllAgreements();
  console.log("All Agreements:");
  agreements.forEach((agreement) => {
    console.log(`
      Title: ${agreement.title}
      Description: ${agreement.description}
      Status: ${agreement.status}
      Developer: ${agreement.developer}
      Company: ${agreement.company}
      Skills: ${agreement.skills.join(", ")}
      Payment Amount: ${ethers.utils.formatEther(agreement.payment.amount)} tokens
      Payment Token: ${agreement.payment.tokenAddress}
      Total Paid: ${agreement.totalPaid}
    `);
  });
}

async function getUserAgreements() {
  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  const agreementContract = await AgreementContract.attach(contractAddress);

  const accounts = await ethers.getSigners();
  const userAddress = accounts[0].address
  const userAgreementIds = await agreementContract.getUserAgreements(userAddress);

  console.log(`Agreements for user at address ${userAddress}:`);

  for (const agreementId of userAgreementIds) {
    const agreement = await agreementContract.getAgreementById(agreementId);
    console.log(`
      Agreement ID: ${agreement.id}
      Title: ${agreement.title}
      Description: ${agreement.description}
      Status: ${agreement.status}
      Developer: ${agreement.developer}
      Skills: ${agreement.skills.join(", ")}
      Payment Amount: ${ethers.utils.formatEther(agreement.payment.amount)} tokens
      Payment Token: ${agreement.payment.tokenAddress}
      Total Paid: ${agreement.totalPaid}
    `);
  }
}

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
// });

getUserAgreements()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});