import AddAgreement from "../../components/AddAgreement/AddAgreement"
import { AgreementContractProvider } from "../../contexts/ContractContext";

export default function NewAgreement() {
  return (
    <AgreementContractProvider>
    <AddAgreement />
    </AgreementContractProvider>
  )
}
