const { execSync } = require("child_process");

const networks = ["scroll", "mumbai", "bnbTesnet", "fantomTesnet"];

function deployOnNetwork(network) {
  console.log(`\nDeploying to ${network}...`);
  
  // Execute the deployment script for each network using a subprocess
  execSync(`npx hardhat run scripts/deploy.js --network ${network}`, { stdio: 'inherit' });
}

for (const network of networks) {
  deployOnNetwork(network);
}   