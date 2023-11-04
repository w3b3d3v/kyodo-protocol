import ethContracts from "./ethereum/contracts"
import solContracts from "./solana/contracts"
import chainConfig from "./chainConfig.json";

class ContractManager {
  constructor() {
    this.chains = {}
    this.evmChains = ["hardhat","ethereum", "mumbai"]
    this.supportedNetworks = [1115, 10200, 245022926, 1399811149, 31337]

    // Initialize contracts based on chain type
    for (const chain of this.evmChains) {
      this.chains[chain] = ethContracts;
    }
    this.chains["solana"] = solContracts;
  }

  verify(chain) {
    this.chains[chain].verify()
  }

  getSupportedChains(){
    return this.supportedNetworks
  }

  async tokens(chain) {
    if (!chainConfig[chain]) {
      console.error(`Configuration for ${chain} not found.`);
      return [];
    }

    let tokenList = chainConfig[chain].tokens || [];

    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment) {
      const developmentTokens = {
        solana: { 
          name: 'fakeStable', 
          address: process.env.NEXT_PUBLIC_SOLANA_FAKE_STABLE_ADDRESS, 
          decimals: 8 
        },
        default: { 
          address: await ethContracts.kyodoRegistry.getRegistry("FAKE_STABLE_ADDRESS"), 
          name: 'fakeStable', 
          decimals: 18 
        }
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
