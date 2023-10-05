import solTransactions from "./solana/transactions"
import ethTransactions from "./ethereum/transactions"

class TransactionManager {
  constructor() {
    this.chains = {
      ethereum: ethTransactions,
      solana: solTransactions,
    }
  }

  async addAgreement(chain, ...args) {
    this.chains[chain].addAgreement(...args);
  }
}

const manager = new TransactionManager();
export default manager;
