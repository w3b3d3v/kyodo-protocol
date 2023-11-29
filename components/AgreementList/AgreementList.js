import React, { useState, useEffect } from 'react';
import styles from "./AgreementList.module.scss"
import { useAccount } from "../../contexts/AccountContext"
import contractManager from '../../chains/ContractManager';
import { useRouter } from "next/router"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import transactionManager from '../../chains/transactionManager'
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import useTransactionHandler from '../../hooks/useTransactionHandler';
import Loader from '../utils/Loader';
import Toast from '../utils/Toast';
import { ethers } from "ethers"

function AgreementList() {
  const { account, selectedChain, selectedNetworkId } = useAccount()
  const [contract, setContract] = useState(null)
  const [tokens, setTokens] = useState(null)
  const [agreements, setAgreements] = useState([])
  const [showPaymentInput, setShowPaymentInput] = useState(null)
  const [selectedPaymentToken, setSelectedPaymentToken] = useState(null)
  const [selectedAgreements, setSelectedAgreements] = useState([]);
  const [showPaySelected, setShowPaySelected] = useState(null);
  const [showBulkPayment, setShowBulkPayment] = useState(null);
  const router = useRouter()
  const { t } = useTranslation()
  const { publicKey, wallet } = useWallet()
  const { connection } = useConnection();
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
    const agreementToPay = agreements[index];
    agreementToPay.paymentValue = "";
    setSelectedAgreements([agreementToPay]);
    setShowPaymentInput(index);
  };
  
  const handleNewAgreement = () => {
    router.push("/agreements/new")
  }

  const handleCheckboxChange = (index, isChecked) => {
    let updatedSelectedAgreements;

    if (isChecked) {
        const agreementToAdd = agreements[index];
        if (!selectedAgreements.some(agreement => agreement.id === agreementToAdd.id)) {
            updatedSelectedAgreements = [...selectedAgreements, agreementToAdd];
        } else {
            updatedSelectedAgreements = [...selectedAgreements];
        }
    } else {
        updatedSelectedAgreements = selectedAgreements.filter(agreement => agreement.id !== agreements[index].id);
    }

    setShowPaySelected(updatedSelectedAgreements.length > 0);
    setSelectedAgreements(updatedSelectedAgreements);
  };

  const handlePaymentValueChange = (index, e) => {
    const updatedAgreements = [...selectedAgreements];
    const value = e.target.value ? parseFloat(e.target.value) : "";

    if (!isNaN(value)) {
      updatedAgreements[index].paymentValue = value;
      setSelectedAgreements(updatedAgreements);
    }
  };
  
  const handleMakePayment = async (agreementsToPay) => {
    console.log("agreementsToPay", agreementsToPay)
    if (!selectedPaymentToken) {
      alert("Please select a valid token to process payment.")
      return
    }

    agreementsToPay = Array.isArray(agreementsToPay) ? agreementsToPay : [agreementsToPay];

    const details = {
      account,
      contract,
      selectedPaymentToken,
      agreements: agreementsToPay,
      wallet,
      publicKey
    };
  
    const onConfirmation = () => {
      fetch(
        `/api/notify?type=payment&account=${ethers.utils.getAddress(account)}&value=${paymentValue}`
      )
      setShowPaymentInput(false)
      setPaymentValue("");
      setAgreements("")
      setSelectedPaymentToken("")
      setSelectedAgreements("")
      setShowPaySelected(false)
      setShowBulkPayment(false)
      
      fetchAgreements()
    };
  
    await sendTransaction("payAgreement", details, "PaymentMade", onConfirmation)
  };

  async function fetchAgreements() {
    try {
      const details = {
        account,
        contract
      };

      const fetchedAgreements = await transactionManager["fetchAgreements"](selectedNetworkId, details)
      if (!fetchedAgreements) {
        return
      }
      setAgreements(fetchedAgreements)

      const chainTokens = await contractManager.tokens(selectedChain, selectedNetworkId)
      setTokens(chainTokens)
    } catch (error) {
      console.error("Error when fetching agreements:", error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    async function initializeContract() {
      try {
        setIsLoading(true);
        const details = {
          wallet,
          connection
        }
  
        const agreementContract = await contractManager.chains[selectedNetworkId].agreementContract(
          details
        )
        setContract(agreementContract);

      } catch (error) {
        console.error("Error initializing the agreements contract", error);
      } finally {
        setIsLoading(false);
      }
    }
  
    initializeContract();
  }, [selectedNetworkId, wallet, connection]);

  useEffect(() => {
    if (!isLoading && contract) {
      fetchAgreements();
    }
  }, [account, isLoading, contract]);

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
            <Image src="/no-agreement-icon.svg" width={58} height={58} alt="No agreement" />
            <p>{t("no-agreements")}</p>
          </div>
        ) : (
          agreements.map((agreement, index) => {
          return (
            <div key={index} className={styles["card"]}>
              <input
                type="checkbox"
                checked={selectedAgreements.includes(agreement)}
                onChange={(e) => handleCheckboxChange(index, e.target.checked)}
              />
              <div key={index} className={styles["card-heading"]}>
                <h2>{agreement.title}</h2>
                <div className={styles["wallet-key"]}>
                  {account.toLowerCase() === agreement.professional.toLowerCase() ? agreement.company : agreement.professional}
                </div>
              </div>
              <div className={styles["card-desc"]}>{agreement.description}</div>

              <p className={styles["skills-section"]}>
                <strong>{t("skills")}</strong> 
                {agreement.skills.map((skill, index) => (
                  <span key={index} className={styles.skill}>{skill}</span>
                ))}
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

              {!showPaySelected && (
                <div className={styles["card-footer"]}>
                  <>
                    {agreement.professional.toLowerCase() !== account.toLowerCase() && (
                      <a onClick={() => handlePayClick(index)}>{t("pay-agreement")}</a>
                    )}
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
                            value={agreement.paymentValue || ""}
                            onChange={(e) => handlePaymentValueChange(index, e)}
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
              )}
            </div>
        )}))
      }

      {selectedAgreements.length > 0 && showPaySelected && (
        <div className={styles["footer-btns"]}>
          <button onClick={() => {
            setShowBulkPayment(true)
            setShowPaySelected(false)
          }} className={styles["pay-btn"]}>{t("pay-selected")}</button>
        </div>
      )}

      {showBulkPayment && (
        <div className={styles["sidebar"]}>
          {
            selectedAgreements.map((agreement, index) => (
              <div key={index} className={styles["card"]}>
                <h2>{agreement.title}</h2>
                <div className={styles["wallet-key"]}>
                  {account.toLowerCase() === agreement.professional.toLowerCase() ? agreement.company : agreement.professional}
                </div>
                <input
                  type="number"
                  value={agreement.paymentValue || ""}
                  onChange={(e) => handlePaymentValueChange(index, e)}
                  className={styles["amount-input"]}
                />
              </div>
            ))
          }

          <div className={styles["token-select"]}>
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
          <button
            onClick={() =>
              handleMakePayment(
                selectedAgreements
              )
            }
            className={styles["confirm-btn"]}
          >
            {t("pay-agreements")}
          </button>

        </div>
      )}
      </div>
    </div>
  )
}

export default AgreementList;