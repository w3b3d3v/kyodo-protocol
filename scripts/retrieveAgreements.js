const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xF80586D034A18597b933B80eb43805c46b483cA9"; // Substitua pelo endereço real do contrato AgreementContract
  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  const agreementContract = await AgreementContract.attach(contractAddress);

  // const agreementCount = await agreementContract.getAgreementCount();
  // console.log(`Total agreements: ${agreementCount}`);

  const agreements = await agreementContract.getAllAgreements();
  console.log("Agreements:");
  agreements.forEach((agreement) => {
    console.log(`
      Title: ${agreement.title}
      Description: ${agreement.description}
      Status: ${agreement.status}
      Developer: ${agreement.developer}
      Company: ${agreement.company}
      Skills: ${agreement.skills.join(", ")}
      Incentive Amount: ${ethers.utils.formatEther(agreement.tokenIncentive.amount)} tokens
      Incentive Token: ${agreement.tokenIncentive.tokenAddress}
      Payment Amount: ${ethers.utils.formatEther(agreement.payment.amount)} tokens
      Payment Token: ${agreement.payment.tokenAddress}
    `);
  });
}

async function getUserAgreements(userAddress) {
  const contractAddress = "0xF80586D034A18597b933B80eb43805c46b483cA9"; // Substitua pelo endereço real do contrato AgreementContract
  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  const agreementContract = await AgreementContract.attach(contractAddress);

  const userAgreementIds = await agreementContract.getUserAgreements();

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
      Incentive Amount: ${ethers.utils.formatEther(agreement.tokenIncentive.amount)} tokens
      Incentive Token: ${agreement.tokenIncentive.tokenAddress}
      Payment Amount: ${ethers.utils.formatEther(agreement.payment.amount)} tokens
      Payment Token: ${agreement.payment.tokenAddress}
    `);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});

getUserAgreements()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});