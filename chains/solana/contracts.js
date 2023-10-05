import { agreementContract } from "./contracts/agreementContract"
// import { vaultContract } from "./contracts/vaultContract"

async function verify() {
  // Unfortunatelly phantom wallet or solana object does not offer a clear way to get the network id
  // so we have to use just ask the user to manually change to the localnetwork while testing
  alert("Please change to localnet. Phantom > Settings > Developer Settings")
}

const contracts = { agreementContract, verify }
export default contracts