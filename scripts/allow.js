const { ethers } = require("hardhat");

const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../src/config.json");
let configData = fs.readFileSync(configPath, "utf8");

configData = JSON.parse(configData);
const contractAddress = configData.contractAgreement;

async function main() {
    const TokenContract = await ethers.getContractFactory("testToken");
    const token = await TokenContract.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
    const tx = await token.approve(contractAddress, "100000000000000000000")
}

main()
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
});