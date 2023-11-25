const { ethers, getNamedAccounts, network } = require("hardhat");

const { chainConfigs } = require('./utils/chain_config');
const linkTokenABI = require("@chainlink/contracts/abi/v0.8/LinkToken.json");
const burnMintCCIPHelperABI = require("@chainlink/contracts-ccip/abi/v0.8/BurnMintERC677Helper.json");
const VaultAddressAvalanche = require("../deployments/avalancheFuji/StableVault.json");
const VaultAddressMumbai = require("../deployments/polygonMumbai/StableVault.json");

async function configureStableVault(stableVaultInstance, agreementContractAddress) {
  console.log(`Configuring [StableVault] on ${network.name} at ${stableVaultInstance.target}`)
  console.log(`Whitelisting Sourced Chains for [StableVault]...`);

  for (const config of Object.keys(chainConfigs)) {
    if (chainConfigs[config].live) {
      console.log(`Whitelisting ${config}...`);
      const tx = await stableVaultInstance.whitelistSourceChain(chainConfigs[config].chainSelector);
      await tx.wait();
    }
  }

  console.log(`Whitelisting Senders for StableVault...`);
  await stableVaultInstance.whitelistSender(agreementContractAddress);
}

async function configureAgreementContract(agreementContractInstance, token, feePercentage, kyodoTreasuryFee, communityDAOFee) {
  console.log(`Configuring [AgreementContract] on ${network.name} at ${agreementContractInstance.target}`);
  console.log(`Configuring Fees for [AgreementContract]...`);
  let transaction = await agreementContractInstance.setFees(feePercentage, kyodoTreasuryFee, communityDAOFee);
  await transaction.wait();

  console.log(`Configuring Accepted Payment Tokens for [AgreementContract]...`);
  transaction = await agreementContractInstance.addAcceptedPaymentToken(token);
  await transaction.wait();

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
  }

  transaction = await agreementContractInstance.setCrossChainConfigs(chainId, chainSelector, vaultAddress);
  await transaction.wait();

  console.log(`Whitelisting Chains for [AgreementContract]...`);
  for (const config of Object.keys(chainConfigs)) {
    if (chainConfigs[config].live) {
      console.log(`Whitelisting ${config}...`);
      const tx = await agreementContractInstance.whitelistChain(chainConfigs[config].chainSelector);
      await tx.wait();
    }
  }
}

async function main() {
  const { deployer, user1 } = await getNamedAccounts();
  const [signer] = await ethers.getSigners();
  let { token, linkAddress, feePercentage, kyodoTreasuryFee, communityDAOFee } = chainConfigs[network.name];

  const ccipBnMContractInstance = new ethers.Contract(token, burnMintCCIPHelperABI, signer);
  const linkTokenInstance = new ethers.Contract(linkAddress, linkTokenABI, signer);

  const stableVaultInstance = await ethers.getContract('StableVault', deployer);
  const agreementContractInstance = await ethers.getContract('AgreementContract', deployer);

  await configureAgreementContract(agreementContractInstance, token, feePercentage, kyodoTreasuryFee, communityDAOFee);
  await configureStableVault(stableVaultInstance, agreementContractInstance.target);

  console.log(`Generating CCIPBNM Tokens...`);
  let tx = await ccipBnMContractInstance.drip(user1);
  await tx.wait();

  const ccipBnMBalance = await ccipBnMContractInstance.balanceOf(user1);
  console.log(`Company has ${ccipBnMBalance.toString()} CCIPBnM Tokens on ${network.name}`);

  const linkTokenBalance = await linkTokenInstance.balanceOf(deployer);
  if (parseInt(linkTokenBalance.toString()) >= parseInt(ethers.parseEther("1").toString())) {
    tx = await linkTokenInstance.transfer(agreementContractInstance.target, ethers.parseEther("1").toString());
    await tx.wait();
    const contractBalance = await linkTokenInstance.balanceOf(agreementContractInstance.target);
    console.log(`Contract has ${contractBalance.toString()} Link Tokens on ${network.name}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });