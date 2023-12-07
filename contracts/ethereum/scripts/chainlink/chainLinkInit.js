const path = require('path');
const fs = require('fs');

const { ethers, getNamedAccounts, network } = require("hardhat");

const { chainConfigs } = require('../utils/chain_config');
const linkTokenABI = require("@chainlink/contracts/abi/v0.8/LinkToken.json");
const weth9ABI = require("../../abis/WETH9.json");
const burnMintCCIPHelperABI = require("@chainlink/contracts-ccip/abi/v0.8/BurnMintERC677Helper.json");

console.log("network.name", network.name);

function getContractAddress(network, contractName) {
  const envPath = path.join(__dirname, '../../deployments');
  let ContractJSON = fs.readFileSync(`${envPath}/${network}/${contractName}.json`, { encoding: 'utf8' });
  return JSON.parse(ContractJSON).address;
}

async function configureStableVault(stableVaultInstance) {
  console.log(`Configuring [StableVault] on ${network.name} at ${stableVaultInstance.target}`)
  console.log(`Whitelisting Sourced Chains and Senders for [StableVault]...`);
  
  for (const config of Object.keys(chainConfigs)) {
    if (config != network.name && chainConfigs[config].live) {
      console.log(`Whitelisting Sourced Chain: ${config}...`);
      let tx = await stableVaultInstance.whitelistSourceChain(chainConfigs[config].chainSelector);
      await tx.wait();

      console.log(`Whitelisting Senders from ${config} for StableVault...`);
      const agreementContractAddress = getContractAddress(config, "AgreementContract");
      tx = await stableVaultInstance.whitelistSender(agreementContractAddress);
      await tx.wait();
    }
  }
}

async function configureAgreementContract(agreementContractInstance, token, feePercentage, kyodoTreasuryFee, communityDAOFee) {
  console.log(`Configuring [AgreementContract] on ${network.name} at ${agreementContractInstance.target}`);
  console.log(`Configuring Fees for [AgreementContract]...`);
  let transaction = await agreementContractInstance.setFees(feePercentage, kyodoTreasuryFee, communityDAOFee);
  await transaction.wait();

  console.log(`Configuring Accepted Payment Tokens for [AgreementContract]...`);

  transaction = await agreementContractInstance.addAcceptedPaymentToken(token);
  await transaction.wait();

  if (network.name == "testing") {
    console.log(`Configuring [StableVault] for localhost on [AgreementContract]...`);
    const chainSelector = chainConfigs["testing"].chainSelector;
    const chainId = "000000000" // CCIP will not work, it is only to test in the same chain
    const vaultAddress = getContractAddress("testing", "StableVault");
    const transaction = await agreementContractInstance.setCrossChainConfigs(chainId, chainSelector, vaultAddress);
    await transaction.wait();
  } else {
    console.log(`Configuring [StableVault] for crosschain on [AgreementContract]...`);
    await configureCrossChain(agreementContractInstance);
  }

  console.log(`Whitelisting Chains for [AgreementContract]...`);
  for (const config of Object.keys(chainConfigs)) {
    if (config != network.name && chainConfigs[config].live) {
      console.log(`Whitelisting ${config}...`);
      const tx = await agreementContractInstance.whitelistChain(chainConfigs[config].chainSelector);
      await tx.wait();
    }
  }
}

async function configureCrossChain(agreementContractInstance) {
  for (const config of Object.keys(chainConfigs)) {
    if (config != network.name && chainConfigs[config].live) {
      console.log(`Configuring [StableVault] for ${config} on ${network.name}>[AgreementContract]...`);
      const vaultAddress = getContractAddress(config, "StableVault");
      transaction = await agreementContractInstance.setCrossChainConfigs(chainConfigs[config].chainId, chainConfigs[config].chainSelector, vaultAddress);
      await transaction.wait();
    }
  }
}

async function main() {
  const { deployer, user1 } = await getNamedAccounts();
  const [signer] = await ethers.getSigners();
  let { linkAddress, feePercentage, kyodoTreasuryFee, communityDAOFee, token } = chainConfigs[network.name];
  const testToken = await ethers.getContract('FakeStable', deployer);

  const ccipBnMContractInstance = new ethers.Contract(token, burnMintCCIPHelperABI, signer);
  const linkTokenInstance = new ethers.Contract(linkAddress, linkTokenABI, signer);

  const stableVaultInstance = await ethers.getContract('StableVault', deployer);
  const agreementContractInstance = await ethers.getContract('AgreementContract', deployer);

  if (network.name == "testing") {
    token = testToken.target;
  }

  await configureAgreementContract(agreementContractInstance, token, feePercentage, kyodoTreasuryFee, communityDAOFee);
  await configureStableVault(stableVaultInstance, agreementContractInstance.target);

  // Chainlink has a problem with LINK TOKEN on baseGoerli so we had to use WETH9 to pay fees on this chain.
  if(network.name == "baseGoerli") {
    console.log(`Configuring base Goerli to receive WETH9...`);
    const WETH9Instance = new ethers.Contract(linkAddress, weth9ABI, signer);
    
    let tx = await WETH9Instance.deposit({value: ethers.parseEther("0.01")});
    await tx.wait();

    console.log(`Getting WETH9 tokens using ${deployer}...`);

    tx = await WETH9Instance.transfer(agreementContractInstance.target, ethers.parseEther("0.01").toString());
    await tx.wait();

    console.log(`Transfering WETH9 token to the AgreementContract at ${agreementContractInstance.target}`);

    const contractBalance = await WETH9Instance.balanceOf(agreementContractInstance.target);
    console.log(`Contract has ${contractBalance.toString()} WETH9 Tokens on ${network.name}`);

  } else {
    const linkTokenBalance = await linkTokenInstance.balanceOf(deployer);
    if (parseInt(linkTokenBalance.toString()) >= parseInt(ethers.parseEther("1").toString())) {
      console.log(`Sending LINK tokens to the AgreementContract...`);
      const tx = await linkTokenInstance.transfer(agreementContractInstance.target, ethers.parseEther("1").toString());
      await tx.wait();
    } else {
      console.log(`There's no Link balance to send it to the AgreementContract...`);
    }

    const contractBalance = await linkTokenInstance.balanceOf(agreementContractInstance.target);
    console.log(`Contract has ${contractBalance.toString()} Link Tokens on ${network.name}`);
  }

  const ccipBnMTokenBalance = await ccipBnMContractInstance.balanceOf(user1);
  if (parseInt(ccipBnMTokenBalance.toString()) < parseInt(ethers.parseEther("1").toString())) {
    console.log(`Generating CCIPBNM Tokens...`);
    const tx = await ccipBnMContractInstance.drip(user1);
    await tx.wait();
  }

  console.log(`Company has ${ccipBnMTokenBalance.toString()} CCIPBnM Tokens on ${network.name}`);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });