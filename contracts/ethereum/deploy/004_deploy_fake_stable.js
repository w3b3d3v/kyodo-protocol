const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = async ({ getNamedAccounts, deployments, ethers }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const salt = '0x';
  const inititalSupply = ethers.parseEther("100000");
  const decimals = 18;

  const deployedContract = await deploy('FakeStable', {
    from: deployer,
    args: [deployer, inititalSupply, decimals],
    log: true
  });

  console.log(`Deployer: ${deployer}`);
  console.log(`FakeStable Address: ${deployedContract.address}`);
  // try {
  //   const { stdout, stderr } = await exec(`npx hardhat verify --network ${network.name} ${deployedContract.address} ${deployer} ${inititalSupply} ${decimals}`);
  //   console.log('stdout:', stdout);
  // } catch (e) {
  //   console.error(e);
  // }
};

module.exports.tags = ['FakeStable'];
