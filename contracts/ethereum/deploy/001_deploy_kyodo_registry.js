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
    log: true,
    deterministicDeployment: salt
  });

  console.log(`KyodoRegistry Address: ${deployedContract.address}`);

  try {
    if(network.name != "hardhat" && network.name != "testing" && network.name != "localhost") {
      const { stdout, stderr } = await exec(`npx hardhat verify --network ${network.name} ${deployedContract.address} ${deployer}`);
      console.log('stdout:', stdout);
    }
  } catch (e) {
    console.error(e);
  }

  // const envPath = path.join(__dirname, '../../../.env.development.local');
  // let envContent = fs.readFileSync(envPath, { encoding: 'utf8' });

  // if (!envContent.includes('NEXT_PUBLIC_KYODO_REGISTRY=')) {
  //   envContent += `\nNEXT_PUBLIC_KYODO_REGISTRY=${deployedContract.address}\n`;
  // } else {
  //   envContent = envContent.replace(/NEXT_PUBLIC_KYODO_REGISTRY=.*/, `NEXT_PUBLIC_KYODO_REGISTRY=${deployedContract.address}`);
  // }
  
  // fs.writeFileSync(envPath, envContent.trim() + '\n');
  // console.log(`Updated or added NEXT_PUBLIC_KYODO_REGISTRY in .env.development.local to ${deployedContract.address}`);
};

module.exports.tags = ['KyodoRegistry'];
