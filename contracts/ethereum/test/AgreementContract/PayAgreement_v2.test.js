const { ethers, deployments, getNamedAccounts, network } = require("hardhat");
const { expect, assert } = require("chai");
const { chainConfigs } = require('../../scripts/utils/chain_config');

const setup = deployments.createFixture(async () => {
    await deployments.fixture(['AgreementContract']);
    const { deployer, user1, user2, user3, user4 } = await getNamedAccounts();
    let { token, feePercentage, kyodoTreasuryFee, communityDAOFee  } = chainConfigs[network.name];
    const skills = [
        { name: "Programming", level: 50 },
        { name: "Design", level: 50 }
    ];

    await deployments.fixture(['FakeStable']);
    const fakeStable = await ethers.getContract('FakeStable', deployer);

    if(network.name == "hardhat") {
        await fakeStable.transfer(user1, ethers.parseEther("50"));
        await fakeStable.transfer(user2, ethers.parseEther("50"));
        token = fakeStable.target;
    }

    const agreementContractInstance = await ethers.getContract('AgreementContract', deployer);
    await agreementContractInstance.setFees(feePercentage, kyodoTreasuryFee, communityDAOFee);
    await agreementContractInstance.addAcceptedPaymentToken(token);

    return {
        DeployerUser: {
            address: deployer,
            AgreementContract: agreementContractInstance,
            FakeStable: fakeStable,
        },
        Company1: {
            address: user1,
            AgreementContract: await ethers.getContract('AgreementContract', user1),
            FakeStable: await ethers.getContract('FakeStable', user1),
        },
        Company2: {
            address: user2,
            AgreementContract: await ethers.getContract('AgreementContract', user2),
            FakeStable: await ethers.getContract('FakeStable', user2),
        },
        Employee1: {
            address: user3,
            AgreementContract: await ethers.getContract('AgreementContract', user3),
            FakeStable: await ethers.getContract('FakeStable', user3),
        },
        Employee2: {
            address: user4,
            AgreementContract: await ethers.getContract('AgreementContract', user4),
            FakeStable: await ethers.getContract('FakeStable', user4),
        },
        skills,
        FAKE_TOKEN: token,
    }
});

describe("PayAgreement", function () {
    it("Should make a payment and distribute fees", async function () {
        const { DeployerUser, Company1, Company2, Employee1, FAKE_TOKEN, skills} = await setup();
        const paymentAmount = ethers.parseEther("5");
        await Company1.AgreementContract.createAgreement(
            "Test Agreement",
            "This is a test agreement",
            Employee1.address,
            skills,
            paymentAmount
        );

        await Company1.FakeStable.approve(Company1.AgreementContract.target, paymentAmount);
        const company1Agreements = await Company1.AgreementContract.getContractorAgreementIds(Company1.address);
        await Company1.AgreementContract.makePayment(company1Agreements[0], paymentAmount, FAKE_TOKEN);
    });

    it("Should make a partial payment and distribute fees", async function () {

    });
});