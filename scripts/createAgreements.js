const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");
require('dotenv').config({ path: './.env.development.local' });

const AGREEMENT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AGREEMENT_CONTRACT_ADDRESS
const FAKE_STABLE_ADDRESS = process.env.NEXT_PUBLIC_FAKE_STABLE_ADDRESS

async function main() {
  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  const agreementContract = await AgreementContract.attach(AGREEMENT_CONTRACT_ADDRESS);

  const agreementsPath = path.join(__dirname, "assets", "agreements.json");
  const agreementsData = JSON.parse(fs.readFileSync(agreementsPath, "utf-8"));

  const accounts = await ethers.getSigners();
  
  const numberOfAccounts = 1; // Quantidade de contas para serem usadas
  
  if (numberOfAccounts > accounts.length) {
    console.log("Número de contas especificadas é maior do que as contas disponíveis.");
    return;
  }

  for (let i = 0; i < agreementsData.length; i++) {
    const agreementData = agreementsData[i];
    const {
      title,
      description,
      skills,
      paymentAmount,
    } = agreementData;

    const signer = accounts[i % numberOfAccounts]; // Agora usando numberOfAccounts para loop

    const agreementContractWithSigner = agreementContract.connect(signer);

    // Utilizando signer.address como valor para 'developer'
    const tx = await agreementContractWithSigner.createAgreement(
      "New Agreement",
      description,
      signer.address,
      skills,
      paymentAmount,
      FAKE_STABLE_ADDRESS
    );

    await tx.wait(); // Aguarda a transação ser minerada

    // Imprimindo o endereço da conta que realmente executou a transação
    console.log(`Agreement "${title}" created. User: ${signer.address} Transaction hash: ${tx.hash}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});