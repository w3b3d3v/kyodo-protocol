import UserCheck from "../../components/UserCheck/UserCheck"
import { AgreementContractProvider } from "../../components/ContractContext";

export default function Agreements() {
  return (
    <AgreementContractProvider>
      <UserCheck />
    </AgreementContractProvider>
  )
}