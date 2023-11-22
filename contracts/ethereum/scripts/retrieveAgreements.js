const { ethers } = require("hardhat");
require('dotenv').config({ path: '../../.env.development.local' });

async function kyodoRegistry(contractName) {
  const KyodoRegistryContract = await ethers.getContractFactory("KyodoRegistry")
  const kyodoRegistryContract = await KyodoRegistryContract.attach(process.env.NEXT_PUBLIC_KYODO_REGISTRY);
  
  const address = await kyodoRegistryContract.getRegistry(contractName)
  return address
}

async function getAllAgreements() {

  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  const agreementContract = await AgreementContract.attach(kyodoRegistry("AGREEMENT_CONTRACT"));

  const agreements = await agreementContract.getAllAgreements();
  agreements.forEach((agreement) => {
    console.log(`
      Title: ${agreement.title}
      Description: ${agreement.description}
      Status: ${agreement.status}
      Developer: ${agreement.professional}
      Company: ${agreement.company}
      Payment Amount: ${ethers.utils.formatEther(agreement.paymentAmount)} tokens
      Total Paid: ${agreement.totalPaid}
      Fee: ${agreement.fee}
    `);
  });
}

async function getContractorAgreementIds() {
  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  const agreementContract = await AgreementContract.attach(kyodoRegistry("AGREEMENT_CONTRACT_ADDRESS"));

  const accounts = await ethers.getSigners();
  const userAddress = accounts[0].address
  console.log(`Agreements for user at address ${userAddress}:`);
  const userAgreementIds = await agreementContract.getContractorAgreementIds(userAddress);


  for (const agreementId of userAgreementIds) {
    const agreement = await agreementContract.getAgreementById(agreementId);
    console.log(`
      Agreement ID: ${agreement.id}
      Title: ${agreement.title}
      Description: ${agreement.description}
      Status: ${agreement.status}
      Developer: ${agreement.developer}
      Payment Amount: ${ethers.utils.formatEther(agreement.paymentAmount)} tokens
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

getAllAgreements()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});