import { useEffect, useState } from 'react';
import contractManager from '../../chains/ContractManager';
import { useAccount } from "../../contexts/AccountContext";
import styles from "./Dashboard.module.scss"
import Image from 'next/image'
import Loader from '../utils/Loader';
import Link from "next/link"
import { useTranslation } from "react-i18next"
import useTransactionHandler from '../../hooks/useTransactionHandler';
import transactionManager from '../../chains/transactionManager'
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

function Payments ({ limit }) {
  const [contract, setContract] = useState(null)
  const { account, selectedChain, selectedNetworkId } = useAccount();
  const { wallet } = useWallet()
  const { connection } = useConnection();
  const [paidAgreements, setPaidAgreements] = useState([]);
  const { t } = useTranslation()
  const {
    isLoading,
    setIsLoading
  } = useTransactionHandler();

  useEffect(() => {
    async function initializeContract() {
      try {
        setIsLoading(true);
        const details = {
          wallet,
          connection
        }
  
        const agreementContract = await contractManager.chains[selectedNetworkId].agreementContract(details);
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
      fetchPaidAgreements();
    }
  }, [account, isLoading, contract]);

  if (paidAgreements.length === 0) {
    return null;
  }

  async function fetchPaidAgreements() {
    const KyodoRegistry = await contractManager.chains[selectedNetworkId].kyodoRegistry;
    try {
      const details = {
        account,
        contract,
        KyodoRegistry
      };

      const agreements = await transactionManager["fetchPaidAgreements"](selectedNetworkId, details)
      if (!agreements) {
        return
      }
      setPaidAgreements(agreements)
    } catch (error) {
      console.error("Error when fetching agreements:", error)
    } finally {
      setIsLoading(false)
    }
  }

  function renderPaidAgreements() {
    const displayedAgreements = limit ? paidAgreements.slice(0, limit) : paidAgreements;
    const explorerLink = contractManager.blockExplorer(selectedChain, selectedNetworkId)

    return displayedAgreements.map((agreement, index) => (
      <div key={index} className={styles["payment-item"]}>
        <div className={styles["payment-avatar"]}>
          <Image src="/coins/usdc-icon.svg" width={40} height={40} alt="USDC" />
        </div>
        <h3>
          {t("agreement")} ID:{" "}
          {!isNaN(agreement.agreementId) && Number.isInteger(Number(agreement.agreementId))
            ? agreement.agreementId.toString()
            : `${agreement.agreementId.substring(0, 4)}...${agreement.agreementId.substring(
                agreement.agreementId.length - 4
              )}`}
        </h3>
        <Link
          href={explorerLink + "/tx/" + agreement.transactionHash}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("view-on")}
        </Link>
        <p className={styles["value-status"]}>
          <em>{parseFloat(agreement.amount).toFixed(2).replace(/\.00$/, "")} USD</em>
          <span>
            {account.trim().toLowerCase() === agreement.company.trim().toLowerCase() ? (
              <>
                <strong className={styles["paid"]}>{t("paid")}</strong>
                <Image src="/paid-icon.svg" width={16} height={16} alt="Paid" />
              </>
            ) : (
              <>
                <strong className={styles["received"]}>{t("received")}</strong>
                <Image src="/received-icon.svg" width={16} height={16} alt="Received" />
              </>
            )}
          </span>
        </p>
      </div>
    ))
  }
  
  return (
    <div className={styles["payments-section"]}>
      <Loader isLoading={isLoading} />
      <h2>{t("payments")}</h2>
      <div>
        {renderPaidAgreements()}
        {limit && paidAgreements.length > limit && (
          <Link href="/payments" className="view-all">
            {t("view-all")}
          </Link>
        )}
      </div>
    </div>
  )
}

export default Payments;
