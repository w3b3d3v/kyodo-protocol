const { ethers, deployments, getUnnamedAccounts, getNamedAccounts } = require("hardhat");

const setup = deployments.createFixture(async () => {
    await deployments.fixture(['AgreementContract']);
    const { deployer, user1, user2 } = await getNamedAccounts();

    return {
        DeployerUser: {
            address: deployer,
            AgreementContract: await ethers.getContract('AgreementContract', deployer),
        },
        User1: {
            address: user1,
            AgreementContract: await ethers.getContract('AgreementContract', user1),
        },
        User2: {
            address: user2,
            AgreementContract: await ethers.getContract('AgreementContract', user2),
        },
    }
});

describe('AgreementContract', () => {
    it('testing 1 2 3', async function () {
        const { DeployerUser, User1, User2 } = await setup();
        // await DeployerUser.AgreementContract.addAcceptedPaymentToken("0x779877A7B0D9E8603169DdbD7836e478b4624789");
        await DeployerUser.AgreementContract.addAcceptedPaymentToken("0x779877A7B0D9E8603169DdbD7836e478b4624789");
    });
});