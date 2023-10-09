import UserCheck from "../../components/UserCheck/UserCheck"
import { AgreementContractProvider } from "../../contexts/ContractContext";
import AgreementList from '../../components/AgreementList/AgreementList';

export default function Agreements() {
  return (
    <AgreementContractProvider>
      <AgreementList />
    </AgreementContractProvider>
  )
}