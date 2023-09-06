const { ethers } = require("hardhat");

async function main() {
    W3DVault = await ethers.getContractFactory("W3DVault");
    [admin, user1, user2] = await ethers.getSigners();
    w3dVault = await W3DVault.deploy(admin.address, "W3DVaultToken", "W3DV");
    await w3dVault.deployed();

    // Deploy mock token
    Token = await ethers.getContractFactory("testToken");
    token = await Token.deploy(ethers.utils.parseEther("1000000")); // 1 million tokens
    await token.deployed();

      // Transfer some tokens from admin to user1 and user2
    await token.connect(admin).transfer(user1.address, ethers.utils.parseEther("100")); // Transfer 100 tokens to user1

    // Approve the W3DVault contract to spend tokens on behalf of user1
    await token.connect(user1).approve(w3dVault.address, ethers.utils.parseEther("1000")); // Approve 1000 tokens

    const amount = ethers.utils.parseEther("1"); // 1 token
    await w3dVault.connect(user1).deposit(amount, token.address);

    const userBalance = await w3dVault.balanceOf(user1.address);
    console.log("userBalance", userBalance);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
});