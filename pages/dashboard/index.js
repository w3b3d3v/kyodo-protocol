import Balances from '../../components/Dashboard/Balances.js';
import Web3Inbox from "../../components/utils/web3inbox.js"
import { useAccount } from "../../contexts/AccountContext"

function Dashboard() {
  const { account, selectedChain, projectId } = useAccount()

  console.log(projectId)
  console.log("legal")

  return (
    <div>
      <h1>Dashboard</h1>
      <Balances />
      <Web3Inbox address={account} projectId={projectId} />
    </div>
  )
}
  
export default Dashboard;