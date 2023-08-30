const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xB9348EBD819400CA1Ea6A8D25Ef03e74Eb858042"; // Substitua pelo endereço real do contrato AgreementContract
  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  const agreementContract = await AgreementContract.attach(contractAddress);

  const agreementsPath = path.join(__dirname, "assets", "agreements.json");
  const agreementsData = JSON.parse(fs.readFileSync(agreementsPath, "utf-8"));

  for (const agreementData of agreementsData) {
    const {
      title,
      description,
      developer,
      skills,
      incentiveAmount,
      incentiveToken,
      paymentAmount,
      paymentToken,
    } = agreementData;

    const tx = await agreementContract.createAgreement(
      title,
      description,
      developer,
      skills,
      incentiveAmount,
      incentiveToken,
      paymentAmount,
      paymentToken
    );

    await tx.wait(); // Aguarda a transação ser minerada

    console.log(`Agreement "${title}" created. Transaction hash: ${tx.hash}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
