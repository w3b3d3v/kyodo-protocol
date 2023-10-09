import React, { useState, useEffect } from 'react';
import { BeatLoader } from "react-spinners";
import { ethers } from "ethers";
import tokens from "../../public/allowedTokens.json"
import styles from "./AgreementList.module.scss"
import { useAccount } from "../../contexts/AccountContext"
import { useAgreementContract } from "../../contexts/ContractContext"
import ERC20Token from '../../utils/ERC20Token';
import { useRouter } from "next/router"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import transactionManager from '../../chains/transactionManager'

function AgreementList(props) {
  const { account, selectedChain } = useAccount()
  const { contract, loading } = useAgreementContract()
  const [agreements, setAgreements] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [paymentValue, setPaymentValue] = useState("")
  const [showPaymentInput, setShowPaymentInput] = useState(null)
  const [userAllowance, setUserAllowance] = useState(null)
  const [selectedPaymentToken, setSelectedPaymentToken] = useState(null)
  const router = useRouter()
  const { t } = useTranslation()

  const checkAllowance = async (userAddress, contractAddress, selectedToken) => {
    const tokenContract = new ERC20Token(selectedToken.address)
    const allowance = await tokenContract.allowance(userAddress, contractAddress)
    setUserAllowance(ethers.BigNumber.from(allowance.toString()))
  }

  const handleApprove = async (amount, spender) => {
    try {
      const amountInWei = ethers.utils.parseUnits(amount.toString(), selectedPaymentToken.decimals)
      const tokenContract = new ERC20Token(selectedPaymentToken.address)
      const tx = await tokenContract.approve(spender, amountInWei)
      await tx.wait()

      console.log(`Approval successful for amount: ${amount}`)
    } catch (error) {
      console.error("Error approving token:", error)
    }
  }

  const handlePayClick = (index) => {
    setShowPaymentInput(index)
  }

  const handleNewAgreement = (index) => {
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

  const handleMakePayment = async (agreementId) => {
    if (!selectedPaymentToken) {
      alert("Please select a valid token to process payment.")
      return
    }

    const paymentAmountInWei = ethers.utils.parseUnits(
      paymentValue.toString(),
      selectedPaymentToken.decimals
    )
    if (parseFloat(paymentAmountInWei) <= 0) {
      alert("Invalid payment amount.")
      return
    }

    setIsLoading(true)

    if (!userAllowance.gte(paymentAmountInWei)) {
      await handleApprove(paymentValue, contract.address)
    }

    try {
      const tx = await contract.makePayment(
        agreementId,
        paymentAmountInWei,
        selectedPaymentToken.address
      )
      await tx.wait()
    } catch (error) {
      console.error("Error when making payment", error)
    } finally {
      setIsLoading(false)
      fetchAgreements()
      setShowPaymentInput(false)
    }
  }

  async function fetchAgreements() {
    try {
      const details = {
        account,
        contract
      };

      const fetchedAgreements = await transactionManager["fetchAgreements"](selectedChain, details)
      if (!fetchedAgreements) {
        return
        console.log("No agreements found")
      }
      setAgreements(fetchedAgreements)
    } catch (error) {
      console.error("Error when fetching agreements:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAgreements()
  }, [account])

  if (isLoading) {
    return (
      <div className={"loading-overlay"}>
        <div className={"sweet-loading"}>
          <BeatLoader loading={isLoading} size={50} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles["agreement-list"]}>
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
        {agreements.map((agreement, index) => {
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
                {parseFloat(ethers.utils.formatUnits(agreement.payment.amount, 18))
                  .toFixed(2)
                  .replace(/\.00$/, "")}{" "}
                USD
              </p>
              <p>
                <strong className={styles["total-paid"]}>{t("total-paid")}</strong>
                {parseFloat(ethers.utils.formatUnits(agreement.totalPaid, 18))
                  .toFixed(2)
                  .replace(/\.00$/, "")}{" "}
                USD
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
                              checkAllowance(account, contract.address, selectedToken)
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
                              agreement.id,
                              agreement.payment.amount,
                              agreement.totalPaid
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
        })}
      </div>
    </div>
  )
}

export default AgreementList;
