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

  // const envPath = path.join(__dirname, '../../../.env.development.local');
  // const envContent = fs.readFileSync(envPath, { encoding: 'utf8' });
  // const newEnvContent = envContent.replace(/NEXT_PUBLIC_KYODO_REGISTRY=.*/, `NEXT_PUBLIC_KYODO_REGISTRY=${deployedContract.address}`);
  // fs.writeFileSync(envPath, newEnvContent);
  // console.log(`Updated NEXT_PUBLIC_KYODO_REGISTRY in env.development.local to ${deployedContract.address}`);
};

module.exports.tags = ['KyodoRegistry'];
