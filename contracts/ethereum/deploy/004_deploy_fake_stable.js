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

  const kyodoRegistryInstance = await ethers.getContract('KyodoRegistry', deployer);

  const deployedContract = await deploy('FakeStable', {
    from: deployer,
    args: [deployer, inititalSupply, decimals],
    log: true
  });

  console.log(`FakeStable Address: ${deployedContract.address}`);
  const blockNumber = await ethers.provider.getBlockNumber();
  const tx = await kyodoRegistryInstance.updateRegistry("FAKE_STABLE", deployedContract.address, blockNumber);
  await tx.wait();

  try {
    if (network.name != "hardhat" && network.name != "testing" && network.name != "localhost") {
      const { stdout, stderr } = await exec(`npx hardhat verify --network ${network.name} ${deployedContract.address} ${deployer} ${inititalSupply} ${decimals}`);
      console.log('stdout:', stdout);
    }
  } catch (e) {
    console.error(e);
  }

  // const envPath = path.join(__dirname, '../../../.env.development.local');
  // const envContent = fs.readFileSync(envPath, { encoding: 'utf8' });
  // const newEnvContent = envContent.replace(/NEXT_PUBLIC_KYODO_REGISTRY=.*/, `NEXT_PUBLIC_KYODO_REGISTRY=${deployedContract.address}`);
  // fs.writeFileSync(envPath, newEnvContent);
  // console.log(`Updated NEXT_PUBLIC_KYODO_REGISTRY in env.development.local to ${deployedContract.address}`);
};

module.exports.tags = ['FakeStable'];
