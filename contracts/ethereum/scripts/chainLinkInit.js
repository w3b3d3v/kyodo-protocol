const { ethers, getNamedAccounts, network } = require("hardhat");

const { chainConfigs } = require('./utils/chain_config');
const linkTokenABI = require("@chainlink/contracts/abi/v0.8/LinkToken.json");
const burnMintCCIPHelperABI = require("@chainlink/contracts-ccip/abi/v0.8/BurnMintERC677Helper.json");
const VaultAddressAvalanche = require("../deployments/avalancheFuji/StableVault.json");
const VaultAddressMumbai = require("../deployments/polygonMumbai/StableVault.json");
const AgreementContractAvalance = require("../deployments/avalancheFuji/AgreementContract.json");
const AgreementContractMumbai = require("../deployments/polygonMumbai/AgreementContract.json");
const VaultAddressSepolia = require("../deployments/sepolia/StableVault.json");
const AgreementContractSepolia = require("../deployments/sepolia/AgreementContract.json");
// const VaultAddressHardhat = require("../deployments/localhost/StableVault.json");
// const AgreementContractHardhat = require("../deployments/localhost/AgreementContract.json");
console.log("network.name", network.name);

async function configureStableVault(stableVaultInstance) {
  console.log(`Configuring [StableVault] on ${network.name} at ${stableVaultInstance.target}`)
  console.log(`Whitelisting Sourced Chains for [StableVault]...`);

  for (const config of Object.keys(chainConfigs)) {
    if (chainConfigs[config].live) {
      console.log(`Whitelisting ${config}...`);
      const tx = await stableVaultInstance.whitelistSourceChain(chainConfigs[config].chainSelector);
      await tx.wait(1);
    }
  }

  console.log(`Whitelisting Senders for StableVault...`);
  let agreementContractAddress;
  if (network.name == "avalancheFuji") {
    agreementContractAddress = AgreementContractMumbai.address;
  } else if (network.name == "polygonMumbai") {
    agreementContractAddress = AgreementContractAvalance.address;
  } else if (network.name == "sepolia") {
    agreementContractAddress = AgreementContractSepolia.address;
  } else if (network.name == "testing") {
    agreementContractAddress = AgreementContractHardhat.address;
  }
  await stableVaultInstance.whitelistSender(agreementContractAddress);
}

async function configureAgreementContract(agreementContractInstance, token, feePercentage, kyodoTreasuryFee, communityDAOFee) {
  console.log(`Configuring [AgreementContract] on ${network.name} at ${agreementContractInstance.target}`);
  console.log(`Configuring Fees for [AgreementContract]...`);
  let transaction = await agreementContractInstance.setFees(feePercentage, kyodoTreasuryFee, communityDAOFee);
  await transaction.wait(1);

  console.log(`Configuring Accepted Payment Tokens for [AgreementContract]...`);
  
  transaction = await agreementContractInstance.addAcceptedPaymentToken(token);
  await transaction.wait(1);

  console.log(`Configuring [StableVault] for crosschain on [AgreementContract]...`);
  let chainSelector;
  let chainId;
  let vaultAddress;
  // TODO This is just a temporary way to get the different StableVault address, but in the future this is gonna be deployed with the same address
  if (network.name == "avalancheFuji") {
    chainSelector = chainConfigs["polygonMumbai"].chainSelector;
    chainId = "80001"
    vaultAddress = VaultAddressMumbai.address;
  } else if (network.name == "polygonMumbai") {
    chainSelector = chainConfigs["avalancheFuji"].chainSelector;
    chainId = "43113"
    vaultAddress = VaultAddressAvalanche.address;
  } else if (network.name == "sepolia") {
    chainSelector = chainConfigs["sepolia"].chainSelector;
    chainId = "11155111"
    vaultAddress = VaultAddressSepolia.address;
  } else if (network.name == "testing") {
    chainSelector = chainConfigs["testing"].chainSelector;
    chainId = "000000000" // CCIP will not work, it is only to test in the same chain
    vaultAddress = VaultAddressHardhat.address;
  }

  transaction = await agreementContractInstance.setCrossChainConfigs(chainId, chainSelector, vaultAddress);
  await transaction.wait(1);

  console.log(`Whitelisting Chains for [AgreementContract]...`);
  for (const config of Object.keys(chainConfigs)) {
    if (chainConfigs[config].live) {
      console.log(`Whitelisting ${config}...`);
      const tx = await agreementContractInstance.whitelistChain(chainConfigs[config].chainSelector);
      await tx.wait(1);
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

  if(network.name == "testing") {
    token = testToken;
  }

  await configureAgreementContract(agreementContractInstance, token, feePercentage, kyodoTreasuryFee, communityDAOFee);
  await configureStableVault(stableVaultInstance, agreementContractInstance.target);  

  const linkTokenBalance = await linkTokenInstance.balanceOf(deployer);
  if (parseInt(linkTokenBalance.toString()) >= parseInt(ethers.parseEther("1").toString())) {
    tx = await linkTokenInstance.transfer(agreementContractInstance.target, ethers.parseEther("1").toString());
    await tx.wait(1);
    const contractBalance = await linkTokenInstance.balanceOf(agreementContractInstance.target);
    console.log(`Contract has ${contractBalance.toString()} Link Tokens on ${network.name}`);
  }

  const ccipBnMTokenBalance = await ccipBnMContractInstance.balanceOf(user1);
  if (parseInt(ccipBnMTokenBalance.toString()) < parseInt(ethers.parseEther("1").toString())) {
    console.log(`Generating CCIPBNM Tokens...`);
    let tx = await ccipBnMContractInstance.drip(user1);
    await tx.wait(1);
  }

  console.log(`Company has ${ccipBnMTokenBalance.toString()} CCIPBnM Tokens on ${network.name}`);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });