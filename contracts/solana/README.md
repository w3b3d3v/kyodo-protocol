# Adding Solana Support to the Project

This guide provides step-by-step instructions for adding Solana support to your project, including installing Anchor and setting up a local Solana node.

## Prerequisites

- Ensure you have a suitable development environment set up for Solana projects, including Rust, Node.js, and npm.

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