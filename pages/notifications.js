import Web3Inbox from "../components/utils/web3inbox.js"
import { useAccount } from "../contexts/AccountContext"

function Notifications() {
  const { account, selectedChain, projectId } = useAccount()

  return (
    <div className={"default-component"}>
      <Web3Inbox address={account} projectId={projectId} />{" "}
    </div>
  )
}

export default Notifications
