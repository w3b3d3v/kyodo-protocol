import solTransactions from "./solana/transactions"
import ethTransactions from "./ethereum/transactions"
import contractManager from './ContractManager';

class TransactionManager {
  constructor() {
    this.chains = {}
    this.supportedNetworks = contractManager.supportedNetworks

    // Initialize transactions based on chain type
    for (const chain of this.supportedNetworks) {
      this.chains[chain] = ethTransactions;
    }
    this.chains["solana"] = solTransactions;
  }

  async handleTransactionPromise(chain, ...args) {
    return this.chains[chain].handleTransactionPromise(...args);
  }

  async addAgreement(chain, ...args) {
    return this.chains[chain].addAgreement(...args);
  }

  async fetchAgreements(chain, ...args) {
    return this.chains[chain].fetchAgreements(...args);
  }
  
  async payAgreement(chain, ...args) {
    return this.chains[chain].payAgreement(...args);
  }

  async fetchUserBalances(chain, ...args) {
    return this.chains[chain].fetchUserBalances(...args);
  }

  async withdrawFromVault(chain, ...args) {
    return this.chains[chain].withdrawFromVault(...args);
  }

  async saveUserInfo(chain, ...args) {
    return this.chains[chain].saveUserInfo(...args);
  }

  async fetchPaidAgreements(chain, ...args) {
    return this.chains[chain].fetchPaidAgreements(...args);
  }

  async fetchUserInfo(chain, ...args) {
    return this.chains[chain].fetchUserInfo(...args);
  }
}

const manager = new TransactionManager();
export default manager;
