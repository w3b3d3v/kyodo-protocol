// src/chains/transactionManager.js
import { addAgreement as ethAddAgreement } from "./ethereum/transactions";
import { addAgreement as solAddAgreement } from "./solana/transactions";

class TransactionManager {
  constructor() {
    this.chains = {
      ethereum: {
        addAgreement: ethAddAgreement
      },
      solana: {
        addAgreement: solAddAgreement
      },
    };    
  }

  async addAgreement(chain, ...args) {
    this.chains[chain].addAgreement(...args);
  }
}

const manager = new TransactionManager();
export default manager;
