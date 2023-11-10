const { expect } = require("chai");
const { ethers } = require("hardhat");

const TOTAL_FEE = 20; // using 1000 basis points for fee calculation
const PROTOCOL_FEE = 500; // using 1000 basis points for fee calculation
const COMMUNITY_FEE = 500; // using 1000 basis points for fee calculation
const KYODO_TREASURY_ADDRESS = ethers.Wallet.createRandom().address
const COMMUNITY_TREASURY_ADDRESS = ethers.Wallet.createRandom().address
const FAKE_STABLE_DECIMALS = 18;
let = AAVE_DATA_PROVIDER = "0x0000000000000000000000000000000000000000";
let = AAVE_INCENTIVES_CONTROLLER= "0x0000000000000000000000000000000000000000"; //doesn't exist for kovan
let = AAVE_LENDING_POOL= "0x0000000000000000000000000000000000000000";

describe("PayAgreement", function () {
  let agreementContract;
  let owner;
  let developer;
  let skills;

  beforeEach(async function () {
    const AgreementContract = await ethers.getContractFactory("AgreementContract");
    agreementContract = await AgreementContract.deploy(KYODO_TREASURY_ADDRESS, COMMUNITY_TREASURY_ADDRESS);
    await agreementContract.deployed();

    [owner, developer] = await ethers.getSigners();
    skills = [
      { name: "Programming", level: 50 },
      { name: "Design", level: 50 }
    ];

    const TokenContract = await ethers.getContractFactory("fakeStable");
    tokenContract = await TokenContract.deploy(ethers.utils.parseEther("1000000"), FAKE_STABLE_DECIMALS);

    await agreementContract.addAcceptedPaymentToken(tokenContract.address);
    await agreementContract.setFees(TOTAL_FEE, PROTOCOL_FEE, COMMUNITY_FEE);
    
    const StableVault = await ethers.getContractFactory("StableVault");
    vault = await StableVault.deploy(owner.address, "StableVaultToken", "STBLV");
    await vault.deployed();
    await vault.setAaveSettings(AAVE_DATA_PROVIDER, AAVE_INCENTIVES_CONTROLLER, AAVE_LENDING_POOL);

    await agreementContract.setStableVaultAddress(vault.address);
  });

  it("Should make a payment and distribute fees", async function () {  
    const paymentAmount = ethers.utils.parseUnits("100", FAKE_STABLE_DECIMALS)

    // Create agreements using different user addresses
    const tx = await agreementContract.connect(owner).createAgreement(
      "Agreement 1",
      "Description 1",
      developer.address,
      skills,
      paymentAmount
    );

    const initialDeveloperBalance = await vault.balanceOf(developer.address);
    const initialKyodoTreasuryBalance = await vault.balanceOf(KYODO_TREASURY_ADDRESS);
    const initialCommunityDAOBalance = await vault.balanceOf(COMMUNITY_TREASURY_ADDRESS);
  
    const ownerAgreements = await agreementContract.connect(owner).getUserAgreements(owner.address);
    const ownerAgreementId = ownerAgreements[0];
    await tokenContract.approve(agreementContract.address, paymentAmount);

    await agreementContract.makePayment(ownerAgreementId, paymentAmount, tokenContract.address)

    const totalFeeAmount = paymentAmount.mul(TOTAL_FEE).div(1000);
    
    const finalDeveloperVaultBalance = await vault.balanceOf(developer.address);
    const finalKyodoTreasuryBalance = await vault.balanceOf(KYODO_TREASURY_ADDRESS);
    const finalCommunityDAOBalance = await vault.balanceOf(COMMUNITY_TREASURY_ADDRESS);

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
    const partialPaymentAmount = ethers.utils.parseUnits("50", FAKE_STABLE_DECIMALS)

    await expect(agreementContract.connect(owner).createAgreement(
        "Agreement 1",
        "Description 1",
        developer.address,
        skills,
        paymentAmount,
    )).to.emit(agreementContract, 'AgreementCreated')
    .withArgs(owner.address, developer.address, 1, paymentAmount);

    const initialVaultBalance = await vault.vaultBalance();

    const initialDeveloperBalance = await vault.balanceOf(developer.address);
    const initialKyodoTreasuryBalance = await vault.balanceOf(KYODO_TREASURY_ADDRESS);
    const initialCommunityDAOBalance = await vault.balanceOf(COMMUNITY_TREASURY_ADDRESS);

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
    const finalKyodoTreasuryBalance = await vault.balanceOf(KYODO_TREASURY_ADDRESS);
    const finalCommunityDAOBalance = await vault.balanceOf(COMMUNITY_TREASURY_ADDRESS);
    
    let expectedDeveloperIncrease = partialPaymentAmount.sub(totalFeeAmount);
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
    expect(finalVaultBalance).to.equal(initialVaultBalance.add(partialPaymentAmount));
  });
});
