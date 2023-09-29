import { agreementContract } from "./contracts/agreementContract"
import { vaultContract } from "./contracts/vaultContract"

async function verify() {
  const HARDHAT_IDS = ["0x7A69", "31337"]
  const testEnv = process.env.NODE_ENV === "production"
  const chainId = window.ethereum.networkVersion

  if (testEnv) {
    if (HARDHAT_IDS.includes(chainId)) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: HARDHAT_IDS[0],
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
