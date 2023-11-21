const { expect } = require("chai");
const { ethers, getNamedAccounts } = require("hardhat");
require('dotenv').config({ path: '../../.env.development.local' });

const FAKE_STABLE_ADDRESS = process.env.NEXT_PUBLIC_FAKE_STABLE_ADDRESS

describe("AgreementsByUser", function () {
  let agreementContract;
  let owner;
  let user1;
  let user2;
  let skills;

  beforeEach(async function () {
    const AgreementContract = await ethers.getContractFactory("AgreementContract");
    const {deployer, kyodoTreasury, communityTreasury} = await getNamedAccounts();
    agreementContract = await AgreementContract.deploy(kyodoTreasury, communityTreasury, deployer);
    await agreementContract.deployed();

    [owner, user1, user2] = await ethers.getSigners();

    await agreementContract.addAcceptedPaymentToken(FAKE_STABLE_ADDRESS);
    skills = [
      { name: "Programming", level: 50 },
      { name: "Design", level: 50 }
    ];
  });

  it("Should create agreements and retrieve user-specific agreements", async function () {
    // Create agreements using different user addresses
    await agreementContract.connect(user1).createAgreement(
      "Agreement 1",
      "Description 1",
      user2.address,
      skills,
      ethers.utils.parseEther("5"),
    );

    await agreementContract.connect(user2).createAgreement(
      "Agreement 2",
      "Description 2",
      user1.address,
      skills,
      ethers.utils.parseEther("4"),
    );

    // Get user agreements
    const user1Agreements = await agreementContract.connect(user1).getContractorAgreementIds(user1.address);
    expect(user1Agreements.length).to.equal(1);

    const user2Agreements = await agreementContract.connect(user2).getContractorAgreementIds(user2.address);
    expect(user2Agreements.length).to.equal(1);

    // Get agreement details using agreement IDs
    const user1AgreementId = user1Agreements[0];
    const user2AgreementId = user2Agreements[0];

    const user1Agreement = await agreementContract.getAgreementById(user1AgreementId);
    const user2Agreement = await agreementContract.getAgreementById(user2AgreementId);

    expect(user1Agreement.professional).to.equal(user2.address);
    expect(user2Agreement.professional).to.equal(user1.address);
  });
  
  it("Should verify skills associated with user1's agreements", async function () {
    await agreementContract.connect(user1).createAgreement(
      "Agreement 1",
      "Description 1",
      user2.address,
      skills,
      ethers.utils.parseEther("5"),
    );
  
    const user1Agreements = await agreementContract.connect(user1).getContractorAgreementIds(user1.address);
  
    for (let agreementId of user1Agreements) {
      const agreementSkills = await agreementContract.getSkillsByAgreementId(agreementId);
      
      expect(agreementSkills.length).to.equal(skills.length);
      agreementSkills.forEach((skill, index) => {
        expect(skill.name).to.equal(skills[index].name);
        expect(skill.level).to.equal(skills[index].level);
      });
    }
  });
  
  it("Should not create agreements with total skill level exceeding 100", async function () {
    const invalidSkills = [
        { name: "Skill A", level: 60 },
        { name: "Skill B", level: 50 }
    ];

    await expect(agreementContract.connect(user1).createAgreement(
        "Invalid Agreement",
        "Description Invalid",
        user2.address,
        invalidSkills,
        ethers.utils.parseEther("5")
    )).to.be.revertedWith("Total skill level cannot exceed 100");

    const user1Agreements = await agreementContract.connect(user1).getContractorAgreementIds(user1.address);
    expect(user1Agreements.length).to.equal(0);
  });
});