const { ethers, getNamedAccounts, network } = require("hardhat");
const { chainConfigs } = require('./chain_config');
const burnMintCCIPHelperABI = require("@chainlink/contracts-ccip/abi/v0.8/BurnMintERC677Helper.json");
let { token } = chainConfigs[network.name];

async function drip() {
    const [signer] = await ethers.getSigners();
    const { deployer } = await getNamedAccounts();
    const ccipBnMContractInstance = new ethers.Contract(token, burnMintCCIPHelperABI, signer);

    for (let i = 0; i < 10; i++) {
        console.log(`Generating CCIPBNM Tokens... [Iteration ${i + 1}]`);
        let tx = await ccipBnMContractInstance.drip("0x988d8063f521aa948FEc4AC1a4EDa72a5BdCBFb0");
        await tx.wait(1);
        const ccipBnMTokenBalance = await ccipBnMContractInstance.balanceOf("0x988d8063f521aa948FEc4AC1a4EDa72a5BdCBFb0");
        console.log(`Company has ${ccipBnMTokenBalance.toString()} CCIPBnM Tokens on ${network.name}`);
    }
}


drip()