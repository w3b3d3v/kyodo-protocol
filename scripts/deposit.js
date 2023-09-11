const { ethers } = require("hardhat");

async function main() {
  // Deploy StableVault contract
  const StableVaultFactory = await ethers.getContractFactory("StableVault");
  const [admin, user1, user2] = await ethers.getSigners();
  const StableVault = await StableVaultFactory.deploy(admin.address, "StableVaultToken", "W3DV");
  await StableVault.deployed();
  console.log("StableVault deployed to:", StableVault.address);

  // Deploy mock token
  const TokenFactory = await ethers.getContractFactory("testToken");
  const token = await TokenFactory.deploy(ethers.utils.parseEther("1000000")); // 1 million tokens
  await token.deployed();
  console.log("Token deployed to:", token.address);

  // Transfer some tokens from admin to user1
  await token.connect(admin).transfer(user1.address, ethers.utils.parseEther("100")); // Transfer 100 tokens to user1
  console.log("Transferred 100 tokens from admin to user1");

  // Approve the StableVault contract to spend tokens on behalf of user1
  await token.connect(user1).approve(StableVault.address, ethers.utils.parseEther("1000")); // Approve 1000 tokens
  console.log("User1 approved StableVault to spend 1000 tokens");

  // User1 deposits 1 token into the StableVault
  const amount = ethers.utils.parseUnits("1", 8); // 1 token with 8 decimals
  await StableVault.connect(user1).deposit(amount, token.address, user1.address);
  console.log(`User1 deposited ${amount} token into StableVault`);

  // Check the balance of user1 in StableVault
  const userBalance = await StableVault.balanceOf(user1.address);
  console.log("User1's balance in StableVault is:", ethers.utils.formatEther(userBalance));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
