import { useEffect, useState } from 'react';
import { BeatLoader } from "react-spinners";
import { ethers } from "ethers";
import { useAgreementContract } from "../../contexts/ContractContext";
import { useAccount } from "../../contexts/AccountContext";
import styles from "./Dashboard.module.css"
import Image from 'next/image'

function Payments ({ limit }) {
  const { contract, loading } = useAgreementContract();
  const { account } = useAccount();
  const [paidAgreements, setPaidAgreements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    if (!loading) {
      fetchPaidAgreements();
      setIsLoading(false);
    }
  }, [loading]);

  if (paidAgreements.length === 0) {
    return null;
  }

  async function fetchPaidAgreements() {
    const companyFilter = contract.filters.PaymentMade(account, null);
    const professionalFilter = contract.filters.PaymentMade(null, account);

    const companyAgreements = await contract.queryFilter(companyFilter);
    const professionalAgreements = await contract.queryFilter(professionalFilter);

    const allAgreements = [...companyAgreements, ...professionalAgreements];

    setPaidAgreements(allAgreements.map(event => ({
    ...event.args,
    transactionHash: event.transactionHash
    })));
  }

  function renderPaidAgreements() {
    const displayedAgreements = limit ? paidAgreements.slice(0, limit) : paidAgreements;
    return displayedAgreements.map((agreement, index) => (
      <div key={index} className="payment-item">
        <h3>Agreement ID: {agreement.agreementId.toString()}</h3>
        <a href={`https://polygonscan.com/tx/${agreement.transactionHash}`} target="_blank" rel="noopener noreferrer">
           View on Polygonscan
        </a>
        <p className="value-status">
          <em>{parseFloat(ethers.utils.formatUnits(agreement.amount, 18)).toFixed(2).replace(/\.00$/, '')} USD</em>
          <span>
            {account.trim().toLowerCase() === agreement.company.trim().toLowerCase() ? (
              <>
                <strong className={"paid"}>Paid</strong>
                <Image src="/paid-icon.svg" width={16} height={16} />
              </>
            ) : (
              <>
                <strong className={"received"}>Received</strong>
                <Image src="/received-icon.svg" width={16} height={16} />
              </>
            )}
          </span>
        </p>
      </div>
    ));
  }

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
    <div className="payments-section">
      <h2>Payments</h2>
      <div>
        {renderPaidAgreements()}
        {limit && paidAgreements.length > limit && (
          <button onClick={() => window.location.href='/payments'}>See More</button>
        )}
      </div>
    </div>
  );
}

export default Payments;
