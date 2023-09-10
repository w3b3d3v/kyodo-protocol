import UserCheck from "../../components/UserCheck/UserCheck"
import { AgreementContractProvider } from "../../contexts/ContractContext";

export default function Agreements() {
  return (
    <AgreementContractProvider>
      <UserCheck />
    </AgreementContractProvider>
  )
}