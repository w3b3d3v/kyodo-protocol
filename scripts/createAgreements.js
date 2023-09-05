const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

const configPath = path.join(__dirname, "../src/config.json");
let configData = fs.readFileSync(configPath, "utf8");

configData = JSON.parse(configData);
const contractAddress = configData.contractAgreement;

async function main() {
  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  const agreementContract = await AgreementContract.attach(contractAddress);

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
      paymentToken,
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
      "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
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