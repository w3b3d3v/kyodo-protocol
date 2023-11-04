import { useEffect, useState } from 'react';
import contractManager from '../../chains/ContractManager';
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
import { useWallet, useConnection} from '@solana/wallet-adapter-react';

function Balances() {
  const { t } = useTranslation()
  const [contract, setContract] = useState(null)
  const { account, selectedChain} = useAccount()
  const [userBalances, setUserBalances] = useState([])
  const [showRedeemInput, setShowRedeemInput] = useState(null)
  const { wallet } = useWallet()
  const { connection } = useConnection();
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
        connection,
        contract
      };

      const balances = await transactionManager["fetchUserBalances"](selectedChain, details)
      if (!balances) {
        return
      }
      setUserBalances(balances)
    } catch (error) {
      console.error("Error when fetching balances:", error)
    }
  }

  
  const withdrawFromVault = async (amount, balance) => {
    const KyodoRegistry = await contractManager.chains[selectedChain].kyodoRegistry;

    try {
      setIsLoading(true)

      const details = {
        account,
        amount,
        balance,
        contract,
        KyodoRegistry
      };

      const onConfirmation = () => {
        setShowRedeemInput(false)
        fetchUserBalances()
        setIsLoading(false)
      };

      await sendTransaction("withdrawFromVault", details, "Withdrawal", onConfirmation)

    } catch (error) {
      console.error("Error during withdrawal:", error)
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
  
        const vaultContract = await contractManager.chains[selectedChain].vaultContract(details);
        setContract(vaultContract);
      } catch (error) {
        console.error("Error initializing the agreements contract", error);
      } finally {
        setIsLoading(false);
      }
    }
  
    initializeContract();
  }, [selectedChain, wallet, connection]);

  useEffect(() => {
    if (!isLoading && contract) {
      fetchUserBalances();
    }
  }, [account, isLoading, contract]);
  

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
                <span>{parseFloat(balance.amount).toFixed(2).replace(/\.00$/, "")}</span>
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
      </section>
    </div>
  )
}

export default Balances;
