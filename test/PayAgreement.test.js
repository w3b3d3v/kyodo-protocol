const { expect } = require("chai");
const { ethers } = require("hardhat");
const allowedTokens = require("/Users/nomadbitcoin/Desktop/projects/kyodo-protocol-mvp/src/components/assets/allowedTokens.json");

const TOTAL_FEE = 20; // using 1000 basis points for fee calculation
const PROTOCOL_FEE = 500; // using 1000 basis points for fee calculation
const COMMUNITY_FEE = 500; // using 1000 basis points for fee calculation


describe("AgreementContract", function () {
  let agreementContract;
  let owner;
  let user1;
  let user2;
  let developer;

  beforeEach(async function () {
    const AgreementContract = await ethers.getContractFactory("AgreementContract");
    agreementContract = await AgreementContract.deploy();
    await agreementContract.deployed();

    [owner, developer, user1, user2] = await ethers.getSigners();

    // Set accepted payment tokens
    for (const token of allowedTokens) {
        await agreementContract.addAcceptedPaymentToken(token.address);
      }

    // Set values for fees and addresses
    await agreementContract.setFees(TOTAL_FEE, PROTOCOL_FEE, COMMUNITY_FEE); // Example fee values
    // await agreementContract.setKyodoTreasuryAndCommunityDAO("0xKYODOTREASURYADDRESS", "0xCOMMUNITYDAOADDRESS");
    // await agreementContract.updateTokenIncentive("0xTOKENADDRESS", ethers.utils.parseEther("100")); // Example token incentive
    // await agreementContract.kyodoTreasury = "0xKYODOTREASURYADDRESS"; // Example Kyodo Treasury address
    // await agreementContract.communityDAO = "0xCOMMUNITYDAOADDRESS"; // Example Community DAO address
  });

  it("Should make a payment and distribute fees", async function () {  
    const paymentToken = allowedTokens[0].address;

    // Create agreements using different user addresses
    await agreementContract.connect(user1).createAgreement(
      "Agreement 1",
      "Description 1",
      user1.address,
      ["Skill 1", "Skill 2"],
      100000000,
      paymentToken
    );

    const user1Agreements = await agreementContract.connect(user1).getUserAgreements(user1.address);
    const user1AgreementId = user1Agreements[0];
    const user1Agreement = await agreementContract.getAgreementById(user1AgreementId);
    await agreementContract.makePayment(user1AgreementId)

    // Approve the contract to spend user's tokens
    // await IERC20(paymentToken).approve(agreementContract.address, paymentAmount);
  
    // Call the makePayment function
    // await agreementContract.connect(developer).makePayment(agreementId);
  
    // Perform assertions to check if payments and fee distribution are correct
    // You can use "expect" statements to verify token balances and status changes
  });
});
