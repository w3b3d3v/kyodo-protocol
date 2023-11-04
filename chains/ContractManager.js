import ethContracts from "./ethereum/contracts"
import solContracts from "./solana/contracts"
import chainConfig from "./chainConfig.json";

class ContractManager {
  constructor() {
    this.chains = {}
    this.supportedNetworks = [1115, 10200, 245022926, 31337, 80001]
    this.addressValidators = {
      ethereum: /^0x[a-fA-F0-9]{40}$/,
      solana: /^[1-9A-HJ-NP-Za-km-z]{43,44}$/,
    };

    // Initialize contracts based on chain type
    for (const chain of this.supportedNetworks) {
      this.chains[chain] = ethContracts;
    }
    this.chains["solana"] = solContracts;
  }

  verify(chain) {
    this.chains[chain].verify()
  }

  getAddressValidator(chain) {
    if (this.supportedNetworks.includes(Number(chain))) {
      return this.addressValidators["ethereum"]
    } else if (chain === "solana") {
      return this.addressValidators["solana"]
    }
    console.error(`Address Validator for ${chain} not found.`);
    return null;  // ou talvez lançar um erro se a chain não for reconhecida
  }

  getSupportedChains(){
    return this.supportedNetworks
  }

  async tokens(chain) {
    if (!chainConfig[chain]) {
      console.error(`Token List for ${chain} not found.`);
      return [];
    }

    let tokenList = chainConfig[chain].tokens || [];

    const isDevelopment = process.env.NODE_ENV !== 'production';
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
    return chainConfig[chain].blockExplorer.url;
  }

  chainMetadata(chain) {
    if (!chainConfig[chain]) {
      console.error(`Metadata for ${chain} not found.`);
      return null;
    }
    return {
      "name": chainConfig[chain].name,
      "logo": chainConfig[chain].logo,
    };
  }
}

const manager = new ContractManager()
export default manager
