const { expect } = require("chai");
const { ethers } = require("hardhat");

const FAKE_STABLE_DECIMALS = 18;
let = SPARK_DATA_PROVIDER = "0x0000000000000000000000000000000000000000";
let = SPARK_INCENTIVES_CONTROLLER= "0x0000000000000000000000000000000000000000"; //doesn't exist for kovan
let = SPARK_LENDING_POOL= "0x26ca51Af4506DE7a6f0785D20CD776081a05fF6d";

describe("vault", function () {
  let StableVault, vault, Token, token, admin, user1, user2;

  beforeEach(async function () {
    // Contract deployment
    StableVault = await ethers.getContractFactory("StableVault");
    [admin, user1, user2] = await ethers.getSigners();
    vault = await StableVault.deploy(admin.address, "StableVaultToken", "STBLV");
    await vault.deployed()
    await vault.setSparkSettings(SPARK_DATA_PROVIDER, SPARK_INCENTIVES_CONTROLLER, SPARK_LENDING_POOL);

    // Deploy mock token
    Token = await ethers.getContractFactory("fakeStable");
    // token = await Token.deploy(ethers.utils.parseEther("1000000"), FAKE_STABLE_DECIMALS); // 1 million tokens
    token = Token.attach(process.env.DAI_GOERLY)
    await token.deployed();

      // Transfer some tokens from admin to user1 and user2
   
    // Approve the StableVault contract to spend tokens on behalf of user1
    await token.connect(user1).approve(vault.address, ethers.utils.parseEther("1000")); // Approve 1000 tokens
  });

  describe("Deposit", function () {
    it("Should allow a user to make a deposit", async function () {
        const depositAmount = ethers.utils.parseUnits("1", FAKE_STABLE_DECIMALS); // 1 token with 8 decimals
        const expectedVaultAmount = ethers.utils.parseUnits("1", 18); // Expected to be 1 token but with 18 decimals
        await token.connect(admin).transfer(user1.address, ethers.utils.parseEther("100")); // Transfer 100 tokens to user1
        await vault.connect(user1).deposit(depositAmount, token.address, user1.address);
        
        const userBalance = await vault.balanceOf(user1.address);
        expect(userBalance).to.equal(expectedVaultAmount);
      
        await expect(vault.connect(user1).deposit(depositAmount, token.address, user1.address))
          .to.emit(vault, "BalanceUpdated")
          .withArgs(expectedVaultAmount);
      });

    it("Should fail if the contract is paused", async function () {
      await vault.connect(admin).pause(); // Assuming you have a pause function

      const amount = ethers.utils.parseEther("1");

      await expect(vault.connect(admin).deposit(amount, token.address, admin.address)).to.be.revertedWith("Pausable: paused");
    });
  });
});
