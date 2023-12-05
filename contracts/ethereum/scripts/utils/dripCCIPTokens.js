const { ethers, getNamedAccounts, network } = require("hardhat");
const { chainConfigs } = require('./chain_config');
const burnMintCCIPHelperABI = require("@chainlink/contracts-ccip/abi/v0.8/BurnMintERC677Helper.json");
let { token } = chainConfigs[network.name];

async function drip(){
    const [signer] = await ethers.getSigners();
    const { deployer } = await getNamedAccounts();
    const ccipBnMContractInstance = new ethers.Contract(token, burnMintCCIPHelperABI, signer);
    console.log(`Generating CCIPBNM Tokens...`);
    let tx = await ccipBnMContractInstance.drip(deployer);
    await tx.wait(1);
    const ccipBnMTokenBalance = await ccipBnMContractInstance.balanceOf(deployer);
    console.log(`Company has ${ccipBnMTokenBalance.toString()} CCIPBnM Tokens on ${network.name}`);
}

drip()