const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { chainConfigs, chainIdList, chainSelectorList } = require('../scripts/utils/chain_config');


function printArray(_array) {
  let returnedValue;

  _array.forEach(item => {
    if (returnedValue) {
      returnedValue += `"${item}",`
    } else {
      returnedValue = `"${item}",`
    }
  });

  return returnedValue.substring(0, returnedValue.length - 1);
}

module.exports = async ({ getNamedAccounts, deployments, ethers, network }) => {
  const { deploy } = deployments;
  const { deployer, kyodoTreasury, communityTreasury } = await getNamedAccounts();

  const salt = '0x';

  const networkName = network.name;
  const { linkAddress, routerAddress, chainSelector } = chainConfigs[networkName];

  const stableVaultInstance = await ethers.getContract('StableVault');
  const kyodoRegistryInstance = await ethers.getContract('KyodoRegistry', deployer);

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
    log: true
  });

  console.log(`AgreementContract Address: ${deployedContract.address}`);
  const blockNumber = await ethers.provider.getBlockNumber();
  const tx = await kyodoRegistryInstance.updateRegistry("AGREEMENT_CONTRACT", deployedContract.address, blockNumber);
  await tx.wait();

  try {
    if (network.name != "hardhat" && network.name != "testing" && network.name != "localhost") {
      
      const argsPath = path.join(__dirname, `../deployments/${network.name}/args.js`);
      fs.writeFileSync(argsPath, `module.exports = ["${kyodoTreasury}", "${communityTreasury}", "${deployer}", "${routerAddress}", "${linkAddress}", "${chainSelector}", "${stableVaultInstance.target}", [${printArray(chainIdList)}], [${printArray(chainSelectorList)}]];`);
    
      const { stdout, stderr } = await exec(`npx hardhat verify --network ${network.name} ${deployedContract.address} --constructor-args ./deployments/${network.name}/args.js`);
      console.log('stdout:', stdout);
    }
  } catch (e) {
    console.error(e);
  }

  //   const envPath = path.join(__dirname, '../../../.env.development.local');
  //   const envContent = fs.readFileSync(envPath, { encoding: 'utf8' });
  //   const newEnvContent = envContent.replace(/NEXT_PUBLIC_KYODO_REGISTRY=.*/, `NEXT_PUBLIC_KYODO_REGISTRY=${deployedContract.address}`);
  //   fs.writeFileSync(envPath, newEnvContent);
  //   console.log(`Updated NEXT_PUBLIC_KYODO_REGISTRY in env.development.local to ${deployedContract.address}`);
};

module.exports.tags = ['AgreementContract'];
