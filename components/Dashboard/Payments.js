import { useEffect, useState } from 'react';
import { useAgreementContract } from "../../contexts/ContractContext";
import { useAccount } from "../../contexts/AccountContext";
import styles from "./Dashboard.module.scss"
import Image from 'next/image'
import Loader from '../utils/Loader';
import Link from "next/link"
import { useTranslation } from "react-i18next"
import useTransactionHandler from '../../hooks/useTransactionHandler';
import transactionManager from '../../chains/transactionManager'
import getExplorerLink from '../../chains/utils/utils.js';

function Payments ({ limit }) {
  const { contract, loading } = useAgreementContract();
  const { account, selectedChain} = useAccount();
  const [paidAgreements, setPaidAgreements] = useState([]);
  const { t } = useTranslation()
  const {
    isLoading,
    setIsLoading
  } = useTransactionHandler();
  
  useEffect(() => {
    setIsLoading(true);
    if (!loading) {
      fetchPaidAgreements();
    }
  }, [loading]);

  if (paidAgreements.length === 0) {
    return null;
  }

  async function fetchPaidAgreements() {
    try {
      const details = {
        account,
        contract
      };

      const agreements = await transactionManager["fetchPaidAgreements"](selectedChain, details)
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
    const explorerLink = getExplorerLink(selectedChain);

    return displayedAgreements.map((agreement, index) => (
      <div key={index} className={styles["payment-item"]}>
        <div className={styles["payment-avatar"]}>
          <Image src="/coins/usdc-icon.svg" width={40} height={40} alt="USDC" />
        </div>
        <h3>
          Agreement ID: {
            (!isNaN(agreement.agreementId) && Number.isInteger(Number(agreement.agreementId)))
              ? agreement.agreementId.toString()
              : `${agreement.agreementId.substring(0, 4)}...${agreement.agreementId.substring(agreement.agreementId.length - 4)}`
          }
        </h3>
                
        <Link
          href={explorerLink + agreement.transactionHash}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("view-on")}
      </Link>
        <p className={styles["value-status"]}>
          <em>
            {parseFloat(agreement.amount)
              .toFixed(2)
              .replace(/\.00$/, "")}{" "}
            USD
          </em>
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
          <a onClick={() => window.location.href='/payments'} className={"view-all"}>
            {t("view-all")}
          </a>
        )}
      </div>
    </div>
  );
}

export default Payments;
