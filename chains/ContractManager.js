import ethContracts from "./ethereum/contracts"
import solContracts from "./solana/contracts"
import chainConfig from "./chainConfig.json";

class ContractManager {
  constructor() {
    this.chains = {}
    this.evmChains = ["ethereum", "mumbai"];

    // Initialize contracts based on chain type
    for (const chain of this.evmChains) {
      this.chains[chain] = ethContracts;
    }
    this.chains["solana"] = solContracts;
  }

  verify(chain) {
    this.chains[chain].verify()
  }

  tokens(chain) {
    if (!chainConfig[chain]) {
      console.error(`Configuration for ${chain} not found.`);
      return [];
    }

    let tokenList = chainConfig[chain].tokens || [];

    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment) {
      const developmentTokens = {
        solana: { name: 'fakeStable', address: process.env.NEXT_PUBLIC_SOLANA_FAKE_STABLE_ADDRESS, decimals: 8 },
        default: { name: 'fakeStable', address: process.env.NEXT_PUBLIC_FAKE_STABLE_ADDRESS, decimals: 18 }
      };

      // Add the correct development token based on the chain. If the chain-specific development token doesn't exist, use the default one.
      const developmentTokenToAdd = developmentTokens[chain] || developmentTokens.default;
      tokenList = [...tokenList, developmentTokenToAdd];
    }

    return tokenList;
  }

  blockExplorer(chain) {
    if (!chainConfig[chain]) {
      console.error(`Configuration for ${chain} not found.`);
      return null;
    }
    return chainConfig[chain].blockExplorer;
  }
}

const manager = new ContractManager()
export default manager
