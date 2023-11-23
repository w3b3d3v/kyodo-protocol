const { ethers, deployments, getNamedAccounts, network } = require("hardhat");
const { expect, assert } = require("chai");
const { chainConfigs } = require('../../scripts/utils/chain_config');

const setup = deployments.createFixture(async () => {
    await deployments.fixture(['AgreementContract']);
    
    const { deployer, user1, user2 } = await getNamedAccounts();
    
    let { token } = chainConfigs[network.name];
    const skills = [
        { name: "Programming", level: 50 },
        { name: "Design", level: 50 }
    ];

    if(network.name == "hardhat") {
        await deployments.fixture(['FakeStable']);
        const FakeStable = await ethers.getContract('FakeStable');
        token = FakeStable.target;
    }

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
        FAKE_TOKEN_1: token,
    }
});

describe('AgreementContract', () => {
    it('Add acceptedPaymentToken should only set using owner', async function () {
        const { DeployerUser, Company, FAKE_TOKEN_1 } = await setup();
        await DeployerUser.AgreementContract.addAcceptedPaymentToken(FAKE_TOKEN_1);
        let address = await DeployerUser.AgreementContract.getAcceptedPaymentTokens();
        assert(address == FAKE_TOKEN_1);
        try {
            await Company.AgreementContract.addAcceptedPaymentToken(FAKE_TOKEN_1);
        } catch (err) {
            assert(err);
        }
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

    it('Should fail if the professional is the same as company', async function () {
        const { Company, skills } = await setup();
        const paymentAmount = ethers.parseEther("5");
        await expect(Company.AgreementContract.createAgreement(
            "Test Agreement",
            "This is a test agreement",
            Company.address,
            skills,
            paymentAmount
        )).to.be.revertedWith("Professional address cannot be the same as company");
    });
});