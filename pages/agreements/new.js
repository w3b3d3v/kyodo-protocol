import AddAgreement from "../../components/AddAgreement/AddAgreement"
import { AccountProvider } from "../../contexts/AccountContext";

export default function NewAgreement() {
  return (
    <AccountProvider>
        <AddAgreement />
    </AccountProvider>
  )
}
