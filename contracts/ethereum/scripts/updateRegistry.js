const { ethers, getNamedAccounts, network } = require("hardhat");
require('dotenv').config({ path: '../../.env.development.local' });
const { chainConfigs } = require('./utils/chain_config');


async function storeAtKyodoRegistry(key, address){
    const kyodoRegistry = await ethers.getContract('KyodoRegistry');
    try {
      const tx = await kyodoRegistry.createRegistry(key, address, "1");
      await tx.wait(1);
      console.log(`${key} stored at Registry: ${tx.hash}`);
    } catch (error) {
      if (error.message.includes("The registry already exists")) {
        const updateTx = await kyodoRegistry.updateRegistry(key, address, "1");
        await updateTx.wait(1);
        console.log(`${key} updated at Registry: ${updateTx.hash}`);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  }

async function main() {
    const { deployer } = await getNamedAccounts();

    const codeAtAddress = await ethers.provider.getCode(process.env.NEXT_PUBLIC_KYODO_REGISTRY);
    if (codeAtAddress === '0x') {
        console.error("No contract found at the specified address. Please deploy the registry contract on this network before proceeding.");
        process.exit(1);
    }

    const stableVaultInstance = await ethers.getContract('StableVault', deployer);
    await storeAtKyodoRegistry("VAULT_CONTRACT", stableVaultInstance.target)
  
    const agreementContractInstance = await ethers.getContract('AgreementContract', deployer);
    await storeAtKyodoRegistry("AGREEMENT_CONTRACT", agreementContractInstance.target)
  
    let { token } = chainConfigs[network.name];
    // const token = await ethers.getContract('FakeStable', deployer);
    await storeAtKyodoRegistry("FAKE_STABLE", token)
}
  
main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});