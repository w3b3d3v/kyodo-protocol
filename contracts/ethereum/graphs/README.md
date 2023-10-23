# Graphs

This module contains all subgraphs for ethereum contracts for Kyodo Protocol

# Table content

- [Graphs](#graphs)
- [Table content](#table-content)
  - [Contracts](#contracts)
  - [Handlers](#handlers)
  - [Subgraphs](#subgraphs)
    - [Creating new subgraph](#creating-new-subgraph)
    - [Deploying the subgraphs](#deploying-the-subgraphs)

## Contracts

The [contracts folder](./contracts/) contains one file for each contract handled by a subgraph. This file export a class for each event and method call of the contract.

## Handlers

The [handlers folder](./handlers/) contain one file for each contract handled by any subgraph. This file export a class for each event of the contract. On the [index file](./handlers/index.ts) we define the scripts that will run before indexing every time a new event is created.

## Subgraphs

The [SUBGRAPHS folder](./subgraphs/) contains one folder for each subgraph and each chain. This folder must contain two files: `package.json` and `subgraph.yml` - where we define the contract address and start block for the indexing

### Creating new subgraph

To create a new subgraph first we need to access https://thegraph.com/studio/ and create a new subgraph passing a slug. This process will generate a `deploy key` that will be necessary when deploying the subgraphs.

After that, just copy and paste the [default mumbai subgraph folder](./subgraphs/mumbaiKynodoGraph/). Rename the folder for the slug chosen on the creation. Inside the `package.json` replace all `mumbaikynodograph` for the slug on lower case and inside the `subgraph.yml` replace the two `address` for the proper addresses, the two `network` for the proper network and the two `startBlock` for the proper start blocks  

### Deploying the subgraphs

On the root of the [graphs folder](./) run the following commands

remember to replace the deploy key
```bash
yarn auth ${deploy key}
```

than

```bash
yarn codegen
```

than

```bash
yarn build
```

than

```bash
yarn deploy
```