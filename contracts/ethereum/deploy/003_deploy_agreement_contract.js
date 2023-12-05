const fs = require('fs');
const path = require('path');
const util = require('util');
const yaml = require('js-yaml');
const exec = util.promisify(require('child_process').exec);

const { chainConfigs, chainIdList, chainSelectorList } = require('../scripts/utils/chain_config');


function printArray(_array) {
  let returnedValue;

  _array.forEach(item => {
    if(returnedValue) {
      returnedValue += `"${item}",`
    } else {
      returnedValue = `"${item}",`
    }
  });

  return returnedValue.substring(0, returnedValue.length-1);
}

module.exports = async ({ getNamedAccounts, deployments, ethers, network }) => {
  const { deploy } = deployments;
  const { deployer, kyodoTreasury, communityTreasury } = await getNamedAccounts();

  const salt = '0x';

  const networkName = network.name;
  const { linkAddress, routerAddress, chainSelector, subgraphPathSchema } = chainConfigs[networkName];

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
    log: true
  });

  console.log(`AgreementContract Address: ${deployedContract.address}`);
  const argsPath = path.join(__dirname, `../deployments/${network.name}/args.js`);
  fs.writeFileSync(argsPath, `module.exports = ["${kyodoTreasury}", "${communityTreasury}", "${deployer}", "${routerAddress}", "${linkAddress}", "${chainSelector}", "${stableVaultInstance.target}", [${printArray(chainIdList)}], [${printArray(chainSelectorList)}]];`);

  // try {
  //   const { stdout, stderr } = await exec(`npx hardhat verify --network ${network.name} ${deployedContract.address} --constructor-args ./deployments/${network.name}/args.js`);
  //   console.log('stdout:', stdout);
  // } catch (e) {
  //   console.error(e);
  // }

  const yamlPath = path.join(__dirname, subgraphPathSchema);
  let yamlContent = yaml.load(fs.readFileSync(yamlPath, 'utf8'));
  console.log("yamlContent", yamlContent)
  
  yamlContent.dataSources.forEach(source => {
    if (source.name === 'AgreementContract') {
      source.source.address = deployedContract.address;
      source.source.startBlock = deployedContract.receipt.blockNumber;
    }
  });

  fs.writeFileSync(yamlPath, yaml.dump(yamlContent));
  console.log(`Updated address in YAML file to ${deployedContract.address}`);
};

module.exports.tags = ['AgreementContract'];
