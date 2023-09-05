const fs = require('fs');
const { ethers } = require("hardhat");
const allowedTokens = require("../public/allowedTokens.json");

const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../src/config.json");
let configData = fs.readFileSync(configPath, "utf8");

configData = JSON.parse(configData);
const contractAddress = configData.contractAgreement;

const TOTAL_FEE = 20; // using 1000 basis points for fee calculation
const PROTOCOL_FEE = 500; // using 1000 basis points for fee calculation
const COMMUNITY_FEE = 500; // using 1000 basis points for fee calculation

async function main() {
  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  const agreementContract = await AgreementContract.attach(contractAddress);

  // const [owner, developer, user1, user2] = await ethers.getSigners();

  // Set accepted payment tokens
  // for (const token of allowedTokens) {
  //   await agreementContract.addAcceptedPaymentToken(token.address);
  // }

  // Set values for fees and addresses
  // await agreementContract.setFees(TOTAL_FEE, PROTOCOL_FEE, COMMUNITY_FEE); // Example fee values
  await agreementContract.addAcceptedPaymentToken("0x523fF109F29125C52217B5631bd4cA129e2f4d8B");

  // const paymentToken = allowedTokens[3].address;
  // const TokenContract = await ethers.getContractFactory("testToken");
  // const tokenContract = await TokenContract.attach(paymentToken);
  // const paymentAmount = ethers.utils.parseEther("5");

  // // Create agreements using different user addresses
  // await agreementContract.connect(owner).createAgreement(
  //   "Agreement 1",
  //   "Description 1",
  //   owner.address,
  //   ["Skill 1", "Skill 2"],
  //   paymentAmount,
  //   paymentToken
  // );

  // const ownerAgreements = await agreementContract.connect(owner).getUserAgreements(owner.address);
  // const ownerAgreementId = ownerAgreements[0];
  // const ownerAgreement = await agreementContract.getAgreementById(ownerAgreementId);

  // Approve the contract to spend user's tokens
  // await tokenContract.approve(agreementContract.address, paymentAmount);
  // console.log("Approval: ", await tokenContract.allowance(owner.address, agreementContract.address));
  // await agreementContract.makePayment(ownerAgreementId, paymentAmount);

  // Call the makePayment function
  // await agreementContract.connect(developer).makePayment(agreementId);

  // Perform further actions or assertions here
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
