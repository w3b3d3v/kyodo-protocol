import ethContracts from "./ethereum/contracts"
import solContracts from "./solana/contracts"
import chainConfig from "./chainConfig.json";

class ContractManager {
  constructor() {
    this.chains = {}
    this.supportedNetworks = [1115, 10200, 245022926, 31337, 80001, 1442]
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
    if (chain === "ethereum") {
      return this.addressValidators["ethereum"]
    } else if (chain === "solana") {
      return this.addressValidators["solana"]
    }
    console.error(`Address Validator for ${chain} not found.`);
    return null; 
  }

  getSupportedChains(){
    return this.supportedNetworks
  }

  async tokens(chain, networkId) {
    const config = chain === 'ethereum' ? chainConfig[networkId] : chainConfig[chain];
    
    if (!config) {
      console.error(`Token List for ${chain === 'ethereum' ? `Ethereum network ID ${networkId}` : chain} not found.`);
      return [];
    }
    
    let tokenList = [...(config.tokens || [])];
    
    if (process.env.NODE_ENV !== 'production') {
      const developmentToken = {
        name: 'fakeStable',
        address: chain === 'solana' 
          ? process.env.NEXT_PUBLIC_SOLANA_FAKE_STABLE_ADDRESS 
          : await ethContracts.kyodoRegistry.getRegistry("FAKE_STABLE_ADDRESS"),
        decimals: chain === 'solana' ? 8 : 18,
      };
      tokenList.push(developmentToken);
    }
    return tokenList;
  }
  
  blockExplorer(chain, networkId) {
    const config = chain === 'ethereum' ? chainConfig[networkId] : chainConfig[chain];
    
    if (!config) {
      console.error(`Configuration for ${chain === 'ethereum' ? `Ethereum network ID ${networkId}` : chain} not found.`);
      return null;
    }
    
    return config.blockExplorer.url;
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
