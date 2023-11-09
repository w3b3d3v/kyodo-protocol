const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");
require('dotenv').config({ path: '../../.env.development.local' });

async function kyodoRegistry(contractName) {
  const codeAtAddress = await ethers.provider.getCode(process.env.NEXT_PUBLIC_KYODO_REGISTRY);
  console.log("codeAtAddress", codeAtAddress)
  const KyodoRegistryContract = await ethers.getContractFactory("KyodoRegistry")
  const kyodoRegistryContract = await KyodoRegistryContract.attach(process.env.NEXT_PUBLIC_KYODO_REGISTRY);
  
  const address = await kyodoRegistryContract.getRegistry(contractName)
  return address
}

async function main() {
  const AgreementContract = await ethers.getContractFactory("AgreementContract")
  const agreementContract = await AgreementContract.attach(await kyodoRegistry("AGREEMENT_CONTRACT_ADDRESS"));

  const agreementsPath = path.join(__dirname, "assets", "agreements.json");
  const agreementsData = JSON.parse(fs.readFileSync(agreementsPath, "utf-8"));

  const accounts = await ethers.getSigners();
  
  const numberOfAccounts = 1; 
  
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

    const signer = accounts[i % numberOfAccounts]; 

    // const agreementContractWithSigner = agreementContract(signer);

    
    const tx = await agreementContract.createAgreement(
      "New Agreementa",
      description,
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Second test wallet
      skills,
      paymentAmount
    );

    await tx.wait(); 

    console.log(`Agreement "${title}" created. User: ${signer.address} Transaction hash: ${tx.hash}`);

    const agreements = await agreementContract.getAllAgreements();   
    console.log("agreements", agreements)

  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});