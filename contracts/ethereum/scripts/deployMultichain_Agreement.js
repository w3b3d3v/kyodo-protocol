const { exec } = require('child_process');

const networks = ["ETHSepolia", "optimismGoerli", "avalancheFuji", "arbitrumGoerli", "polygonMumbai", "bnbTesnet", "baseGoerli", "polygonZkEvmTestnet", "testing"];

networks.forEach(network => {
  exec(`npx hardhat run scripts/deployAgreement.js --network ${network}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Erro ao implantar na rede ${network}: ${err}`);
      return;
    }
    console.log(`Deployment to ${network} completed`);
    console.log(stdout);
  });
});