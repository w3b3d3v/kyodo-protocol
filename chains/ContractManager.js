import ethContracts from "./ethereum/contracts"
import solContracts from "./solana/contracts"

class ContractManager {
  constructor() {
    this.chains = {
      ethereum: ethContracts,
      solana: solContracts,
    }
  }

  verify(chain) {
    this.chains[chain].verify()
  }
}

const manager = new ContractManager()
export default manager
