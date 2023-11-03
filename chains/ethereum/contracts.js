import { ethers } from 'ethers';
import KyodoRegistry from './abis/KyodoRegistry.json';
import AgreementContract from './abis/AgreementContract.json';
import VaultContract from './abis/StableVault.json';

const REGISTRY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_KYODO_REGISTRY

function getRegistryContract() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return new ethers.Contract(REGISTRY_CONTRACT_ADDRESS, KyodoRegistry.abi, provider.getSigner());
  } catch (e) {
    console.error("Failed to instantiate the registry contract", e);
  }
}

async function getContractInstance(abi, contractName) {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const registryContract = getRegistryContract();

    const contractAddress = await registryContract.getRegistry(contractName);

    return new ethers.Contract(contractAddress, abi, provider.getSigner()); 
  } catch (e) {
    console.log("failed to instantiate contract")
    console.log(e)
  }
}

const contracts = {
  kyodoRegistry: getRegistryContract(),
  agreementContract: () => getContractInstance(AgreementContract.abi, "AGREEMENT_CONTRACT_ADDRESS"),
  vaultContract: () => getContractInstance(VaultContract.abi, "VAULT_CONTRACT_ADDRESS"),
  
  verify: async () => {
    const TEST_NETWORKS = ["0x7A69", "31337", "534351"]
    const testEnv = process.env.NODE_ENV === "development"
    const chainId = window.ethereum.networkVersion
  
    if (testEnv) {
      if (!TEST_NETWORKS.includes(chainId)) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: TEST_NETWORKS[0],
              rpcUrls: ["http://localhost:8545"],
              chainName: "Hardhat",
              nativeCurrency: {
                name: "ETH",
                symbol: "HETH",
                decimals: 18,
              },
            },
          ],
        })
      }
    }
  },
};

export default contracts;
