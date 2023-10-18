import { agreementContract } from "./contracts/agreementContract"
import { vaultContract } from "./contracts/vaultContract"

async function verify() {
  const TEST_NETWORKS = ["0x7A69", "31337", "534351"]
  const testEnv = process.env.NODE_ENV === "development"
  const chainId = window.ethereum.networkVersion

  if (testEnv) {
    if (!TEST_NETWORKS.includes(chainId)) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: TEST_NETWORKS[0],
            rpcUrls: ["http://localhost:8545"],
            chainName: "Hardhat",
            nativeCurrency: {
              name: "ETH",
              symbol: "HETH",
              decimals: 18,
            },
          },
        ],
      })
    }
  }
}

const contracts = { agreementContract, vaultContract, verify }

export default contracts
