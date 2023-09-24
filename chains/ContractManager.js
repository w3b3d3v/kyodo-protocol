import { 
  initializeAgreementContract as initializeEthereumAgreementContract 
} from './ethereum/initializeAgreementContract';
import { 
  initializeVaultContract as initializeEthereumVaultContract 
} from './ethereum/initializeVaultContract';

class ContractManager {
  constructor() {
    this.chainInitializers = {
      ethereum: {
        AgreementContract: initializeEthereumAgreementContract,
        VaultContract: initializeEthereumVaultContract,
      },
      // solana: {
      //   AgreementContract: initializeSolanaAgreementContract,
      // },
    };
  }

  getContract(chain, contractType) {
    if (this.chainInitializers[chain] && this.chainInitializers[chain][contractType]) {
      return this.chainInitializers[chain][contractType]();
    }
    alert("Please select a valid chain")
    localStorage.setItem('selectedChain', null);
    // throw new Error(`Unsupported chain or contract type: ${chain}, ${contractType}`);
  }
}

const manager = new ContractManager();
export default manager;
