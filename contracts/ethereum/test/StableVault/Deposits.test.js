const { expect } = require("chai");
const { ethers } = require("hardhat");

let = AAVE_DATA_PROVIDER = "0x0000000000000000000000000000000000000000"; // GOERLY_ADDRESS
let = AAVE_INCENTIVES_CONTROLLER= "0x0000000000000000000000000000000000000000"; // GOERLY_ADDRESS
let = AAVE_LENDING_POOL= "0x0000000000000000000000000000000000000000"; // GOERLY_ADDRESS

describe("vault", function () {
  let StableVault, vault, Token, token, admin, user1;

  beforeEach(async function () {
    // Contract deployment
    StableVault = await ethers.getContractFactory("StableVault");
    [admin, user1, user2] = await ethers.getSigners();
    vault = await StableVault.deploy(admin.address, "StableVaultToken", "STBLV");
    await vault.deployed()
    await vault.setAaveSettings(AAVE_DATA_PROVIDER, AAVE_INCENTIVES_CONTROLLER, AAVE_LENDING_POOL);

    // Deploy mock token
    Token = await ethers.getContractFactory("fakeStable");
    token = await Token.deploy(ethers.utils.parseEther("1000000"), 18); // 1 million tokens
    // token = Token.attach(process.env.DAI_GOERLY)
    await token.deployed();
   
    // Approve the StableVault contract to spend tokens on behalf of user1
    await token.connect(admin).approve(vault.address, ethers.utils.parseEther("1000"));
    await token.connect(user1).approve(vault.address, ethers.utils.parseEther("1000")); // Approve 1000 tokens
  });

  describe("Deposit", function () {
    xit("Should deposit automatically to aave", async function () {
      // Assign CHANGE_PARAMETERS role to user1
      await vault.connect(user1).addProfile(user1.address);
  
      // Update valid networks for the depositAave function
      await vault.connect(admin).updateValidNetworks("depositAave", [31337, 1, 5]);
  
      // Validate that the current network is valid for depositAave
      const isValid = await vault.isValidNetworkForFunction("depositAave");
      expect(isValid).to.equal(true);
  
      // Set userSetCompound to true
      await vault.connect(user1).setUserCompoundPreference(true);
  
      // Transfer tokens to user1
      await token.connect(admin).transfer(user1.address, ethers.utils.parseEther("50"));
  
      const depositAmount = ethers.utils.parseUnits("50", 18);
      const expectedVaultAmount = ethers.utils.parseUnits("50", 18);
  
      const initialAaveBalance = await vault.getAaveBalance(token.address);
  
      // Execute deposit and validate events are emitted
      await expect(vault.connect(user1).deposit(depositAmount, token.address, user1.address))
        .to.emit(vault, "BalanceUpdated")
        .to.emit(vault, "DepositAave")
        .withArgs(user1.address, token.address, depositAmount);
  
      const userBalance = await vault.balanceOf(user1.address);
      expect(userBalance).to.equal(expectedVaultAmount);
  
      const finalAaveBalance = await vault.getAaveBalance(token.address);
      expect(finalAaveBalance.sub(initialAaveBalance)).to.equal(depositAmount);
    });
    
    it("Should allow a user to make a deposit with userSetCompound set to false", async function () {
      const depositAmount = ethers.utils.parseUnits("50", 18);
      await token.connect(admin).transfer(user1.address, ethers.utils.parseEther("50"));
    
      // const initialAaveBalance = await vault.getAaveBalance(token.address);
    
      // Check that depositAave event is not emitted
      await expect(vault.connect(user1).deposit(depositAmount, token.address, user1.address))
        .to.emit(vault, "BalanceUpdated")
        .to.not.emit(vault, "DepositAave");
    
      // Balance should still be updated
      const newBalance = await vault.balanceOf(user1.address);
      expect(newBalance).to.equal(ethers.utils.parseUnits("50", 18));
    
      // const finalAaveBalance = await vault.getAaveBalance(token.address);
      // expect(finalAaveBalance.sub(initialAaveBalance)).to.equal(0);  // No increase in Aave balance
    });
    

    it("Should fail if the contract is paused", async function () {
      await vault.connect(admin).pause(); // Assuming you have a pause function

      const amount = ethers.utils.parseEther("1");

      await expect(vault.connect(admin).deposit(amount, token.address, admin.address)).to.be.revertedWith("Pausable: paused");
    });

    it("Should not revert when trying to deposit on an invalid Aave network", async function () {
      // Assign CHANGE_PARAMETERS role to user1
      await vault.connect(user1).addProfile(user1.address);
  
      // Update valid networks for the depositAave function to exclude the current network (e.g., 31337)
      await vault.connect(admin).updateValidNetworks("depositAave", [900, 600]);  // Assume 1 and 5 are mainnet and Goerli, excluding 31337 (Hardhat Network)
  
      // Set userSetCompound to true
      await vault.connect(user1).setUserCompoundPreference(true, user1.address);
  
      // Transfer tokens to user1
      await token.connect(admin).transfer(user1.address, ethers.utils.parseEther("50"));
  
      const depositAmount = ethers.utils.parseUnits("50", 18);
  
      await expect(vault.connect(user1).deposit(depositAmount, token.address, user1.address))
      .to.emit(vault, "BalanceUpdated")
      .to.not.emit(vault, "DepositAave");
    });
  });
});
