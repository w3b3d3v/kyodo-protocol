const { expect } = require("chai");
const { ethers } = require("hardhat");

const TOTAL_FEE = 20; // using 1000 basis points for fee calculation
const PROTOCOL_FEE = 500; // using 1000 basis points for fee calculation
const COMMUNITY_FEE = 500; // using 1000 basis points for fee calculation
const KYODO_TREASURY_ADDRESS = process.env.NEXT_PUBLIC_KYODO_TREASURY_CONTRACT_ADDRESS
const COMMUNITY_TREASURY_ADDRESS = process.env.NEXT_PUBLIC_COMMUNITY_TREASURY_CONTRACT_ADDRESS
const FAKE_STABLE_DECIMALS = 8;

describe("PayAgreement", function () {
  let agreementContract;
  let owner;
  let developer;

  beforeEach(async function () {
    const AgreementContract = await ethers.getContractFactory("AgreementContract");
    agreementContract = await AgreementContract.deploy(KYODO_TREASURY_ADDRESS, COMMUNITY_TREASURY_ADDRESS);
    await agreementContract.deployed();

    [owner, developer, user1, user2] = await ethers.getSigners();

    const TokenContract = await ethers.getContractFactory("fakeStable");
    tokenContract = await TokenContract.deploy(ethers.utils.parseEther("1000000"), FAKE_STABLE_DECIMALS);
    paymentToken = tokenContract.address;

    await agreementContract.addAcceptedPaymentToken(tokenContract.address);
    await agreementContract.setFees(TOTAL_FEE, PROTOCOL_FEE, COMMUNITY_FEE);

    const StableVault = await ethers.getContractFactory("StableVault");
    vault = await StableVault.deploy(owner.address, "StableVaultToken", "STBLV");
    await vault.deployed();

    await agreementContract.setStableVaultAddress(vault.address);
  });

  it("Should make a payment and distribute fees", async function () {  
    const paymentAmount = ethers.utils.parseUnits("100", FAKE_STABLE_DECIMALS)

    // Create agreements using different user addresses
    await agreementContract.connect(owner).createAgreement(
      "Agreement 1",
      "Description 1",
      developer.address,
      ["Skill 1", "Skill 2"],
      paymentAmount
    );

    const initialDeveloperBalance = await tokenContract.balanceOf(developer.address);
    const initialKyodoTreasuryBalance = await tokenContract.balanceOf(KYODO_TREASURY_ADDRESS);
    const initialCommunityDAOBalance = await tokenContract.balanceOf(COMMUNITY_TREASURY_ADDRESS);
  
    const ownerAgreements = await agreementContract.connect(owner).getUserAgreements(owner.address);
    const ownerAgreementId = ownerAgreements[0];
    await tokenContract.approve(agreementContract.address, paymentAmount);
    await agreementContract.makePayment(ownerAgreementId, paymentAmount, tokenContract.address)

    const totalFeeAmount = paymentAmount.mul(TOTAL_FEE).div(1000);
    
    const finalDeveloperVaultBalance = await vault.balanceOf(developer.address);
    const finalKyodoTreasuryBalance = await tokenContract.balanceOf(KYODO_TREASURY_ADDRESS);
    const finalCommunityDAOBalance = await tokenContract.balanceOf(COMMUNITY_TREASURY_ADDRESS);
    
    let expectedDeveloperIncrease = paymentAmount.sub(paymentAmount.mul(TOTAL_FEE).div(1000)); // Subtracting the total fee
    if (FAKE_STABLE_DECIMALS !== 18) {
        const adjustFactor = ethers.BigNumber.from(10).pow(18 - FAKE_STABLE_DECIMALS);
        expectedDeveloperIncrease = expectedDeveloperIncrease.mul(adjustFactor);
    }
    
    const expectedKyodoTreasuryIncrease = totalFeeAmount.mul(PROTOCOL_FEE).div(1000);
    const expectedCommunityDAOIncrease = totalFeeAmount.mul(COMMUNITY_FEE).div(1000);
    
    expect(finalDeveloperVaultBalance).to.equal(initialDeveloperBalance.add(expectedDeveloperIncrease));
    expect(finalKyodoTreasuryBalance).to.equal(initialKyodoTreasuryBalance.add(expectedKyodoTreasuryIncrease));
    expect(finalCommunityDAOBalance).to.equal(initialCommunityDAOBalance.add(expectedCommunityDAOIncrease));
  });

  it("Should make a partial payment and distribute fees", async function () {
    const paymentAmount = ethers.utils.parseEther("100");
    const partialPaymentAmount = ethers.utils.parseEther("50");

    await expect(agreementContract.connect(owner).createAgreement(
        "Agreement 1",
        "Description 1",
        developer.address,
        ["Skill 1", "Skill 2"],
        paymentAmount,
    )).to.emit(agreementContract, 'AgreementCreated')
    .withArgs(owner.address, developer.address, 1, paymentAmount);

    const initialVaultBalance = await vault.vaultBalance();

    const initialDeveloperBalance = await tokenContract.balanceOf(developer.address);
    const initialKyodoTreasuryBalance = await tokenContract.balanceOf(KYODO_TREASURY_ADDRESS);
    const initialCommunityDAOBalance = await tokenContract.balanceOf(COMMUNITY_TREASURY_ADDRESS);

    const ownerAgreements = await agreementContract.connect(owner).getUserAgreements(owner.address);
    const ownerAgreementId = ownerAgreements[0];
    await tokenContract.approve(agreementContract.address, paymentAmount);
    await expect(agreementContract.makePayment(ownerAgreementId, partialPaymentAmount, tokenContract.address))
      .to.emit(agreementContract, 'PaymentMade')
      .withArgs(owner.address, developer.address, ownerAgreementId, partialPaymentAmount);

    const updatedAgreement = await agreementContract.getAgreementById(ownerAgreementId);
    expect(updatedAgreement.status).to.equal(0); // Still active

    const totalFeeAmount = partialPaymentAmount.mul(TOTAL_FEE).div(1000);
    
    const finalDeveloperVaultBalance = await vault.balanceOf(developer.address);
    const finalKyodoTreasuryBalance = await tokenContract.balanceOf(KYODO_TREASURY_ADDRESS);
    const finalCommunityDAOBalance = await tokenContract.balanceOf(COMMUNITY_TREASURY_ADDRESS);
    
    let expectedDeveloperIncrease = partialPaymentAmount.sub(partialPaymentAmount.mul(TOTAL_FEE).div(1000));
    if (FAKE_STABLE_DECIMALS !== 18) {
        const adjustFactor = ethers.BigNumber.from(10).pow(18 - FAKE_STABLE_DECIMALS);
        expectedDeveloperIncrease = expectedDeveloperIncrease.mul(adjustFactor);
    }
    const expectedKyodoTreasuryIncrease = totalFeeAmount.mul(PROTOCOL_FEE).div(1000);
    const expectedCommunityDAOIncrease = totalFeeAmount.mul(COMMUNITY_FEE).div(1000);
    
    expect(finalDeveloperVaultBalance).to.equal(initialDeveloperBalance.add(expectedDeveloperIncrease));
    expect(finalKyodoTreasuryBalance).to.equal(initialKyodoTreasuryBalance.add(expectedKyodoTreasuryIncrease));
    expect(finalCommunityDAOBalance).to.equal(initialCommunityDAOBalance.add(expectedCommunityDAOIncrease));

    const finalVaultBalance = await vault.vaultBalance();
    expect(finalVaultBalance).to.equal(initialVaultBalance.add(expectedDeveloperIncrease));
  });
});
