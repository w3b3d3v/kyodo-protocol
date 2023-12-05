const { ethers, getNamedAccounts, network } = require("hardhat");

const { chainConfigs } = require('../utils/chain_config');
const linkTokenABI = require("@chainlink/contracts/abi/v0.8/LinkToken.json");
const burnMintCCIPHelperABI = require("@chainlink/contracts-ccip/abi/v0.8/BurnMintERC677Helper.json");

async function makePayment(companyAgreementInstance, agreementId, value, token) {
  console.log(`Making payment... -using Company Address`);
  transaction = await companyAgreementInstance.makePayment(agreementId, value, token);
  await transaction.wait();
  console.log(transaction);
}

async function setPreferredChain(userAgreementInstance, preferredChain) {
  console.log(`Setting preferredChain to ${preferredChain} -using Company Address`);
  const tx = await userAgreementInstance.setPreferredChain(preferredChain);
  await tx.wait();
}


async function main() {
  let transaction;
  const { deployer, user1, user2 } = await getNamedAccounts();
  let { token } = chainConfigs[network.name];
  const accounts = await ethers.getSigners();
  const companyAgreementInstance = await ethers.getContract('AgreementContract', user1);
  const userAgreementInstance = await ethers.getContract('AgreementContract', user2);

  const stableVaultInstance = await ethers.getContract('StableVault', deployer);
  const companyCCIPMnBInstance = new ethers.Contract(token, burnMintCCIPHelperABI, accounts[5]);

  const skills = [
    { name: "Programming", level: 50 },
    { name: "Design", level: 50 }
  ];

  // if (network.name == "avalancheFuji") {
  //   const tx = await userAgreementInstance.setPreferredChain(80001);
  //   await tx.wait();
  // } else if (network.name == "polygonMumbai") {
  //   const tx = await userAgreementInstance.setPreferredChain(43113);
  //   await tx.wait();
  // } else if (network.name == "sepolia") {
  //   const tx = await userAgreementInstance.setPreferredChain(11155111);
  //   await tx.wait();
  // }

  console.log("CreateAgreement -using Company Address");
  transaction = await companyAgreementInstance.createAgreement(
    "Agreement 1",
    "Description 1",
    user2,
    skills,
    ethers.parseEther("1")
  );

  await transaction.wait();

  console.log("Approve CCIPBnM token (Company => Agreement) -using Company Address");
  transaction = await companyCCIPMnBInstance.approve(companyAgreementInstance.target, ethers.parseEther("2"));
  await transaction.wait();

  console.log("MakePayment -using Company Address");
  const company1Agreements = await companyAgreementInstance.getContractorAgreementIds(user1);

  for(config of Object.keys(chainConfigs)) {
    if(config != network.name && chainConfigs[config].live) {
      await setPreferredChain(userAgreementInstance, chainConfigs[config].chainId);
      await makePayment(companyAgreementInstance, company1Agreements[0], ethers.parseEther("0.1"), token);
    }
  }

  console.log("Check Vault Token balance -using Dev");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });