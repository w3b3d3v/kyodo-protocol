const { ethers } = require("hardhat");
require('dotenv').config({ path: './.env.development.local' });

const AGREEMENT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AGREEMENT_CONTRACT_ADDRESS
const FAKE_STABLE_ADDRESS = process.env.NEXT_PUBLIC_FAKE_STABLE_ADDRESS

async function main() {
    const TokenContract = await ethers.getContractFactory("fakeStable");
    const token = await TokenContract.attach(FAKE_STABLE_ADDRESS);
    console.log(`Aprovando o fakeStable ${FAKE_STABLE_ADDRESS} para o agreementContract ${AGREEMENT_CONTRACT_ADDRESS}`);
    const tx = await token.approve(AGREEMENT_CONTRACT_ADDRESS, "100000000000000000000")
    console.log("Aprovação bem-sucedida: ", tx.hash);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
});