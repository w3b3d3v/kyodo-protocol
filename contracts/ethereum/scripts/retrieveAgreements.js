const { ethers } = require("hardhat");
require('dotenv').config({ path: '../../.env.development.local' });

const AGREEMENT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AGREEMENT_CONTRACT_ADDRESS

async function getAllAgreements() {

  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  const agreementContract = await AgreementContract.attach(AGREEMENT_CONTRACT_ADDRESS);

  const agreements = await agreementContract.getAllAgreements();
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
  const agreementContract = await AgreementContract.attach(AGREEMENT_CONTRACT_ADDRESS);

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

// getAllAgreements()
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