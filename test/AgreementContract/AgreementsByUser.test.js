const { expect } = require("chai");
const { ethers } = require("hardhat");

const KYODO_TREASURY_ADDRESS = process.env.NEXT_PUBLIC_KYODO_TREASURY_CONTRACT_ADDRESS
const COMMUNITY_TREASURY_ADDRESS = process.env.NEXT_PUBLIC_COMMUNITY_TREASURY_CONTRACT_ADDRESS
const FAKE_STABLE_ADDRESS = process.env.NEXT_PUBLIC_FAKE_STABLE_ADDRESS

describe("AgreementsByUser", function () {
  let agreementContract;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    const AgreementContract = await ethers.getContractFactory("AgreementContract");
    agreementContract = await AgreementContract.deploy(KYODO_TREASURY_ADDRESS, COMMUNITY_TREASURY_ADDRESS);
    await agreementContract.deployed();

    [owner, user1, user2] = await ethers.getSigners();

    await agreementContract.addAcceptedPaymentToken(FAKE_STABLE_ADDRESS);
  });

  it("Should create agreements and retrieve user-specific agreements", async function () {
    // Use the first two allowed tokens for testing

    // Create agreements using different user addresses
    await agreementContract.connect(user1).createAgreement(
      "Agreement 1",
      "Description 1",
      user2.address,
      ["Skill 1", "Skill 2"],
      ethers.utils.parseEther("5"),
    );

    await agreementContract.connect(user2).createAgreement(
      "Agreement 2",
      "Description 2",
      user1.address,
      ["Skill 3", "Skill 4"],
      ethers.utils.parseEther("4"),
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

    expect(user1Agreement.professional).to.equal(user2.address);
    expect(user2Agreement.professional).to.equal(user1.address);
  });  
});
