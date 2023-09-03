const { ethers } = require("hardhat");

async function main() {
    const contractAddress = "0x2135b360D32B17fAEE573BDE47C75e5e34bdC875"; // Substitua pelo endereço real do contrato AgreementContract
    const TokenContract = await ethers.getContractFactory("testToken");
    const token = await TokenContract.attach(contractAddress);

    const tx = await token.approve("0x1f720E7952650ED8Ca142feBD52aCBe8b7A21741", "10000000000000000000")
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
});
