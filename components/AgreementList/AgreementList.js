import React, { useState, useEffect } from 'react';
import { BeatLoader } from "react-spinners";
import "./AgreementList.module.css"
import tokens from "../../public/allowedTokens.json"
import { useContract } from "../../components/ContractContext"
import styles from "./AgreementList.module.css"
import BigNumber from 'bignumber.js';

// TODO: Check allowance before transaction
// Handle Promise while transaction runs
// Show correct Total Paid based in a defined currency base

function AgreementList(props) {
  const [agreements, setAgreements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentInput, setShowPaymentInput] = useState(null);
  const [paymentValue, setPaymentValue] = useState('');
  const { contract, loading } = useContract();

  const handlePayClick = (index) => {
    setShowPaymentInput(index);
  };

  const handlePaymentValueChange = (e) => {
    setPaymentValue(parseInt(e.target.value));
  };

  const handleMakePayment = async (agreementId, totalAmount, totalPaid, paymentToken) => {      
    const paymentAmountInWei = new BigNumber(paymentValue)
              .times(new BigNumber(10).pow(paymentToken.decimals))
              .toString();
      

    if (parseInt(paymentAmountInWei) <= 0 || parseInt(paymentAmountInWei) > parseInt(totalAmount) || (parseInt(paymentAmountInWei) + parseInt(totalPaid) > parseInt(totalAmount))) {
      alert('Invalid payment amount.');
      return;
    }
    try {
      // Verificar se o provedor Ethereum está presente
      if (window.ethereum) {
        const tx = await contract.makePayment(
          agreementId, 
          paymentAmountInWei
        );

      } else {
        console.error('Provedor Ethereum não encontrado!');
      }
    } catch (error) {
      console.error('Erro ao fazer pagamento', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
      async function fetchAgreements() {
        try {
          // Verificar se o provedor Ethereum está presente
          if (window.ethereum) {
            const userAgreementIds = await contract.getUserAgreements(window.ethereum.selectedAddress);
            const stringIds = userAgreementIds.map(id => id.toString());

            const fetchedAgreements = await Promise.all(stringIds.map(async (agreementId) => {
              const agreement = await contract.getAgreementById(agreementId);
              return agreement;
            }));
            
            setAgreements(fetchedAgreements);
          } else {
            console.error('Provedor Ethereum não encontrado!');
          }
        } catch (error) {
          console.error('Erro ao buscar acordos:', error);
        } finally {
          setIsLoading(false);
        }
      }
  
      fetchAgreements();
  }, []);    

  if (isLoading) {
    return (
      <div className={styles["loading-overlay"]}>
        <div className={styles["sweet-loading"]}>
          <BeatLoader loading={isLoading} size={50} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles["agreement-list"]}>
      <h1>Agreements</h1>
      <div className={styles["card-list"]}>
        {agreements.map((agreement, index) => {
          const paymentToken = tokens.find(token => token.address === agreement.payment.tokenAddress);
          const paymentTokenName = paymentToken ? paymentToken.name : 'Unknown Token';
          const adjustedPaymentAmount = paymentToken
          ? String(BigInt(agreement.payment.amount) / BigInt(10 ** paymentToken.decimals))
          : String(BigInt(agreement.payment.amount));
          return (
            <div key={index} className={styles["card"]}>
              <h2>{agreement.title}</h2>
              <div className={styles["wallet-key"]}>
                {agreement.developer}
              </div>
              <p className={styles["card-desc"]}>
                {agreement.description}
              </p>
              <p><strong>Skills:</strong> {agreement.skills.join(", ")}</p>
              <p><strong>Payment Amount:</strong> {adjustedPaymentAmount}</p>
              <p><strong>Payment Token:</strong> {paymentTokenName}</p> {/* Display token name */}
              {Number(agreement.status) !== 1 && <p><strong>Total Paid:</strong> {agreement.totalPaid.toString()}</p>}
              <div className={styles["card-footer"]}>
                {Number(agreement.status) === 0 ? 
                  <>
                    <a onClick={() => handlePayClick(index)}>Pay agreement</a>
                    {showPaymentInput === index && (
                      <>
                        <input 
                          type="number" 
                          value={paymentValue}
                          onChange={handlePaymentValueChange}
                          onKeyDown="false"
                        />
                        <button onClick={() => handleMakePayment(agreement.id, agreement.payment.amount, agreement.totalPaid, paymentToken)}>Confirm payment</button>
                      </>
                    )}
                  </> : 
                  (Number(agreement.status) === 1 ? ' Completed' : agreement.status)
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ); 
}

export default AgreementList;