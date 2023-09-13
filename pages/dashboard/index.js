import { VaultContractProvider, AgreementContractProvider } from "../../contexts/ContractContext";
import Balances from '../../components/dashboard/Balances.js';

function Dashboard() {
  return (
    <AgreementContractProvider>
      <VaultContractProvider>
        <Balances />
      </VaultContractProvider>
    </AgreementContractProvider>
  )
}
  
export default Dashboard;