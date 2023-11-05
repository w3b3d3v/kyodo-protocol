import solTransactions from "./solana/transactions"
import ethTransactions from "./ethereum/transactions"

class TransactionManager {
  constructor() {
    this.chains = {}
    this.supportedNetworks = [1115, 10200, 245022926, 31337, 80001, 1442]

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

  async fetchPaidAgreements(chain, ...args) {
    return this.chains[chain].fetchPaidAgreements(...args);
  }
}

const manager = new TransactionManager();
export default manager;
