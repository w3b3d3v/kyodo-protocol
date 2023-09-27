const { expect } = require("chai");
const { ethers } = require("hardhat");

const FAKE_STABLE_DECIMALS = 18;

describe("vault", function () {
    let StableVault, vault, Token, token, admin, user1, user2;

    beforeEach(async function () {
    // Contract deployment
    StableVault = await ethers.getContractFactory("StableVault");
    [admin, user1, user2] = await ethers.getSigners();
    vault = await StableVault.deploy(admin.address, "StableVaultToken", "STBLV");
    await vault.deployed();

    // Deploy mock token
    Token = await ethers.getContractFactory("fakeStable");
    token = await Token.deploy(ethers.utils.parseEther("1000000"), FAKE_STABLE_DECIMALS); // 1 million tokens
    await token.deployed();

        // Transfer some tokens from admin to user1 and user2
    await token.connect(admin).transfer(user1.address, ethers.utils.parseEther("100")); // Transfer 100 tokens to user1
    await token.connect(admin).transfer(user2.address, ethers.utils.parseEther("100")); // Transfer 100 tokens to user2


    // Approve the StableVault contract to spend tokens on behalf of user1
    await token.connect(user1).approve(vault.address, ethers.utils.parseEther("1000")); // Approve 1000 tokens
    });

    describe("Withdraw", function () {
        it("Should allow a user to make a withdrawal", async function () {
            const depositAmount = ethers.utils.parseUnits("1", FAKE_STABLE_DECIMALS); // 1 token with 8 decimals
            const expectedVaultAmount = ethers.utils.parseUnits("1", 18); // Expected to be 1 token but with 18 decimals

            // First, the user deposits
            await vault.connect(user1).deposit(depositAmount, token.address, user1.address);
            const userBalanceBeforeWithdraw = await vault.balanceOf(user1.address);
            expect(userBalanceBeforeWithdraw).to.equal(expectedVaultAmount);

            // Now, the user withdraws
            await vault.connect(user1).withdraw(depositAmount, token.address);
            const userBalanceAfterWithdraw = await vault.balanceOf(user1.address);
            expect(userBalanceAfterWithdraw).to.equal(0); // Assuming the user withdraws all their funds

            await vault.connect(user1).deposit(depositAmount, token.address, user1.address);
            await expect(vault.connect(user1).withdraw(depositAmount, token.address))
                .to.emit(vault, "BalanceUpdated")
                .withArgs(depositAmount);
        });

        it("Should fail if the user tries to withdraw more than their balance", async function () {
            const depositAmount = ethers.utils.parseUnits("1", FAKE_STABLE_DECIMALS); // 1 token with 8 decimals
            const overdrawAmount = ethers.utils.parseUnits("2", FAKE_STABLE_DECIMALS); // 2 tokens with 8 decimals

            // First, the user deposits
            await vault.connect(user1).deposit(depositAmount, token.address, user1.address);

            // Now, the user tries to overdraw
            await expect(vault.connect(user1).withdraw(overdrawAmount, token.address)).to.be.revertedWith("Insufficient balance");
        });

        it("Should fail if the contract is paused", async function () {
            await vault.connect(admin).pause(); // Assuming you have a pause function

            const amount = ethers.utils.parseEther("1");

            await expect(vault.connect(user1).withdraw(amount, token.address)).to.be.revertedWith("Pausable: paused");
        });
    });
});