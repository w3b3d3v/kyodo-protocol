const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  const contract = await AgreementContract.deploy();

  await contract.deployed();

  console.log("AgreementContract deployed to:", contract.address);

  // Load allowedTokens.json
  const allowedTokensData = fs.readFileSync("/Users/nomadbitcoin/Desktop/projects/kyodo-protocol-mvp/src/components/assets/allowedTokens.json", "utf8");
  const allowedTokens = JSON.parse(allowedTokensData);

  // Add allowed tokens to the contract
  for (const token of allowedTokens) {
    await contract.addAcceptedPaymentToken(token.address);
    console.log(`Added ${token.name} (${token.address}) as an accepted payment token`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
