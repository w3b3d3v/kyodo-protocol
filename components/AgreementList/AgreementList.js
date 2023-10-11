import React, { useState, useEffect } from 'react';
import styles from "./AgreementList.module.scss"
import { useAccount } from "../../contexts/AccountContext"
import { useAgreementContract } from "../../contexts/ContractContext"
import { useRouter } from "next/router"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import transactionManager from '../../chains/transactionManager'
import { useWallet } from '@solana/wallet-adapter-react';
import useTransactionHandler from '../../hooks/useTransactionHandler';
import Loader from '../utils/Loader';
import Toast from '../utils/Toast';
import { getTokens } from './tokenConfig.js';

function AgreementList() {
  const { account, selectedChain } = useAccount()
  const tokens = getTokens(selectedChain);
  const { contract, loading } = useAgreementContract()
  const [agreements, setAgreements] = useState([])
  const [paymentValue, setPaymentValue] = useState("")
  const [showPaymentInput, setShowPaymentInput] = useState(null)
  const [selectedPaymentToken, setSelectedPaymentToken] = useState(null)
  const router = useRouter()
  const { t } = useTranslation()
  const { publicKey, wallet } = useWallet()
  const {
    isLoading,
    setIsLoading,
    transactionSuccess,
    transactionPending,
    transactionFail,
    errorMessage,
    sendTransaction,
    transactionHash,
  } = useTransactionHandler();

  const handlePayClick = (index) => {
    setShowPaymentInput(index)
  }

  const handleNewAgreement = () => {
    router.push("/agreements/new")
  }

  const handlePaymentValueChange = async (e) => {
    const value = parseFloat(e.target.value)
    if (isNaN(value)) {
      setPaymentValue("")
    } else {
      setPaymentValue(value)
    }
  }

  const handleMakePayment = async (agreement) => {
    if (!selectedPaymentToken) {
      alert("Please select a valid token to process payment.")
      return
    }

    const details = {
      account,
      contract,
      selectedPaymentToken,
      paymentValue,
      agreement,
      wallet,
      publicKey
    };
  
    const onConfirmation = () => {
      setShowPaymentInput(false)
      setPaymentValue("");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    };
  
    await sendTransaction("payAgreement", details, "PaymentMade", onConfirmation)
  };

  async function fetchAgreements() {
    try {
      const details = {
        account,
        contract
      };

      const fetchedAgreements = await transactionManager["fetchAgreements"](selectedChain, details)
      if (!fetchedAgreements) {
        return
      }
      setAgreements(fetchedAgreements)
    } catch (error) {
      console.error("Error when fetching agreements:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && contract) {
      fetchAgreements();
    }
  }, [account, loading, contract]);

  return (
    <div className={styles["agreement-list"]}>
      <Loader isLoading={isLoading} />
      <Toast
        transactionSuccess={transactionSuccess}
        transactionPending={transactionPending}
        transactionFail={transactionFail}
        errorMessage={errorMessage}
        transactionHash={transactionHash}
      />
      <section className={styles["action-bar"]}>
         <h1>
            {t("agreements")}
            <a onClick={() => handleNewAgreement()} className={styles["add-link"]}>
            <Image
              src="/add.svg"
              alt="add an agreement"
              width={20}
              height={20}
            />
          </a>
        </h1>
        <ul>
          <li>
            <a href="#" className={styles["actived"]}>{t("all-tab")}</a>
          </li>
          <li>
            <a href="#">{t("inactive-tab")}</a>
          </li>
        </ul>
      </section>

      <div className={styles["card-list"]}>
        {agreements.length === 0 ? (
          <div className={styles["no-agreement-message"]}>
            {t("no-agreements")}
          </div>
          ) : (
          agreements.map((agreement, index) => {
          return (
            <div key={index} className={styles["card"]}>
              <div key={index} className={styles["card-heading"]}>
                <h2>{agreement.title}</h2>
                <div className={styles["wallet-key"]}>{agreement.professional}</div>
              </div>

              <div className={styles["card-desc"]}>{agreement.description}</div>

              <p className={styles["skills-section"]}>
                <strong>{t("skills")}</strong> <span>{agreement.skills.join(", ")}</span>
              </p>

              <p>
                <strong>{t("payment-amount")}</strong>
                {agreement.amount && !isNaN(agreement.amount)
                  ? parseFloat(agreement.amount).toFixed(2).replace(/\.00$/, "") + " USD"
                  : "wrong number of format"}
              </p>

              <p>
                <strong className={styles["total-paid"]}>{t("total-paid")}</strong>
                {!isNaN(agreement.totalPaid)
                ? parseFloat(agreement.totalPaid).toFixed(2).replace(/\.00$/, "") + " USD"
                : "wrong number of format"}
              </p>

              <div className={styles["card-footer"]}>
                <>
                  <a onClick={() => handlePayClick(index)}>{t("pay-agreement")}</a>
                  {showPaymentInput === index && (
                    <>
                      <div className={styles["opened-items"]}>
                        <div className={styles["min-select"]}>
                          <select
                            value={selectedPaymentToken ? selectedPaymentToken.address : ""}
                            onChange={(event) => {
                              const selectedTokenAddress = event.target.value
                              const selectedToken = tokens.find(
                                (token) => token.address === selectedTokenAddress
                              )
                              setSelectedPaymentToken(selectedToken)
                            }}
                            className={styles["select-input"]}
                          >
                            <option value="">{t("select-token")}</option>
                            {tokens.map((token) => (
                              <option
                                key={token.address}
                                value={token.address}
                              >
                                {token.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <input
                          type="number"
                          value={paymentValue}
                          onChange={(e) => handlePaymentValueChange(e)}
                        />
                        <button
                          onClick={() =>
                            handleMakePayment(
                              agreement
                            )
                          }
                          className={styles["confirm-btn"]}
                        >
                          {t("confirm")}
                        </button>
                      </div>
                    </>
                  )}
                </>
              </div>
            </div>
          )
        }))}
      </div>
    </div>
  )
}

export default AgreementList;