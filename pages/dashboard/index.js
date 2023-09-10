import { VaultContractProvider } from "../../contexts/ContractContext";
import Balances from '../../components/Dashboard/Balances';

function Dashboard() {
  return (
    <VaultContractProvider>
      <Balances />
    </VaultContractProvider>
  )
}
  
export default Dashboard;