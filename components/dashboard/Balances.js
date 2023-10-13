import { useEffect, useState } from 'react';
import { useVaultContract } from "../../contexts/ContractContext";
import { useAccount } from "../../contexts/AccountContext";
import styles from "./Dashboard.module.scss"
import Payments from './Payments';
import Image from 'next/image'
import Link from "next/link"
import Loader from '../utils/Loader';
import Toast from '../utils/Toast';
import transactionManager from '../../chains/transactionManager'
import useTransactionHandler from '../../hooks/useTransactionHandler';
import { useTranslation } from "react-i18next"

function Balances() {
  const { t } = useTranslation()
  const { vaultContract, vaultLoading } = useVaultContract()
  const { account, selectedChain} = useAccount()
  const [userBalances, setUserBalances] = useState([])
  const [showRedeemInput, setShowRedeemInput] = useState(null)
  const [redeemValue, setRedeemValue] = useState("")
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


  const handleRedeemClick = (index) => {
    setShowRedeemInput(index)
  }

  const handleRedeemValueChange = (e) => {
    const inputAmount = parseFloat(e.target.value)
    if (isNaN(inputAmount)) {
      setRedeemValue("")
    } else {
      setRedeemValue(inputAmount.toString())
    }
  }

  async function fetchUserBalances() {
    try {
      const details = {
        account,
      };

      const balances = await transactionManager["fetchUserBalances"](selectedChain, details)
      if (!balances) {
        return
      }
      setUserBalances(balances)
    } catch (error) {
      console.error("Error when fetching balances:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const withdrawFromVault = async (amount, balance) => {
    try {
      setIsLoading(true)

      const details = {
        account,
        amount,
        balance,
        contract: vaultContract
      };
    
      const onConfirmation = () => {
        setShowRedeemInput(false)
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      };
    
      await sendTransaction("withdrawFromVault", details, "Withdrawal", onConfirmation)
      
    } catch (error) {
      console.error("Error during withdrawal:", error)
    }
  }

  useEffect(() => {
    setIsLoading(true)

    const fetchData = async () => {
      try {
        if (!vaultLoading) {
          await fetchUserBalances()
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [vaultLoading])

  return (
    <div>
      <section className={styles["user-home"]}>
      <Loader isLoading={isLoading} />
      <Toast
        transactionSuccess={transactionSuccess}
        transactionPending={transactionPending}
        transactionFail={transactionFail}
        errorMessage={errorMessage}
        transactionHash={transactionHash}
      />

        <div className={styles["dashboard-header"]}>
          <h1>{t("gm")}</h1>

          {userBalances.map((balance, index) => (
            <div key={index} className={styles["balance-heading"]}>
              <p className={styles["usd-balance"]}>
                <Image src="/usd-icon.svg" alt="USD icon" width={32} height={32} />
                <span>
                  {parseFloat(balance.amount)
                    .toFixed(2)
                    .replace(/\.00$/, "")}
                </span>
              </p>
                {showRedeemInput !== index && (
                  <a onClick={() => handleRedeemClick(index)}>{t("redeem")}</a>
                )}
                {showRedeemInput === index && (
                  <>
                    <div className={styles["opened-items"]}>
                      <input
                        type="number"
                        value={redeemValue}
                        onChange={(e) => handleRedeemValueChange(e)}
                        placeholder="USD"
                      />
                      <button onClick={() => withdrawFromVault(redeemValue, balance)}>
                        {t("confirm")}
                      </button>
                    </div>
                  </>
                )}
            </div>
          ))}
        </div>

        <ul className={styles["home-calls"]}>
          <li className={styles["disabled"]}>
            <h2>Complete your profile to be visible</h2>
            <div className={styles["progressbar"]}>
              <div></div>
            </div>
            <p>
              You profile is <strong>35%</strong> complete
            </p>
            <Link href="#">Complete profile</Link>
          </li>
          <li>
            <h2>{t("call-02")}</h2>
            <p>{t("phrase-02")}</p>
            <Link href="/agreements/new">{t("btn-02")}</Link>
          </li>
          <li className={styles["disabled"]}>
            <h2>
              Refer and<br></br> earn
            </h2>
            <p>
              Professionals or contractors that refer the usage of Kyodo, can earn a % of paid value
              to the protocol.
            </p>
            <Link href="#">Get referral link</Link>
          </li>
        </ul>
      </section>
      <Payments limit={2} />
    </div>
  )
}

export default Balances;
