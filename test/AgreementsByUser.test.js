const { expect } = require("chai");
const { ethers } = require("hardhat");
const allowedTokens = require("/Users/nomadbitcoin/Desktop/projects/kyodo-protocol-mvp/src/components/assets/allowedTokens.json");

describe("AgreementContract", function () {
  let agreementContract;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    const AgreementContract = await ethers.getContractFactory("AgreementContract");
    agreementContract = await AgreementContract.deploy();
    await agreementContract.deployed();

    [owner, user1, user2] = await ethers.getSigners();

    // Add allowed tokens to the contract
    for (const token of allowedTokens) {
      await agreementContract.addAcceptedPaymentToken(token.address);
    }
  });

  it("Should create agreements and retrieve user-specific agreements", async function () {
    // Use the first two allowed tokens for testing
    const paymentToken = allowedTokens[1].address;

    // Create agreements using different user addresses
    await agreementContract.connect(user1).createAgreement(
      "Agreement 1",
      "Description 1",
      user1.address,
      ["Skill 1", "Skill 2"],
      ethers.utils.parseEther("5"),
      paymentToken
    );

    await agreementContract.connect(user2).createAgreement(
      "Agreement 2",
      "Description 2",
      user2.address,
      ["Skill 3", "Skill 4"],
      ethers.utils.parseEther("4"),
      paymentToken
    );

    // Get user agreements
    const user1Agreements = await agreementContract.connect(user1).getUserAgreements(user1.address);
    expect(user1Agreements.length).to.equal(1);

    const user2Agreements = await agreementContract.connect(user2).getUserAgreements(user2.address);
    expect(user2Agreements.length).to.equal(1);

    // Get agreement details using agreement IDs
    const user1AgreementId = user1Agreements[0];
    const user2AgreementId = user2Agreements[0];

    const user1Agreement = await agreementContract.getAgreementById(user1AgreementId);
    const user2Agreement = await agreementContract.getAgreementById(user2AgreementId);

    expect(user1Agreement.developer).to.equal(user1.address);
    expect(user2Agreement.developer).to.equal(user2.address);
  });  
});
