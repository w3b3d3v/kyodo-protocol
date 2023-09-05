const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
const allowedTokens = require("../public/allowedTokens.json");

const TOTAL_FEE = 20; // using 1000 basis points for fee calculation
const PROTOCOL_FEE = 500; // using 1000 basis points for fee calculation
const COMMUNITY_FEE = 500; // using 1000 basis points for fee calculation


describe("PayAgreement", function () {
  let agreementContract;
  let owner;
  let user1;
  let user2;
  let developer;

  const configPath = path.join(__dirname, "../src/config.json");
  let configData = fs.readFileSync(configPath, "utf8");
  configData = JSON.parse(configData);
  const KYODO_TREASURY_ADDRESS = configData.kyodoTreasury;
  const COMMUNITY_DAO_ADDRESS = configData.communityDAO

  beforeEach(async function () {
    const AgreementContract = await ethers.getContractFactory("AgreementContract");
    agreementContract = await AgreementContract.deploy(KYODO_TREASURY_ADDRESS, COMMUNITY_DAO_ADDRESS);
    await agreementContract.deployed();

    [owner, developer, user1, user2] = await ethers.getSigners();

    // Set accepted payment tokens
    for (const token of allowedTokens) {
        await agreementContract.addAcceptedPaymentToken(token.address);
    }

    await agreementContract.setFees(TOTAL_FEE, PROTOCOL_FEE, COMMUNITY_FEE); // Example fee values
  });

  it("Should make a payment and distribute fees", async function () {  
    const paymentToken = allowedTokens[3].address;
    const TokenContract = await ethers.getContractFactory("testToken");
    const tokenContract = await TokenContract.attach(paymentToken);
    const paymentAmount = ethers.utils.parseEther("100")

    // Create agreements using different user addresses
    await agreementContract.connect(owner).createAgreement(
      "Agreement 1",
      "Description 1",
      developer.address,
      ["Skill 1", "Skill 2"],
      paymentAmount,
      paymentToken
    );

    const initialDeveloperBalance = await tokenContract.balanceOf(developer.address);
    const initialKyodoTreasuryBalance = await tokenContract.balanceOf(KYODO_TREASURY_ADDRESS);
    const initialCommunityDAOBalance = await tokenContract.balanceOf(COMMUNITY_DAO_ADDRESS);
  
    const ownerAgreements = await agreementContract.connect(owner).getUserAgreements(owner.address);
    const ownerAgreementId = ownerAgreements[0];
    await tokenContract.approve(agreementContract.address, paymentAmount);
    await agreementContract.makePayment(ownerAgreementId, paymentAmount)
  
    const updatedAgreement = await agreementContract.getAgreementById(ownerAgreementId);
    expect(updatedAgreement.status).to.equal(1); // Assuming status codes: 0 for created, 1 for paid, etc.

    const totalFeeAmount = paymentAmount.mul(TOTAL_FEE).div(1000);
    
    const finalDeveloperBalance = await tokenContract.balanceOf(developer.address);
    const finalKyodoTreasuryBalance = await tokenContract.balanceOf(KYODO_TREASURY_ADDRESS);
    const finalCommunityDAOBalance = await tokenContract.balanceOf(COMMUNITY_DAO_ADDRESS);
    
    const expectedDeveloperIncrease = paymentAmount.sub(paymentAmount.mul(TOTAL_FEE).div(1000)); // Subtracting the total fee
    const expectedKyodoTreasuryIncrease = totalFeeAmount.mul(PROTOCOL_FEE).div(1000);
    const expectedCommunityDAOIncrease = totalFeeAmount.mul(COMMUNITY_FEE).div(1000);
    
    expect(finalDeveloperBalance).to.equal(initialDeveloperBalance.add(expectedDeveloperIncrease));
    expect(finalKyodoTreasuryBalance).to.equal(initialKyodoTreasuryBalance.add(expectedKyodoTreasuryIncrease));
    expect(finalCommunityDAOBalance).to.equal(initialCommunityDAOBalance.add(expectedCommunityDAOIncrease));
  });

  it("Should make a partial payment and distribute fees", async function () {
    const paymentToken = allowedTokens[3].address;
    const TokenContract = await ethers.getContractFactory("testToken");
    const tokenContract = await TokenContract.attach(paymentToken);
    const paymentAmount = ethers.utils.parseEther("100");
    const partialPaymentAmount = ethers.utils.parseEther("50");

    await agreementContract.connect(owner).createAgreement(
        "Agreement 1",
        "Description 1",
        developer.address,
        ["Skill 1", "Skill 2"],
        paymentAmount,
        paymentToken
    );

    const initialDeveloperBalance = await tokenContract.balanceOf(developer.address);
    const initialKyodoTreasuryBalance = await tokenContract.balanceOf(KYODO_TREASURY_ADDRESS);
    const initialCommunityDAOBalance = await tokenContract.balanceOf(COMMUNITY_DAO_ADDRESS);

    const ownerAgreements = await agreementContract.connect(owner).getUserAgreements(owner.address);
    const ownerAgreementId = ownerAgreements[0];
    await tokenContract.approve(agreementContract.address, paymentAmount);
    await agreementContract.makePayment(ownerAgreementId, partialPaymentAmount);

    const updatedAgreement = await agreementContract.getAgreementById(ownerAgreementId);
    expect(updatedAgreement.status).to.equal(0); // Still active

    const totalFeeAmount = partialPaymentAmount.mul(TOTAL_FEE).div(1000);
    
    const finalDeveloperBalance = await tokenContract.balanceOf(developer.address);
    const finalKyodoTreasuryBalance = await tokenContract.balanceOf(KYODO_TREASURY_ADDRESS);
    const finalCommunityDAOBalance = await tokenContract.balanceOf(COMMUNITY_DAO_ADDRESS);
    
    const expectedDeveloperIncrease = partialPaymentAmount.sub(partialPaymentAmount.mul(TOTAL_FEE).div(1000));
    const expectedKyodoTreasuryIncrease = totalFeeAmount.mul(PROTOCOL_FEE).div(1000);
    const expectedCommunityDAOIncrease = totalFeeAmount.mul(COMMUNITY_FEE).div(1000);
    
    expect(finalDeveloperBalance).to.equal(initialDeveloperBalance.add(expectedDeveloperIncrease));
    expect(finalKyodoTreasuryBalance).to.equal(initialKyodoTreasuryBalance.add(expectedKyodoTreasuryIncrease));
    expect(finalCommunityDAOBalance).to.equal(initialCommunityDAOBalance.add(expectedCommunityDAOIncrease));
  });
});
