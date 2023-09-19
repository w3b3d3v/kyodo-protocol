import AddAgreement from "../../components/AddAgreement/AddAgreement"
import { AgreementContractProvider } from "../../contexts/ContractContext";
import { AccountProvider } from "../../contexts/AccountContext";

export default function NewAgreement() {
  return (
    <AccountProvider>
      <AgreementContractProvider>
        <AddAgreement />
      </AgreementContractProvider>
    </AccountProvider>
  )
}
