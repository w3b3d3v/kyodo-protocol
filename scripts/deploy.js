const { ethers } = require("hardhat");

async function main() {
  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  const contract = await AgreementContract.deploy();

  await contract.deployed();

  console.log("AgreementContract deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
