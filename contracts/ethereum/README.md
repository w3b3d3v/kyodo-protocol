---

**Testing Suite Configuration:**

Currently, the full test suite is configured to run on a fork of the Goerli network. To execute the tests, you will need to initiate a local node using the following command:

```bash
npx hardhat node --fork https://rpc.ankr.com/eth_goerli
```

However, if you are solely interested in testing the "Agreement" section on your local network, the following commands will suffice:

```bash
npx hardhat node
npx hardhat test --network localhost
```

Please note: Tests concerning payment processing with Spark are expected to fail in this local setup.

**Utilizing Your Own Account for Testing:**

If you wish to conduct tests using your own account, you'll require some mock DAI for processing deposits on Spark. The accepted mock DAI address by Spark is `0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844`. Acquire mock DAI by swapping your Goerli ETH for mock DAI on [Uniswap](https://app.uniswap.org/swap).

Acquiring ETH on the Goerli network can be challenging. It's recommended to obtain mock ETH from the [Balancer Faucet](https://app.balancer.fi/#/goerli/faucet).

---