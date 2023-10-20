const { expect } = require("chai");
const { ethers } = require("hardhat");

let = SPARK_DATA_PROVIDER = "0x86C71796CcDB31c3997F8Ec5C2E3dB3e9e40b985"; // GOERLY_ADDRESS
let = SPARK_INCENTIVES_CONTROLLER= "0x0000000000000000000000000000000000000000"; // GOERLY_ADDRESS
let = SPARK_LENDING_POOL= "0x26ca51Af4506DE7a6f0785D20CD776081a05fF6d"; // GOERLY_ADDRESS

describe("vault", function () {
  let StableVault, vault, Token, token, admin, user1;

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
   
    // Approve the StableVault contract to spend tokens on behalf of user1
    await token.connect(admin).approve(vault.address, ethers.utils.parseEther("1000"));
    await token.connect(user1).approve(vault.address, ethers.utils.parseEther("1000")); // Approve 1000 tokens
  });

  describe("Deposit", function () {
    it("Should deposit automatically to spark", async function () {
      // Assign CHANGE_PARAMETERS role to user1
      await vault.connect(user1).addProfile(user1.address);
    
      // Set userSetCompound to true
      await vault.connect(user1).setUserCompoundPreference(true);
    
      await token.connect(admin).transfer(user1.address, ethers.utils.parseEther("50"));
      const depositAmount = ethers.utils.parseUnits("50", 18);
      const expectedVaultAmount = ethers.utils.parseUnits("50", 18);
    
      const initialSparkBalance = await vault.getSparkBalance(token.address);
    
      // Assume depositSpark is an event emitted when depositing to Spark
      await expect(vault.connect(user1).deposit(depositAmount, token.address, user1.address))
        .to.emit(vault, "BalanceUpdated")
        .to.emit(vault, "DepositSpark")
        .withArgs(user1.address, token.address, depositAmount);
    
      const userBalance = await vault.balanceOf(user1.address);
      expect(userBalance).to.equal(expectedVaultAmount);
    
      const finalSparkBalance = await vault.getSparkBalance(token.address);
      expect(finalSparkBalance.sub(initialSparkBalance)).to.equal(depositAmount);
    });
    
    it("Should allow a user to make a deposit with userSetCompound set to false", async function () {
      const depositAmount = ethers.utils.parseUnits("50", 18);
      await token.connect(admin).transfer(user1.address, ethers.utils.parseEther("50"));
    
      const initialSparkBalance = await vault.getSparkBalance(token.address);
    
      // Check that depositSpark event is not emitted
      await expect(vault.connect(user1).deposit(depositAmount, token.address, user1.address))
        .to.emit(vault, "BalanceUpdated")
        .to.not.emit(vault, "DepositSpark");
    
      // Balance should still be updated
      const newBalance = await vault.balanceOf(user1.address);
      expect(newBalance).to.equal(ethers.utils.parseUnits("50", 18));
    
      const finalSparkBalance = await vault.getSparkBalance(token.address);
      expect(finalSparkBalance.sub(initialSparkBalance)).to.equal(0);  // No increase in Spark balance
    });
    

    it("Should fail if the contract is paused", async function () {
      await vault.connect(admin).pause(); // Assuming you have a pause function

      const amount = ethers.utils.parseEther("1");

      await expect(vault.connect(admin).deposit(amount, token.address, admin.address)).to.be.revertedWith("Pausable: paused");
    });
  });
});
