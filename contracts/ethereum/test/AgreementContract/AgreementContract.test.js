const { expect } = require("chai");
const { ethers } = require("hardhat");
require('dotenv').config({ path: '../../.env.development.local' });

const FAKE_STABLE_ADDRESS = process.env.NEXT_PUBLIC_FAKE_STABLE_ADDRESS

describe("AgreementContract", function () {
  let agreementContract;
  let admin;
  let skills;

  beforeEach(async () => {
    const AgreementContract = await ethers.getContractFactory("AgreementContract");
    const {deployer, kyodoTreasury, communityTreasury} = await getNamedAccounts();
    agreementContract = await AgreementContract.deploy(kyodoTreasury, communityTreasury, deployer);
    await agreementContract.deployed();

    await agreementContract.addAcceptedPaymentToken(FAKE_STABLE_ADDRESS);

    
    skills = [
      { name: "Programming", level: 50 },
      { name: "Design", level: 50 }
    ];
  });

  it("Should create a new agreement with authorized tokens", async function () {
    const paymentAmount = ethers.utils.parseEther("5");

    await agreementContract.connect(admin).createAgreement(
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

    await expect(agreementContract.connect(admin).createAgreement(
      "Test Agreement",
      "This is a test agreement",
      admin.address,
      skills,
      paymentAmount,
    )).to.be.revertedWith("Professional address cannot be the same as company")
  });
});
