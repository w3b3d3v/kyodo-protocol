const { expect } = require("chai");
const { ethers } = require("hardhat");

const FAKE_STABLE_DECIMALS = 18;

describe("W3DVault", function () {
    let W3DStableVault, w3dVault, Token, token, admin, user1, user2;

    beforeEach(async function () {
    // Contract deployment
    W3DStableVault = await ethers.getContractFactory("W3DStableVault");
    [admin, user1, user2] = await ethers.getSigners();
    w3dVault = await W3DStableVault.deploy(admin.address, "W3DStableVaultToken", "W3DSV");
    await w3dVault.deployed();

    // Deploy mock token
    Token = await ethers.getContractFactory("testToken");
    token = await Token.deploy(ethers.utils.parseEther("1000000"), FAKE_STABLE_DECIMALS); // 1 million tokens
    await token.deployed();

        // Transfer some tokens from admin to user1 and user2
    await token.connect(admin).transfer(user1.address, ethers.utils.parseEther("100")); // Transfer 100 tokens to user1
    await token.connect(admin).transfer(user2.address, ethers.utils.parseEther("100")); // Transfer 100 tokens to user2


    // Approve the W3DStableVault contract to spend tokens on behalf of user1
    await token.connect(user1).approve(w3dVault.address, ethers.utils.parseEther("1000")); // Approve 1000 tokens
    });

    describe("Withdraw", function () {
        it("Should allow a user to make a withdrawal", async function () {
            const depositAmount = ethers.utils.parseUnits("1", FAKE_STABLE_DECIMALS); // 1 token with 8 decimals
            const expectedVaultAmount = ethers.utils.parseUnits("1", 18); // Expected to be 1 token but with 18 decimals

            // First, the user deposits
            await w3dVault.connect(user1).deposit(depositAmount, token.address, user1.address);
            const userBalanceBeforeWithdraw = await w3dVault.balanceOf(user1.address);
            expect(userBalanceBeforeWithdraw).to.equal(expectedVaultAmount);

            // Now, the user withdraws
            await w3dVault.connect(user1).withdraw(depositAmount, token.address);
            const userBalanceAfterWithdraw = await w3dVault.balanceOf(user1.address);
            expect(userBalanceAfterWithdraw).to.equal(0); // Assuming the user withdraws all their funds

            await w3dVault.connect(user1).deposit(depositAmount, token.address, user1.address);
            await expect(w3dVault.connect(user1).withdraw(depositAmount, token.address))
                .to.emit(w3dVault, "BalanceUpdated")
                .withArgs(depositAmount);
        });

        it("Should fail if the user tries to withdraw more than their balance", async function () {
            const depositAmount = ethers.utils.parseUnits("1", FAKE_STABLE_DECIMALS); // 1 token with 8 decimals
            const overdrawAmount = ethers.utils.parseUnits("2", FAKE_STABLE_DECIMALS); // 2 tokens with 8 decimals

            // First, the user deposits
            await w3dVault.connect(user1).deposit(depositAmount, token.address, user1.address);

            // Now, the user tries to overdraw
            await expect(w3dVault.connect(user1).withdraw(overdrawAmount, token.address)).to.be.revertedWith("Insufficient balance");
        });

        it("Should fail if the contract is paused", async function () {
            await w3dVault.connect(admin).pause(); // Assuming you have a pause function

            const amount = ethers.utils.parseEther("1");

            await expect(w3dVault.connect(user1).withdraw(amount, token.address)).to.be.revertedWith("Pausable: paused");
        });
    });
});