const { expect } = require("chai");
const { ethers } = require("hardhat");
require('dotenv').config({ path: '../../.env.development.local' });

const FAKE_STABLE_ADDRESS = process.env.NEXT_PUBLIC_FAKE_STABLE_ADDRESS
const PROTOCOL_FEE = 10; // 1% in 1000 basis points

describe("AgreementContract", function () {
  let agreementContract;
  let developer;
  let skills;

  beforeEach(async () => {
    const AgreementContract = await ethers.getContractFactory("AgreementContract");
    const {deployer, kyodoTreasury} = await getNamedAccounts();
    agreementContract = await AgreementContract.deploy(kyodoTreasury, PROTOCOL_FEE, deployer);
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

  it("Should correctly return the protocol fee", async function () {
    // Chamando a função getFee e verificando o resultado
    const fee = await agreementContract.getFee();
    expect(fee).to.equal(PROTOCOL_FEE);
  });
});