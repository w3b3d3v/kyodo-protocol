const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");
require('dotenv').config({ path: '../../.env.development.local' });

async function kyodoRegistry(contractName) {
  const KyodoRegistryContract = await ethers.getContractFactory("KyodoRegistry")
  const kyodoRegistryContract = await KyodoRegistryContract.attach(process.env.NEXT_PUBLIC_KYODO_REGISTRY);
  
  const address = await kyodoRegistryContract.getRegistry(contractName)
  return address
}

async function main() {
  const AgreementContract = await ethers.getContractFactory("AgreementContract")
  const agreementContract = await AgreementContract.attach(await kyodoRegistry("AGREEMENT_CONTRACT"));

  const [deployer, developer] = await ethers.getSigners();
  const paymentAmount = ethers.utils.parseUnits("100", 18)

  skills = [
    { name: "Programming", level: 50 },
    { name: "Design", level: 50 }
  ];

  const tx = await agreementContract.connect(deployer).createAgreement(
    "Agreement 1 by cli test",
    "Description 1",
    developer.address,
    skills,
    paymentAmount
  );

  await tx.wait(); 

  console.log(`Agreement created. User: ${deployer.address} Transaction hash: ${tx.hash}`);

  const agreements = await agreementContract.getAllAgreements();   
  console.log("agreements", agreements)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});