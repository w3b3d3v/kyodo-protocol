const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { chainConfigs } = require('../scripts/utils/chain_config');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const salt = '0x';

  const tokenName = "Kyodo Token";
  const tokenSymbol = "KYO";
  const networkName = hre.network.name;

  const { routerAddress } = chainConfigs[networkName];

  const deployedContract = await deploy('StableVault', {
    from: deployer,
    args: [deployer, tokenName, tokenSymbol, routerAddress],
    log: true
  });

  console.log(`StableVault Address: ${deployedContract.address}`);
  // try {
  //   const { stdout, stderr } = exec(`npx hardhat verify --network ${network.name} ${deployedContract.address} ${deployer} "${tokenName}" "${tokenSymbol}" ${routerAddress}`);
  //   console.log('stdout:', stdout);
  // } catch (e) {
  //   console.error(e);
  // }
};

module.exports.tags = ['StableVault'];
