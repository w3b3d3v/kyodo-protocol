const { ethers } = require("hardhat");

async function main() {
  // Deploy W3DStableVault contract
  const W3DStableVaultFactory = await ethers.getContractFactory("W3DStableVault");
  const [admin, user1, user2] = await ethers.getSigners();
  const W3DStableVault = await W3DStableVaultFactory.deploy(admin.address, "W3DStableVaultToken", "W3DV");
  await W3DStableVault.deployed();
  console.log("W3DStableVault deployed to:", W3DStableVault.address);

  // Deploy mock token
  const TokenFactory = await ethers.getContractFactory("testToken");
  const token = await TokenFactory.deploy(ethers.utils.parseEther("1000000")); // 1 million tokens
  await token.deployed();
  console.log("Token deployed to:", token.address);

  // Transfer some tokens from admin to user1
  await token.connect(admin).transfer(user1.address, ethers.utils.parseEther("100")); // Transfer 100 tokens to user1
  console.log("Transferred 100 tokens from admin to user1");

  // Approve the W3DStableVault contract to spend tokens on behalf of user1
  await token.connect(user1).approve(W3DStableVault.address, ethers.utils.parseEther("1000")); // Approve 1000 tokens
  console.log("User1 approved W3DStableVault to spend 1000 tokens");

  // User1 deposits 1 token into the W3DStableVault
  const amount = ethers.utils.parseUnits("1", 8); // 1 token with 8 decimals
  await W3DStableVault.connect(user1).deposit(amount, token.address, user1.address);
  console.log(`User1 deposited ${amount} token into W3DStableVault`);

  // Check the balance of user1 in W3DStableVault
  const userBalance = await W3DStableVault.balanceOf(user1.address);
  console.log("User1's balance in W3DStableVault is:", ethers.utils.formatEther(userBalance));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
