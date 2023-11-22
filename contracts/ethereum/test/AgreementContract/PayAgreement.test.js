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
  let owner;
  let developer;
  let skills;

  beforeEach(async function () {
    const AgreementContract = await ethers.getContractFactory("AgreementContract");
    const {deployer, kyodoTreasury, communityTreasury} = await getNamedAccounts();
    agreementContract = await AgreementContract.deploy(kyodoTreasury, communityTreasury, deployer);
    await agreementContract.deployed();

    [owner] = await ethers.getSigners();
    developer = ethers.Wallet.createRandom()
    skills = [
      { name: "Programming", level: 50 },
      { name: "Design", level: 50 }
    ];

    const TokenContract = await ethers.getContractFactory("fakeStable");
    tokenContract = await TokenContract.deploy(ethers.utils.parseEther("1000000"), FAKE_STABLE_DECIMALS);

    await agreementContract.addAcceptedPaymentToken(tokenContract.address);
    await agreementContract.setFees(TOTAL_FEE, PROTOCOL_FEE, COMMUNITY_FEE);
  });

  it("Should make a payment and distribute fees", async function () {  
    const {kyodoTreasury, communityTreasury} = await getNamedAccounts();
    const paymentAmount = ethers.utils.parseUnits("100", FAKE_STABLE_DECIMALS)

    // Create agreements using different user addresses
    const tx = await agreementContract.connect(owner).createAgreement(
      "Agreement 1",
      "Description 1",
      developer.address,
      skills,
      paymentAmount
    );

    const initialDeveloperBalance = await tokenContract.balanceOf(developer.address);
    const initialKyodoTreasuryBalance = await tokenContract.balanceOf(kyodoTreasury);
    const initialCommunityDAOBalance = await tokenContract.balanceOf(communityTreasury);
  
    const ownerAgreements = await agreementContract.connect(owner).getContractorAgreementIds(owner.address);
    const ownerAgreementId = ownerAgreements[0];

    const totalFeeAmount = paymentAmount.mul(TOTAL_FEE).div(1000);
    const totalAmountIncludingFee = paymentAmount.add(totalFeeAmount);

    await tokenContract.approve(agreementContract.address, totalAmountIncludingFee);
    await agreementContract.makePayment(ownerAgreementId, paymentAmount, tokenContract.address)

    const finalDeveloperBalance = await tokenContract.balanceOf(developer.address);
    const finalKyodoTreasuryBalance = await tokenContract.balanceOf(kyodoTreasury);
    const finalCommunityDAOBalance = await tokenContract.balanceOf(communityTreasury);

    const expectedDeveloperIncrease = paymentAmount;
    const expectedKyodoTreasuryIncrease = totalFeeAmount.mul(PROTOCOL_FEE).div(1000);
    const expectedCommunityDAOIncrease = totalFeeAmount.mul(COMMUNITY_FEE).div(1000);
    
    expect(finalDeveloperBalance).to.equal(initialDeveloperBalance.add(expectedDeveloperIncrease));
    expect(finalKyodoTreasuryBalance).to.equal(initialKyodoTreasuryBalance.add(expectedKyodoTreasuryIncrease));
    expect(finalCommunityDAOBalance).to.equal(initialCommunityDAOBalance.add(expectedCommunityDAOIncrease));
  });

  xit("Should make a partial payment and distribute fees", async function () {
    const {kyodoTreasury, communityTreasury} = await getNamedAccounts();
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

    const initialDeveloperBalance = await tokenContract.balanceOf(developer.address);
    const initialKyodoTreasuryBalance = await tokenContract.balanceOf(kyodoTreasury);
    const initialCommunityDAOBalance = await tokenContract.balanceOf(communityTreasury);

    const ownerAgreements = await agreementContract.connect(owner).getContractorAgreementIds(owner.address);
    const ownerAgreementId = ownerAgreements[0];
    await tokenContract.approve(agreementContract.address, paymentAmount);
    await expect(agreementContract.makePayment(ownerAgreementId, partialPaymentAmount, tokenContract.address))
      .to.emit(agreementContract, 'PaymentMade')
      .withArgs(owner.address, developer.address, ownerAgreementId, partialPaymentAmount);

    const updatedAgreement = await agreementContract.getAgreementById(ownerAgreementId);
    expect(updatedAgreement.status).to.equal(0); // Still active

    const totalFeeAmount = partialPaymentAmount.mul(TOTAL_FEE).div(1000);
    
    const finalDeveloperBalance = await tokenContract.balanceOf(developer.address);
    const finalKyodoTreasuryBalance = await tokenContract.balanceOf(kyodoTreasury);
    const finalCommunityDAOBalance = await tokenContract.balanceOf(communityTreasury);
    
    let expectedDeveloperIncrease = partialPaymentAmount.sub(totalFeeAmount);
    if (FAKE_STABLE_DECIMALS !== 18) {
        const adjustFactor = ethers.BigNumber.from(10).pow(18 - FAKE_STABLE_DECIMALS);
        expectedDeveloperIncrease = expectedDeveloperIncrease.mul(adjustFactor);
    }
    const expectedKyodoTreasuryIncrease = totalFeeAmount.mul(PROTOCOL_FEE).div(1000);
    const expectedCommunityDAOIncrease = totalFeeAmount.mul(COMMUNITY_FEE).div(1000);
    
    expect(finalDeveloperBalance).to.equal(initialDeveloperBalance.add(expectedDeveloperIncrease));
    expect(finalKyodoTreasuryBalance).to.equal(initialKyodoTreasuryBalance.add(expectedKyodoTreasuryIncrease));
    expect(finalCommunityDAOBalance).to.equal(initialCommunityDAOBalance.add(expectedCommunityDAOIncrease));
  });
});