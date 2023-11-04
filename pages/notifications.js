import Balances from "../../components/Dashboard/Balances.js"
import Web3Inbox from "../../components/utils/web3inbox.js"
import { useAccount } from "../../contexts/AccountContext"

function Notifications() {
  const { account, selectedChain, projectId } = useAccount()

  return <Web3Inbox address={account} projectId={projectId} />
}

export default Notifications
