# Adding Solana Support to the Project

This guide provides step-by-step instructions for adding Solana support to your project, including installing Anchor, setting up a local Solana node, and updating various configurations.

## Prerequisites

- Ensure that you have a suitable development environment set up for Solana projects, including Rust, Node.js, and npm.

## Installing Anchor

Anchor is a framework for developing smart contracts on Solana. Follow the Anchor installation tutorial to install Anchor and the main dependencies for Solana projects:

[Anchor Installation](https://www.anchor-lang.com/docs/installation#install-using-pre-build-binary-on-x86-64-linux)

### Installing TypeScript and ts-node

Before running the scripts, ensure that TypeScript and ts-node are installed globally on your system. These packages are essential for executing TypeScript files directly. Run the following command to install them:

```sh
npm install -g typescript ts-node
```

This command installs TypeScript and ts-node globally, allowing you to use the `tsc` and `ts-node` commands from the terminal.

---

## Configuring Key Pair

Before interacting with Solana, make sure you have a key pair set up. You can create a new key pair using the following command:

```sh
solana-keygen new
```

## Wallet and Environment Configuration

1. Place the path of the wallet generated by `solana-keygen` into `ANCHOR_WALLET` in your `.env` file.
2. Copy the wallet address and airdrop 6 SOL to the wallet.
3. Configure the wallet addresses that will receive tokens after transactions in your `.env`:

```
SOL_KYODO_TREASURY_ADDRESS=
SOL_COMMUNITY_TREASURY_ADDRESS=
SOL_PROFESSIONAL_ADDRESS=
```

4. Update the wallet path in `anchor.toml`.

## Deployment Steps

1. Deploy to the testnet to generate a `programID`:

```sh
chmod +x scripts/deploy.sh
bash scripts/deploy.sh testnet
```

2. Replace the `programID` address in `src/lib.rs` with your new address.
3. Update the `programID` in `anchor.toml`.
4. Deploy again to the devnet:

```sh
bash scripts/deploy.sh devnet
```

5. Execute the initialization script to set up the required data for the program:

```sh
ts-node scripts/initializePaymentInfrastructure.ts
```