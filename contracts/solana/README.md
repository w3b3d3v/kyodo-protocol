# Adding Solana Support to the Project

This guide provides step-by-step instructions for adding Solana support to your project, including installing Anchor and setting up a local Solana node.

## Prerequisites

 solana-agreements-scripts
- Ensure that you have a suitable development environment set up for Solana projects, including Rust, Node.js, and npm.

## Installing Anchor

Anchor is a framework for developing smart contracts on Solana. Follow the Anchor installation tutorial to install Anchor and the main dependencies for Solana projects:

[Anchor Installation](https://www.anchor-lang.com/docs/installation#install-using-pre-build-binary-on-x86-64-linux)

## Configuring Key Pair

Before interacting with Solana, make sure you have a key pair set up. You can create a new key pair using the following command:

```sh
solana-keygen new
```

## Running a Local Solana Node

To run a local Solana node, use the command:

```sh
solana-test-validator
```

This command starts a local Solana node that you can use for testing and development.

### Additional Dependencies for macOS
If you are using a Mac, be aware that you may need to install some additional dependencies, such as `gnu-tar`.

## Setting Up Wallet

To create agreements, you'll need to set up your wallet. Export your private key from Phantom and save it as `PHANTOM_WALLET_PRIVATE_KEY` in the root `.env.development.local` file. Then, run the convert script to transform it into a key pair that is required by most Anchor scripts.

```sh
# Run the conversion script (replace with the correct command if necessary)
./convert-script.sh
```

### Running Deploy Scripts on Non-Linux/Mac Systems

The given commands:

```sh
chmod +x deploy.sh
./scripts/deploy.sh
```

are used to make the deploy script executable and then run it on Linux and Mac systems. If you are using a different operating system, like Windows, you may need to follow a different approach:

- **Windows**: Open a command prompt with administrative privileges and navigate to the directory containing the `deploy.sh` script. You can then run the script using:

```sh
bash scripts/deploy.sh
```

Ensure you have a Bash shell available on your system, like Git Bash or WSL (Windows Subsystem for Linux), to execute the script.

---

### Installing TypeScript and ts-node

Before running the scripts, ensure that TypeScript and ts-node are installed globally on your system. These packages are essential for executing TypeScript files directly. Run the following command to install them:

```sh
npm install -g typescript ts-node
```

This command installs TypeScript and ts-node globally, allowing you to use the `tsc` and `ts-node` commands from the terminal.

---

## Creating Agreements

Run the following command to create agreements:

```sh
ts-node scripts/createAgreements.ts
```

---
If you are using a Mac, be aware that you may need to install some additional dependencies, such as `gnu-tar`. 
