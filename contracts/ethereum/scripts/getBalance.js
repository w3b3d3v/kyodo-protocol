const { ethers } = require("hardhat");
require('dotenv').config({ path: '../../.env.development.local' });

const STABLE_VAULT_ADDRESS = process.env.NEXT_PUBLIC_STABLE_VAULT_ADDRESS
address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

async function main() {
    const provider = ethers.provider;
    const balance = await provider.getBalance(address);
    console.log('ETH Balance:', ethers.utils.formatEther(balance));

    const TokenContract = await ethers.getContractFactory("StableVault");
    const token = await TokenContract.attach("0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844");
    const tx = await token.balanceOf(address)
    console.log("Token Balance: ", tx)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
});