const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const allowedTokens = require("/Users/nomadbitcoin/Desktop/projects/kyodo-protocol-mvp/src/components/assets/allowedTokens.json");

describe("AgreementContract", function () {
  let agreementContract;
  let developer;

  beforeEach(async () => {
    const AgreementContract = await ethers.getContractFactory("AgreementContract");
    agreementContract = await AgreementContract.deploy();
    await agreementContract.deployed();

    for (const token of allowedTokens) {
      await agreementContract.addAcceptedPaymentToken(token.address);
    }

    [developer] = await ethers.getSigners();
  });

  it("Should create a new agreement with authorized tokens", async function () {
    const skills = ["JavaScript", "Solidity"];
    const paymentAmount = ethers.utils.parseEther("5");
    const paymentToken = allowedTokens[1].address;

    await agreementContract.connect(developer).createAgreement(
      "Test Agreement",
      "This is a test agreement",
      developer.address,
      skills,
      paymentAmount,
      paymentToken
    );

    const agreementCount = await agreementContract.getAgreementCount();
    expect(agreementCount).to.equal(1);

    // Rest of your expectations...
  });

  it("Should fail to create a new agreement with unauthorized tokens", async function () {
    const skills = ["JavaScript", "Solidity"];
    const paymentAmount = ethers.utils.parseEther("5");
    const paymentToken = developer.address; // Using the developer's address as a token for unauthorized scenario

    try {
      await agreementContract.connect(developer).createAgreement(
        "Test Agreement",
        "This is a test agreement",
        developer.address,
        skills,
        paymentAmount,
        paymentToken
      );
      // If the transaction succeeds, fail the test
      expect.fail("Transaction should have reverted");
    } catch (error) {
      expect(error.message).to.contain("revert");
      // Optionally, you can also check the exact error message for more specificity
      // expect(error.message).to.equal("Your expected error message");
    }
  });
});
