const { expect } = require("chai");
const { ethers, getNamedAccounts } = require("hardhat");

const PROTOCOL_FEE = 10; // 1% in 1000 basis points
const FAKE_STABLE_DECIMALS = 18;

describe("PayAgreement", function () {
  let agreementContract;
  let owner;
  let developer;
  let skills;

  beforeEach(async function () {
    const AgreementContract = await ethers.getContractFactory("AgreementContract");
    const {deployer, kyodoTreasury} = await getNamedAccounts();
    agreementContract = await AgreementContract.deploy(kyodoTreasury, PROTOCOL_FEE, deployer);
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
  });

  it("Should make a payment and distribute fees", async function () {  
    const { kyodoTreasury } = await getNamedAccounts();
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

    const ownerAgreements = await agreementContract.connect(owner).getContractorAgreementIds(owner.address);
    const ownerAgreementId = ownerAgreements[0];

    const kyodoTreasuryShare = paymentAmount.mul(PROTOCOL_FEE).div(1000);
    const totalAmountIncludingFee = paymentAmount.add(kyodoTreasuryShare)

    await tokenContract.approve(agreementContract.address, totalAmountIncludingFee);
    await agreementContract.makePayment([ownerAgreementId], [paymentAmount], tokenContract.address);

    const finalDeveloperBalance = await tokenContract.balanceOf(developer.address);
    const finalKyodoTreasuryBalance = await tokenContract.balanceOf(kyodoTreasury);

    expect(finalDeveloperBalance).to.equal(initialDeveloperBalance.add(paymentAmount));
    expect(finalKyodoTreasuryBalance).to.equal(initialKyodoTreasuryBalance.add(kyodoTreasuryShare));
  });

  it("Should make a partial payment and distribute fees", async function () {
    const { kyodoTreasury } = await getNamedAccounts();
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

    const ownerAgreements = await agreementContract.connect(owner).getContractorAgreementIds(owner.address);
    const ownerAgreementId = ownerAgreements[0];

    const kyodoTreasuryShare = partialPaymentAmount.mul(PROTOCOL_FEE).div(1000);
    const totalAmountIncludingFee = partialPaymentAmount.add(kyodoTreasuryShare)

    await tokenContract.approve(agreementContract.address, totalAmountIncludingFee);
    await expect(agreementContract.makePayment([ownerAgreementId], [partialPaymentAmount], tokenContract.address))
      .to.emit(agreementContract, 'PaymentMade')
      .withArgs(owner.address, developer.address, ownerAgreementId, partialPaymentAmount);

    const finalDeveloperBalance = await tokenContract.balanceOf(developer.address);
    const finalKyodoTreasuryBalance = await tokenContract.balanceOf(kyodoTreasury);
    
    expect(finalDeveloperBalance).to.equal(initialDeveloperBalance.add(partialPaymentAmount));
    expect(finalKyodoTreasuryBalance).to.equal(initialKyodoTreasuryBalance.add(kyodoTreasuryShare));
  });

  it("Should make full payments for a list of agreements", async function () {
    await agreementContract.connect(owner).createAgreement(
        "Agreement 1",
        "Description 1",
        developer.address,
        skills,
        ethers.utils.parseEther("100")
    );
    await agreementContract.connect(owner).createAgreement(
        "Agreement 2",
        "Description 2",
        developer.address,
        skills,
        ethers.utils.parseEther("150")
    );

    const ownerAgreements = await agreementContract.connect(owner).getContractorAgreementIds(owner.address);

    const paymentAmounts = [ethers.utils.parseEther("100"), ethers.utils.parseEther("150")];
    let totalAmountIncludingFee = ethers.BigNumber.from(0);

    for (let amount of paymentAmounts) {
        const kyodoTreasuryShare = amount.mul(PROTOCOL_FEE).div(1000);
        totalAmountIncludingFee = totalAmountIncludingFee.add(amount.add(kyodoTreasuryShare));
    }

    await tokenContract.approve(agreementContract.address, totalAmountIncludingFee);

    await expect(agreementContract.makePayment(ownerAgreements, paymentAmounts, tokenContract.address))
        .to.emit(agreementContract, 'PaymentMade')
        .withArgs(owner.address, developer.address, ownerAgreements[0], paymentAmounts[0])
        .to.emit(agreementContract, 'PaymentMade')
        .withArgs(owner.address, developer.address, ownerAgreements[1], paymentAmounts[1]);
  });

  it("Should make full and partial payments for a list of agreements", async function () {
    await agreementContract.connect(owner).createAgreement(
        "Agreement 1",
        "Description 1",
        developer.address,
        skills,
        ethers.utils.parseEther("100")
    );
    await agreementContract.connect(owner).createAgreement(
        "Agreement 2",
        "Description 2",
        developer.address,
        skills,
        ethers.utils.parseEther("150")
    );

    const ownerAgreements = await agreementContract.connect(owner).getContractorAgreementIds(owner.address);
    const agreementIds = [ownerAgreements[0], ownerAgreements[1]];

    const fullPaymentAmount = ethers.utils.parseEther("100");
    const partialPaymentAmount = ethers.utils.parseEther("50");
    const paymentAmounts = [fullPaymentAmount, partialPaymentAmount];
    let totalAmountIncludingFee = ethers.BigNumber.from(0);

    for (let amount of paymentAmounts) {
        const kyodoTreasuryShare = amount.mul(PROTOCOL_FEE).div(1000);
        totalAmountIncludingFee = totalAmountIncludingFee.add(amount.add(kyodoTreasuryShare));
    }

    await tokenContract.approve(agreementContract.address, totalAmountIncludingFee);

    await expect(agreementContract.makePayment(agreementIds, paymentAmounts, tokenContract.address))
        .to.emit(agreementContract, 'PaymentMade')
        .withArgs(owner.address, developer.address, agreementIds[0], fullPaymentAmount)
        .to.emit(agreementContract, 'PaymentMade')
        .withArgs(owner.address, developer.address, agreementIds[1], partialPaymentAmount);
  }); 
});