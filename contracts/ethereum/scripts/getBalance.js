const { ethers } = require("hardhat");
require('dotenv').config({ path: '../../.env.development.local' });

const STABLE_VAULT_ADDRESS = process.env.NEXT_PUBLIC_STABLE_VAULT_ADDRESS

async function main() {
    const TokenContract = await ethers.getContractFactory("StableVault");
    const token = await TokenContract.attach(STABLE_VAULT_ADDRESS);
    const tx = await token.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
}

main()
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
});