const { expect } = require("chai");
const { ethers, getNamedAccounts } = require("hardhat");

const TOTAL_FEE = 20; // using 1000 basis points for fee calculation
const PROTOCOL_FEE = 500; // using 1000 basis points for fee calculation
const COMMUNITY_FEE = 500; // using 1000 basis points for fee calculation
const FAKE_STABLE_DECIMALS = 18;
let = AAVE_DATA_PROVIDER = "0x0000000000000000000000000000000000000000";
let = AAVE_INCENTIVES_CONTROLLER= "0x0000000000000000000000000000000000000000"; //doesn't exist for kovan
let = AAVE_LENDING_POOL= "0x0000000000000000000000000000000000000000";

describe("PayAgreement", function () {
  let agreementContract;
  let admin;
  let developer;
  let skills;

  beforeEach(async function () {
    const AgreementContract = await ethers.getContractFactory("AgreementContract");
    const {deployer, kyodoTreasury, communityTreasury} = await getNamedAccounts();
    agreementContract = await AgreementContract.deploy(kyodoTreasury, communityTreasury, deployer);
    await agreementContract.deployed();

    skills = [
      { name: "Programming", level: 50 },
      { name: "Design", level: 50 }
    ];

    const TokenContract = await ethers.getContractFactory("fakeStable");
    tokenContract = await TokenContract.deploy(ethers.utils.parseEther("1000000"), FAKE_STABLE_DECIMALS);

    await agreementContract.addAcceptedPaymentToken(tokenContract.address);
    await agreementContract.setFees(TOTAL_FEE, PROTOCOL_FEE, COMMUNITY_FEE);
    
    const StableVault = await ethers.getContractFactory("StableVault");
    vault = await StableVault.deploy(admin.address, "StableVaultToken", "STBLV");
    await vault.deployed();
    await vault.setAaveSettings(AAVE_DATA_PROVIDER, AAVE_INCENTIVES_CONTROLLER, AAVE_LENDING_POOL);

    await agreementContract.setStableVaultAddress(vault.address);
  });

  it("Should make a payment and distribute fees", async function () {  
    const {kyodoTreasury, communityTreasury} = await getNamedAccounts();
    const paymentAmount = ethers.utils.parseUnits("100", FAKE_STABLE_DECIMALS)

    // Create agreements using different user addresses
    const tx = await agreementContract.connect(admin).createAgreement(
      "Agreement 1",
      "Description 1",
      developer.address,
      skills,
      paymentAmount
    );

    const initialDeveloperBalance = await vault.balanceOf(developer.address);
    const initialKyodoTreasuryBalance = await vault.balanceOf(kyodoTreasury);
    const initialCommunityDAOBalance = await vault.balanceOf(communityTreasury);
  
    const adminAgreements = await agreementContract.connect(admin).getContractorAgreements(admin.address);
    const adminAgreementId = adminAgreements[0];
    await tokenContract.approve(agreementContract.address, paymentAmount);

    await agreementContract.makePayment(adminAgreementId, paymentAmount, tokenContract.address)

    const totalFeeAmount = paymentAmount.mul(TOTAL_FEE).div(1000);
    
    const finalDeveloperVaultBalance = await vault.balanceOf(developer.address);
    const finalKyodoTreasuryBalance = await vault.balanceOf(kyodoTreasury);
    const finalCommunityDAOBalance = await vault.balanceOf(communityTreasury);

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
    const {kyodoTreasury, communityTreasury} = await getNamedAccounts();
    const paymentAmount = ethers.utils.parseEther("100");
    const partialPaymentAmount = ethers.utils.parseUnits("50", FAKE_STABLE_DECIMALS)

    await expect(agreementContract.connect(admin).createAgreement(
        "Agreement 1",
        "Description 1",
        developer.address,
        skills,
        paymentAmount,
    )).to.emit(agreementContract, 'AgreementCreated')
    .withArgs(admin.address, developer.address, 1, paymentAmount);

    const initialVaultBalance = await vault.vaultBalance();

    const initialDeveloperBalance = await vault.balanceOf(developer.address);
    const initialKyodoTreasuryBalance = await vault.balanceOf(kyodoTreasury);
    const initialCommunityDAOBalance = await vault.balanceOf(communityTreasury);

    const adminAgreements = await agreementContract.connect(admin).getContractorAgreements(admin.address);
    const adminAgreementId = adminAgreements[0];
    await tokenContract.approve(agreementContract.address, paymentAmount);
    await expect(agreementContract.makePayment(adminAgreementId, partialPaymentAmount, tokenContract.address))
      .to.emit(agreementContract, 'PaymentMade')
      .withArgs(admin.address, developer.address, adminAgreementId, partialPaymentAmount);

    const updatedAgreement = await agreementContract.getAgreementById(adminAgreementId);
    expect(updatedAgreement.status).to.equal(0); // Still active

    const totalFeeAmount = partialPaymentAmount.mul(TOTAL_FEE).div(1000);
    
    const finalDeveloperVaultBalance = await vault.balanceOf(developer.address);
    const finalKyodoTreasuryBalance = await vault.balanceOf(kyodoTreasury);
    const finalCommunityDAOBalance = await vault.balanceOf(communityTreasury);
    
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
