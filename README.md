## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 1 - Setting Up Local Blockchain with Hardhat
Run a Hardhat node:

```bash
npx hardhat node
```

The node will generate some accounts. Add the first one to Metamask.
> **_NOTE:_** Note: Use the first account to avoid errors.

## 2 - Environment Setup
Make sure you have an `.env.development.local` file in your root directory. A template file named `.env.development.local.sample` is provided. Rename it to `.env.development.local`

To run tests or deploy contracts on the Mumbai test network, you'll need to set up the appropriate environment variables in the `.env` file in your root directory. A template file named `.env.sample` is provided. Rename it to `.env`

## 3 - Deploying Smart Contracts
Deploy the Agreement contract and the fake Stablecoin:
```bash
npx hardhat run scripts/deploy.js
```

# 🌟 Interacting with Smart Contracts 🌟
You can interact with the smart contracts either through the frontend application or by running the following scripts:

### Via Scripts

Create an agreement:
```bash
npx hardhat run scripts/createAgreements.js
```

Retrieve all agreements or the user (deployer) agreements:
```bash
npx hardhat run scripts/retrieveAgreements.js
```

Pay for the agreement you've created:
```bash
npx hardhat run scripts/payAgreements.js
```

### Via Frontend
To pay for the agreement through the user interface, you need to allow the contract first, as the logic to check allowance through the UI is not implemented yet:

```bash
npx hardhat run scripts/allow.js
```
