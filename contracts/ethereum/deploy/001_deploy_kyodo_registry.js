const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const salt = '0x';

  args = [deployer];

  const deployedContract = await deploy('KyodoRegistry', {
    from: deployer,
    args: args,
    log: true
  });

  console.log(`KyodoRegistry Address: ${deployedContract.address}`);
  try {
    const { stdout, stderr } = await exec(`npx hardhat verify --network ${network.name} ${deployedContract.address} ${deployer}`);
    console.log('stdout:', stdout);
  } catch (e) {
    console.error(e);
  }


  const envPath = path.join(__dirname, '../../../.env.development.local');
  const envContent = fs.readFileSync(envPath, { encoding: 'utf8' });
  const newEnvContent = envContent.replace(/NEXT_PUBLIC_KYODO_REGISTRY=.*/, `NEXT_PUBLIC_KYODO_REGISTRY=${deployedContract.address}`);
  fs.writeFileSync(envPath, newEnvContent);
  console.log(`Updated NEXT_PUBLIC_KYODO_REGISTRY in env.development.local to ${deployedContract.address}`);
};

module.exports.tags = ['KyodoRegistry'];
