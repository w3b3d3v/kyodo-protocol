const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xB9348EBD819400CA1Ea6A8D25Ef03e74Eb858042"; // Substitua pelo endereço real do contrato AgreementContract
  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  const agreementContract = await AgreementContract.attach(contractAddress);

  const agreementCount = await agreementContract.getAgreementCount();
  console.log(`Total agreements: ${agreementCount}`);

  const agreements = await agreementContract.getAllAgreements();
  console.log("Agreements:");
  agreements.forEach((agreement) => {
    console.log(`
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
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
