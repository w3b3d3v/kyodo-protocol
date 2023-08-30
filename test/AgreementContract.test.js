const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AgreementContract", function () {
  it("Should create a new agreement", async function () {
    const AgreementContract = await ethers.getContractFactory("AgreementContract");
    const agreementContract = await AgreementContract.deploy();
    await agreementContract.deployed();

    const developer = "0x988d8063f521aa948FEc4AC1a4EDa72a5BdCBFb0";
    const incentiveToken = "0x8ca4528D876eDa758B829FBDDB9a4811D7DB959D";
    const paymentToken = "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e";

    const skills = ["JavaScript", "Solidity"];
    const incentiveAmount = ethers.utils.parseEther("10");
    const paymentAmount = ethers.utils.parseEther("5");

    await agreementContract.createAgreement(
      "Test Agreement",
      "This is a test agreement",
      developer,
      skills,
      incentiveAmount,
      incentiveToken,
      paymentAmount,
      paymentToken
    );

    const agreementCount = await agreementContract.getAgreementCount();
    expect(agreementCount).to.equal(1);

    const agreements = await agreementContract.getAllAgreements();
    expect(agreements[0].title).to.equal("Test Agreement");
    expect(agreements[0].developer).to.equal(developer);
    expect(agreements[0].skills).to.deep.equal(skills);
    expect(agreements[0].tokenIncentive.amount).to.equal(incentiveAmount);
    expect(agreements[0].tokenIncentive.tokenAddress).to.equal(incentiveToken);
    expect(agreements[0].payment.amount).to.equal(paymentAmount);
    expect(agreements[0].payment.tokenAddress).to.equal(paymentToken);

    console.log("agreements: " + JSON.stringify(agreements));
  });
});
