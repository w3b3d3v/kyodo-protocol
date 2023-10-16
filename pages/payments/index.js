import { AgreementContractProvider } from "../../contexts/ContractContext";
import Payments from "../../components/Dashboard/Payments.js"

export default function Agreements() {
  return (
    <AgreementContractProvider>
      <Payments />
    </AgreementContractProvider>
  )
}