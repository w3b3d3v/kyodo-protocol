const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

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
    log: true,
    deterministicDeployment: salt
  });

  console.log(`StableVault Address: ${deployedContract.address}`);
  exec(`npx hardhat verify --network ${network.name} ${deployedContract.address} ${deployer} ${tokenName} ${tokenSymbol} ${routerAddress}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Erro ao verificar na rede ${network.name}: ${err}`);
      return;
    }
    console.log(stdout);
  });

  //   const envPath = path.join(__dirname, '../../../.env.development.local');
  //   const envContent = fs.readFileSync(envPath, { encoding: 'utf8' });
  //   const newEnvContent = envContent.replace(/NEXT_PUBLIC_KYODO_REGISTRY=.*/, `NEXT_PUBLIC_KYODO_REGISTRY=${deployedContract.address}`);
  //   fs.writeFileSync(envPath, newEnvContent);
  //   console.log(`Updated NEXT_PUBLIC_KYODO_REGISTRY in env.development.local to ${deployedContract.address}`);
};

module.exports.tags = ['StableVault'];
