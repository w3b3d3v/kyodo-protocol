const { expect } = require("chai");
const { ethers } = require("hardhat");
require('dotenv').config({ path: './.env.development.local' });

const KYODO_TREASURY_ADDRESS = process.env.NEXT_PUBLIC_KYODO_TREASURY_CONTRACT_ADDRESS
const COMMUNITY_TREASURY_ADDRESS = process.env.NEXT_PUBLIC_COMMUNITY_TREASURY_CONTRACT_ADDRESS
const FAKE_STABLE_ADDRESS = process.env.NEXT_PUBLIC_FAKE_STABLE_ADDRESS

describe("AgreementContract", function () {
  let agreementContract;
  let developer;

  beforeEach(async () => {
    const AgreementContract = await ethers.getContractFactory("AgreementContract");
    agreementContract = await AgreementContract.deploy(KYODO_TREASURY_ADDRESS, COMMUNITY_TREASURY_ADDRESS);
    await agreementContract.deployed();

    await agreementContract.addAcceptedPaymentToken(FAKE_STABLE_ADDRESS);

    [developer] = await ethers.getSigners();
  });

  it("Should create a new agreement with authorized tokens", async function () {
    const skills = ["JavaScript", "Solidity"];
    const paymentAmount = ethers.utils.parseEther("5");
    const paymentToken = FAKE_STABLE_ADDRESS;

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
