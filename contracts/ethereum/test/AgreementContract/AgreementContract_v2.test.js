const { ethers, deployments, getNamedAccounts } = require("hardhat");
const { expect, assert } = require("chai");

const setup = deployments.createFixture(async () => {
    await deployments.fixture(['AgreementContract']);
    const { deployer, user1, user2 } = await getNamedAccounts();
    const skills = [
        { name: "Programming", level: 50 },
        { name: "Design", level: 50 }
    ];

    return {
        DeployerUser: {
            address: deployer,
            AgreementContract: await ethers.getContract('AgreementContract', deployer),
        },
        Company: {
            address: user1,
            AgreementContract: await ethers.getContract('AgreementContract', user1),
        },
        Employee: {
            address: user2,
            AgreementContract: await ethers.getContract('AgreementContract', user2),
        },
        skills,
    }
});

describe('AgreementContract', () => {
    it('Add acceptedPaymentToken should only set using owner', async function () {
        const { DeployerUser, Company } = await setup();
        await DeployerUser.AgreementContract.addAcceptedPaymentToken("0x779877A7B0D9E8603169DdbD7836e478b4624789");
        let address = await DeployerUser.AgreementContract.getAcceptedPaymentTokens();
        assert(address == "0x779877A7B0D9E8603169DdbD7836e478b4624789");
        try {
            await Company.AgreementContract.addAcceptedPaymentToken("0x779877A7B0D9E8603169DdbD7836e478b4624780");
        } catch (err) {
            assert(err);
        }

        address = await DeployerUser.AgreementContract.getAcceptedPaymentTokens();
        assert(address == "0x779877A7B0D9E8603169DdbD7836e478b4624789");
    });

    it('Should create a new agreement with authorized tokens', async function () {
        const { Company, Employee, skills } = await setup();
        const paymentAmount = ethers.parseEther("5");
        await Company.AgreementContract.createAgreement(
            "Test Agreement",
            "This is a test agreement",
            Employee.address,
            skills,
            paymentAmount
        )
        const agreementCount = await Company.AgreementContract.getAgreementCount();
        expect(agreementCount).to.equal(1);
    });
});