const fs = require('fs');
const path = require('path');
const { chainConfigs, chainIdList, chainSelectorList } = require('../scripts/utils/chain_config');

module.exports = async ({ getNamedAccounts, deployments, ethers, network }) => {
  const { deploy } = deployments;
  const { deployer, kyodoTreasury, communityTreasury } = await getNamedAccounts();

  const salt = '0x';

  const networkName = network.name;
  const { linkAddress, routerAddress, chainSelector, feePercentage, kyodoTreasuryFee, communityDAOFee } = chainConfigs[networkName];

  const stableVaultInstance = await ethers.getContract('StableVault');

  const deployedContract = await deploy('AgreementContract', {
    from: deployer,
    args: [kyodoTreasury,
            communityTreasury,
            deployer,
            routerAddress,
            linkAddress,
            chainSelector,
            stableVaultInstance.target,
            chainIdList,
            chainSelectorList],
    log: true,
    deterministicDeployment: salt
  });

  console.log(`AgreementContract Address: ${deployedContract.address}`);

  //   const envPath = path.join(__dirname, '../../../.env.development.local');
  //   const envContent = fs.readFileSync(envPath, { encoding: 'utf8' });
  //   const newEnvContent = envContent.replace(/NEXT_PUBLIC_KYODO_REGISTRY=.*/, `NEXT_PUBLIC_KYODO_REGISTRY=${deployedContract.address}`);
  //   fs.writeFileSync(envPath, newEnvContent);
  //   console.log(`Updated NEXT_PUBLIC_KYODO_REGISTRY in env.development.local to ${deployedContract.address}`);
};

module.exports.tags = ['AgreementContract'];
