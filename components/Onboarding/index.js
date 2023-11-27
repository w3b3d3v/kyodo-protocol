import styles from "./Onboarding.module.scss";
import Image from 'next/image';
import { useState, useEffect } from "react"
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useTranslation } from "react-i18next";
import useTransactionHandler from '../../hooks/useTransactionHandler';
import Loader from '../utils/Loader';
import Toast from '../utils/Toast';
import { useAccount } from "../../contexts/AccountContext";
import contractManager from '../../chains/ContractManager';
import { useRouter } from 'next/router'

function Onboarding() {
  const [name, setName] = useState('');
  const [taxDocument, setTaxDocument] = useState('');
  const [contract, setContract] = useState("")
  const { selectedNetworkId } = useAccount()
  const { wallet } = useWallet()
  const { connection } = useConnection()
  const router = useRouter()

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleTaxDocumentChange = (e) => {
    setTaxDocument(e.target.value);
  };

  const { t } = useTranslation();
  const {
    isLoading,
    setIsLoading,
    transactionSuccess,
    transactionPending,
    transactionFail,
    errorMessage,
    sendTransaction,
    transactionHash,
  } = useTransactionHandler()

  useEffect(() => {
    async function initializeContract() {
      try {
        setIsLoading(true)
        const details = {
          wallet,
          connection,
        }

        const agreementContract = await contractManager.chains[selectedNetworkId].agreementContract(
          details
        )
        setContract(agreementContract)
      } catch (error) {
        console.error("Error when getting the contract", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeContract()
  }, [selectedNetworkId, wallet, connection])

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      await saveUserInfo()
    } catch (errors) {
      console.log(errors)
    }
  }

  const saveUserInfo = async () => {
    const details = {
      name,
      taxDocument,
      contract
    };

    const onConfirmation = () => {
      setName("")
      setTaxDocument("")
      setTimeout(() => {
        setIsLoading(false)
        router.push("/dashboard")
      }, 3000)
    }

    await sendTransaction("saveUserInfo", details, "UserInfoStored", onConfirmation)
  }

  return (
    <div className={styles["onboarding"]}>
      <Loader isLoading={isLoading} />
      <Toast
        transactionSuccess={transactionSuccess}
        transactionPending={transactionPending}
        transactionFail={transactionFail}
        errorMessage={errorMessage}
        transactionHash={transactionHash}
      />
      <div className={styles["onboarding-steps"]}>
        <h1>{t("welcome")}</h1>
        <ul>
          <li className={styles["done-step"]}>
            <Image src="/onboarding/checked-icon.svg" width={20} height={23} alt="Done" />
            <p>{t("connect-wallet")}</p>
          </li>
          <li className={styles["current-step"]}>
            <Image src="/onboarding/current-icon.svg" width={20} height={23} alt="Current" />
            <p>{t("initial-setup")}</p>
          </li>
        </ul>
      </div>

      <form className={styles["onboarding-form"]} onSubmit={handleSubmit}>
        <h2 className={styles["heading"]}>
          <span>{t("personal-info")}</span>
          <hr></hr>
        </h2>

        <h3>{t("basic-info")}</h3>

        <div className={styles["form-group"]}>
          <label htmlFor="name-input">
            {t("name")} <span>*</span>
          </label>
          <input
            type="text"
            onChange={handleNameChange}
            id="name-input"
            tabIndex={1}
            required
          />
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="tax-document-input">
            {t("tax-document")} <span>*</span>
          </label>
          <input
            type="text"
            onChange={handleTaxDocumentChange}
            id="tax-document-input"
            tabIndex={2}
            required
          />
        </div>

        <section className={styles["form-footer"]}>
          <button type="submit" className={styles["next-btn"]} tabIndex={3}>
              {t("create-profile")}
          </button>
        </section>
      </form>
    </div>
  )
}

export default Onboarding;