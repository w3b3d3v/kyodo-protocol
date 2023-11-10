const { expect } = require("chai");
const { ethers } = require("hardhat");
require('dotenv').config({ path: '../../.env.development.local' });

const KYODO_TREASURY_ADDRESS = process.env.NEXT_PUBLIC_KYODO_TREASURY_CONTRACT_ADDRESS
const COMMUNITY_TREASURY_ADDRESS = process.env.NEXT_PUBLIC_COMMUNITY_TREASURY_CONTRACT_ADDRESS
const FAKE_STABLE_ADDRESS = process.env.NEXT_PUBLIC_FAKE_STABLE_ADDRESS

describe("AgreementContract", function () {
  let agreementContract;
  let developer;
  let skills;

  beforeEach(async () => {
    const AgreementContract = await ethers.getContractFactory("AgreementContract");
    agreementContract = await AgreementContract.deploy(KYODO_TREASURY_ADDRESS, COMMUNITY_TREASURY_ADDRESS);
    await agreementContract.deployed();

    await agreementContract.addAcceptedPaymentToken(FAKE_STABLE_ADDRESS);

    [developer, addr1] = await ethers.getSigners();
    
    skills = [
      { name: "Programming", level: 50 },
      { name: "Design", level: 50 }
    ];
  });

  it("Should create a new agreement with authorized tokens", async function () {
    const paymentAmount = ethers.utils.parseEther("5");

    await agreementContract.connect(developer).createAgreement(
      "Test Agreement",
      "This is a test agreement",
      addr1.address,
      skills,
      paymentAmount,
    );

    const agreementCount = await agreementContract.getAgreementCount();
    expect(agreementCount).to.equal(1);
  });

  it("Should fail if the professional is the same as company", async function () {
    const paymentAmount = ethers.utils.parseEther("5");

    await expect(agreementContract.connect(developer).createAgreement(
      "Test Agreement",
      "This is a test agreement",
      developer.address,
      skills,
      paymentAmount,
    )).to.be.revertedWith("Professional address cannot be the same as company")
  });
});
