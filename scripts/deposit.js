const { ethers } = require("hardhat");

async function main() {
    W3DStableVault = await ethers.getContractFactory("W3DStableVault");
    [admin, user1, user2] = await ethers.getSigners();
    W3DStableVault = await W3DStableVault.deploy(admin.address, "W3DStableVaultToken", "W3DV");
    await W3DStableVault.deployed();

    // Deploy mock token
    Token = await ethers.getContractFactory("testToken");
    token = await Token.deploy(ethers.utils.parseEther("1000000")); // 1 million tokens
    await token.deployed();

      // Transfer some tokens from admin to user1 and user2
    await token.connect(admin).transfer(user1.address, ethers.utils.parseEther("100")); // Transfer 100 tokens to user1

    // Approve the W3DStableVault contract to spend tokens on behalf of user1
    await token.connect(user1).approve(W3DStableVault.address, ethers.utils.parseEther("1000")); // Approve 1000 tokens

    const amount = ethers.utils.parseEther("1"); // 1 token
    await W3DStableVault.connect(user1).deposit(amount, token.address);

    const userBalance = await W3DStableVault.balanceOf(user1.address);
    console.log("userBalance", userBalance);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
});