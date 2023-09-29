// src/chains/transactionManager.js
import addAgreement from "./ethereum/transactions";

class TransactionManager {
  constructor() {
    this.chains = {
      ethereum: {
        addAgreement
      },
    };
  }

  async addAgreement(chain, ...args) {
    if (this.chains[chain] && typeof this.chains[chain].addAgreement === 'function') {
      return this.chains[chain].addAgreement(...args);
    } else {
      console.error("Unsupported blockchain or method:", chain);
      throw new Error(`Unsupported blockchain or method: ${chain}`);
    }
  }
}

const manager = new TransactionManager();
export default manager;
