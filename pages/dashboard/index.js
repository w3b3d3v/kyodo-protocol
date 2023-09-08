import { VaultContractProvider } from "../../components/ContractContext";
import Balances from '../../components/dashboard/Balances';

function Dashboard() {
  return (
    <VaultContractProvider>
      <Balances />
    </VaultContractProvider>
  )
}
  
export default Dashboard;