const fs = require('fs');
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy do token com 1 milhão de supply
    const Token = await ethers.getContractFactory("testToken");
    const token = await Token.deploy(ethers.utils.parseEther("1000000")); // 1 milhão de tokens
    await token.deployed();

    console.log("Token deployed to:", token.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
``