const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { chainConfigs } = require('../utils/chain_config');

async function main() {
  for (config of Object.keys(chainConfigs)) {
    if (chainConfigs[config].live) {
      const { stdout, stderr } = await exec(`npx hardhat run ./scripts/chainlink/chainLinkTests.js --network ${config}`);
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });