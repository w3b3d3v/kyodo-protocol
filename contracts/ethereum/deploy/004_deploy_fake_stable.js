const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();

  const salt = '0x';
  const inititalSupply = ethers.parseEther("100000");
  const decimals = 18;

  const deployedContract = await deploy('FakeStable', {
    from: deployer,
    args: [deployer, inititalSupply, decimals],
    log: true,
    deterministicDeployment: salt
  });

  console.log(`Deployer: ${deployer}`);
  console.log(`FakeStable Address: ${deployedContract.address}`);
  exec(`npx hardhat verify --network ${network.name} ${deployedContract.address} ${deployer} ${inititalSupply} ${decimals}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Erro ao verificar na rede ${network.name}: ${err}`);
      return;
    }
    console.log(stdout);
  });

  // const envPath = path.join(__dirname, '../../../.env.development.local');
  // const envContent = fs.readFileSync(envPath, { encoding: 'utf8' });
  // const newEnvContent = envContent.replace(/NEXT_PUBLIC_KYODO_REGISTRY=.*/, `NEXT_PUBLIC_KYODO_REGISTRY=${deployedContract.address}`);
  // fs.writeFileSync(envPath, newEnvContent);
  // console.log(`Updated NEXT_PUBLIC_KYODO_REGISTRY in env.development.local to ${deployedContract.address}`);
};

module.exports.tags = ['FakeStable'];
