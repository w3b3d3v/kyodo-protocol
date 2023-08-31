const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xF80586D034A18597b933B80eb43805c46b483cA9"; // Substitua pelo endereço real do contrato AgreementContract
  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  const agreementContract = await AgreementContract.attach(contractAddress);

  const agreementsPath = path.join(__dirname, "assets", "agreements.json");
  const agreementsData = JSON.parse(fs.readFileSync(agreementsPath, "utf-8"));

  const accounts = await ethers.getSigners();
  const firstAccount = accounts[0];
  const secondAccount = accounts[1];

  for (let i = 0; i < agreementsData.length; i++) {
    const agreementData = agreementsData[i];
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

    const signer = i % 2 === 0 ? firstAccount : secondAccount;

    const agreementContractWithSigner = agreementContract.connect(signer);

    const tx = await agreementContractWithSigner.createAgreement(
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