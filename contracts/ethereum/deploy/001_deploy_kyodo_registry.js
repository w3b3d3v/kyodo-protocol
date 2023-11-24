const fs = require('fs');
const path = require('path');

module.exports = async ({getNamedAccounts, deployments}) => {
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();
  console.log(`Deployer: ${deployer}`);

  const salt = '0x';

  const deployedContract = await deploy('KyodoRegistry', {
    from: deployer,
    args: [deployer],
    log: true,
    deterministicDeployment: salt
  });

  const envPath = path.join(__dirname, '../../../.env.development.local');
  let envContent = fs.readFileSync(envPath, { encoding: 'utf8' });

  if (!envContent.includes('NEXT_PUBLIC_KYODO_REGISTRY=')) {
    envContent += `\nNEXT_PUBLIC_KYODO_REGISTRY=${deployedContract.address}\n`;
  } else {
    envContent = envContent.replace(/NEXT_PUBLIC_KYODO_REGISTRY=.*/, `NEXT_PUBLIC_KYODO_REGISTRY=${deployedContract.address}`);
  }
  
  fs.writeFileSync(envPath, envContent.trim() + '\n');
  console.log(`Updated or added NEXT_PUBLIC_KYODO_REGISTRY in .env.development.local to ${deployedContract.address}`);
};

module.exports.tags = ['KyodoRegistry'];
