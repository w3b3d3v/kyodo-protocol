# Kyōdō Protocol 

The future of work is being transformed by the relationship between Professionals, Communities and Businesses. Kyōdō Protocol facilitates trusted connections between these professional parties with a decentralized, blockchain-driven solution. The protocol provides a payments system with verifiable credentials and proof of curriculum using Zero Knowledge Proofs (ZKP) to enhance privacy. 

For more information about how Kyōdō functions, head to [Kyōdō Protocol docs](https://docs.kyodoprotocol.xyz/). 


## Prerequisites

Before you begin, make sure you have Node.js and npm installed on your machine. If not, you can download and install them from the [official Node.js website](https://nodejs.org/).

## Getting Started

### Step 0: Install Dependencies

First, you'll need to install the project dependencies. Navigate to the project root directory in your terminal and run:

```bash
npm install
# or
yarn install
```

## Index

- [Kyōdō Protocol](#kyōdō-protocol)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
    - [Step 0: Install Dependencies](#step-0-install-dependencies)
  - [Index](#index)
  - [1 - Environment Setup](#1---environment-setup)
  - [2 - Setting Up Local Blockchain](#2---setting-up-local-blockchain)
  - [3 - Deploying Smart Contracts](#3---deploying-smart-contracts)
  - [4 - Run the development server:](#4---run-the-development-server)
- [🌟 Interacting with Smart Contracts 🌟](#-interacting-with-smart-contracts-)
    - [Via Scripts](#via-scripts)
    - [Via Frontend](#via-frontend)
  - [Contribution](#contribution)
  - [Contact](#contact)
  - [License](#license)

---

## 1 - Environment Setup
Make sure you have an `.env.development.local` file in your root directory. A template file named `.env.development.local.sample` is provided. Rename it to `.env.development.local`

To run tests or deploy contracts on the Mumbai test network, you'll need to set up the appropriate environment variables in the `.env` file in your root directory. A template file named `.env.sample` is provided. Rename it to `.env`

## 2 - Setting Up Local Blockchain
Run a Hardhat node:

```bash
cd contracts/ethereum
npx hardhat node --fork https://rpc.ankr.com/eth_goerli
```

The node will generate some accounts. Add the first one to Metamask.
> **_NOTE:_** Note: Use the first account to avoid errors.

## 3 - Deploying Smart Contracts
Deploy the Agreement contract and the fake Stablecoin:
```bash
cd contracts/ethereum
npx hardhat run scripts/deploy.js
```

## 4 - Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# 🌟 Interacting with Smart Contracts 🌟
You can interact with the smart contracts either through the frontend application or by running the following scripts:

### Via Scripts

Create an agreement:
```bash
cd contracts/ethereum
npx hardhat run scripts/createAgreements.js
```

Retrieve all agreements or the user (deployer) agreements:
```bash
cd contracts/ethereum
npx hardhat run scripts/retrieveAgreements.js
```

Pay for the agreement you've created:
```bash
cd contracts/ethereum
npx hardhat run scripts/payAgreements.js
```

### Via Frontend
To pay for the agreement through the user interface, you need to allow the contract first, as the logic to check allowance through the UI is not implemented yet:

```bash
cd contracts/ethereum
npx hardhat run scripts/allow.js
```

## Contribution

We're always open to contributions to improve and expand the project! If you're interested in contributing, the best way to start is by checking out our [Roadmap and Milestones](https://github.com/orgs/w3b3d3v/projects/2/views/2) under the Projects tab. This will give you an overview of what we're currently working on and what we plan to tackle next.

## Contact

For more information or if you have any questions, feel free to reach out to us on our [Discord Server](https://discord.com/invite/kNepSv2HPG). We're more than happy to assist you!

## License

This project is licensed under the MIT License. This means you are free to use, modify, and distribute the code, as long as you include the original copyright and license notice in any copy of the software/source. For more details, please refer to the LICENSE file in the repository.

## Editing styles

### Global SASS
header, footer, forms, grid, components...

```
className="class-name"
```

### Modules
Contextualized SASS
```
className={styles["class-name"]}
```