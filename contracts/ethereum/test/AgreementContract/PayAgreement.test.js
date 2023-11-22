const { expect } = require("chai");
const { ethers, getNamedAccounts } = require("hardhat");

const PROTOCOL_FEE = 0; // using 1000 basis points for fee calculation
const COMMUNITY_FEE = 0; // using 1000 basis points for fee calculation
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
    await agreementContract.setFees(PROTOCOL_FEE, COMMUNITY_FEE);
  });

  it("Should make a payment and distribute fees", async function () {  
    const { kyodoTreasury, communityTreasury } = await getNamedAccounts();
    const paymentAmount = ethers.utils.parseUnits("100", FAKE_STABLE_DECIMALS);

    // Create agreements using different user addresses
    await agreementContract.connect(owner).createAgreement(
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

    // Calculando as taxas
    const kyodoTreasuryShare = paymentAmount.mul(PROTOCOL_FEE).div(1000);
    const communityDAOShare = paymentAmount.mul(COMMUNITY_FEE).div(1000);
    const totalAmountIncludingFee = paymentAmount.add(kyodoTreasuryShare).add(communityDAOShare);

    await tokenContract.approve(agreementContract.address, totalAmountIncludingFee);
    await agreementContract.makePayment(ownerAgreementId, paymentAmount, tokenContract.address);

    const finalDeveloperBalance = await tokenContract.balanceOf(developer.address);
    const finalKyodoTreasuryBalance = await tokenContract.balanceOf(kyodoTreasury);
    const finalCommunityDAOBalance = await tokenContract.balanceOf(communityTreasury);

    expect(finalDeveloperBalance).to.equal(initialDeveloperBalance.add(paymentAmount));
    expect(finalKyodoTreasuryBalance).to.equal(initialKyodoTreasuryBalance.add(kyodoTreasuryShare));
    expect(finalCommunityDAOBalance).to.equal(initialCommunityDAOBalance.add(communityDAOShare));
  });

  it("Should make a partial payment and distribute fees", async function () {
    const { kyodoTreasury, communityTreasury } = await getNamedAccounts();
    const paymentAmount = ethers.utils.parseEther("100");
    const partialPaymentAmount = ethers.utils.parseUnits("50", FAKE_STABLE_DECIMALS);

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

    const kyodoTreasuryShare = partialPaymentAmount.mul(PROTOCOL_FEE).div(1000);
    const communityDAOShare = partialPaymentAmount.mul(COMMUNITY_FEE).div(1000);
    const totalAmountIncludingFee = partialPaymentAmount.add(kyodoTreasuryShare).add(communityDAOShare);

    await tokenContract.approve(agreementContract.address, totalAmountIncludingFee);
    await expect(agreementContract.makePayment(ownerAgreementId, partialPaymentAmount, tokenContract.address))
      .to.emit(agreementContract, 'PaymentMade')
      .withArgs(owner.address, developer.address, ownerAgreementId, partialPaymentAmount);

    const finalDeveloperBalance = await tokenContract.balanceOf(developer.address);
    const finalKyodoTreasuryBalance = await tokenContract.balanceOf(kyodoTreasury);
    const finalCommunityDAOBalance = await tokenContract.balanceOf(communityTreasury);
    
    expect(finalDeveloperBalance).to.equal(initialDeveloperBalance.add(partialPaymentAmount));
    expect(finalKyodoTreasuryBalance).to.equal(initialKyodoTreasuryBalance.add(kyodoTreasuryShare));
    expect(finalCommunityDAOBalance).to.equal(initialCommunityDAOBalance.add(communityDAOShare));
  });

});