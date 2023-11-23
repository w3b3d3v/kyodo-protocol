## Requirements

Before starting, ensure you have your mnemonic phrase set in the `.env` file. It should be formatted as follows:

```
MNEMONIC=your_mnemonic_phrase_here
```

## Running Tests

To run tests, follow these steps:

1. Start a local node:

   ```
   npx hardhat node
   ```

2. Then, execute the tests:

   ```
   npx hardhat test
   ```

## Deploying to Individual Networks

To deploy contracts to a specific network, follow these steps:

1. Deploy the Registry:

   ```
   npx hardhat deploy --network "network_name"
   ```

   Replace `"network_name"` with the name of your target network.

2. Deploy the AgreementContract and the Vault:

   ```
   npx hardhat run scripts/deployAgreementAndVault.js --network "network_name"
   ```

   Again, replace `"network_name"` with your chosen network.

## Deploying the Registry to Multiple Networks

To deploy the Registry to multiple networks:

1. Run the multichain deployment:

   ```
   npx hardhat deploy:multichain
   ```

   This will deploy to all networks configured in `hardhat.config.js` and listed in the `deployMultichain.js` file.

2. Next, deploy the AgreementContract and the Vault individually on each chain. Repeat the deployment command for each network as described in the "Deploying to Individual Networks" section.

---

### Automated Documentation Generation

To enhance understanding and collaboration on our project, we provide tools to automatically generate documentation for our Solidity contracts. Here's how you can generate UML diagrams and detailed documentation for individual contracts:

1. **Generate UML Diagrams for Individual Contracts:**
   - For `StableVault.sol`:
     ```
     npx sol2uml ./contracts/StableVault.sol -o ./docs/diagram/StableVault.svg
     ```
   - For `AgreementContract.sol`:
     ```
     npx sol2uml ./contracts/AgreementContract.sol -o ./docs/diagram/AgreementContract.svg
     ```

   The `sol2uml` utility will generate UML diagrams, providing a visual representation of the contract structure, including inherited contracts and dependencies.

2. **Generate Detailed Documentation for Public and External Functions:**
   ```
   npx solidity-docgen --solc-module solc-0.8 -t ./docs/template/external -o ./docs/output/external
   ```

   The `solidity-docgen` tool will produce documentation focusing on public and external functions, giving you a clear view of the contract's interfaces and functionalities.

Make sure you have the necessary environment set up to run these commands. The generated UML diagrams and documentation can be found in the directories specified in the commands above.
