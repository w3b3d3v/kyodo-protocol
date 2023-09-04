import React, { useState, useEffect } from 'react';
import { BeatLoader } from "react-spinners";
import "./AgreementList.module.css"
import tokens from "../../public/allowedTokens.json"
import { useContract } from "../../components/ContractContext"

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
          const tx = await contract.methods.makePayment(
            agreementId, 
            paymentAmountInWei
          ).send({ from: window.ethereum.selectedAddress });

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
              const userAgreementIds = await contract.methods.getUserAgreements(window.ethereum.selectedAddress).call();
              
              const fetchedAgreements = await Promise.all(userAgreementIds.map(async (agreementId) => {
                const agreement = await contract.methods.getAgreementById(agreementId).call();
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
        <div className="loading-overlay">
          <div className="sweet-loading">
            <BeatLoader loading={isLoading} size={50} />
          </div>
        </div>
      );
    }
  
    return (
      <div className="agreement-list">
        <h1>Agreements</h1>
        <div className="card-list">
          {agreements.map((agreement, index) => {
            const paymentToken = tokens.find(token => token.address === agreement.payment.tokenAddress);
            const paymentTokenName = paymentToken ? paymentToken.name : 'Unknown Token';
            const adjustedPaymentAmount = paymentToken
              ? agreement.payment.amount / 10 ** paymentToken.decimals
              : agreement.payment.amount;
    
            return (
              <div key={index} className="card">
                <h2>{agreement.title}</h2>
                <p>{agreement.description}</p>
                <p><strong>Status:</strong>
                {Number(agreement.status) === 0 ? 
                  <>
                    <button onClick={() => handlePayClick(index)}> Pay Agreement</button>
                    <br></br>
                    {showPaymentInput === index && (
                      <>
                        <input 
                          type="number" 
                          value={paymentValue}
                          onChange={handlePaymentValueChange}
                        />
                        <button onClick={() => handleMakePayment(agreement.id, agreement.payment.amount, agreement.totalPaid, paymentToken)}>Confirm Payment</button>
                      </>
                    )}
                  </> : 
                  (Number(agreement.status) === 1 ? ' Completed' : agreement.status)
                }
              </p>
                <p><strong>Developer:</strong> {agreement.developer}</p>
                <p><strong>Skills:</strong> {agreement.skills.join(", ")}</p>
                <p><strong>Payment Amount:</strong> {adjustedPaymentAmount}</p>
                <p><strong>Payment Token:</strong> {paymentTokenName}</p> {/* Display token name */}
                {Number(agreement.status) !== 1 && <p><strong>Total Paid:</strong> {agreement.totalPaid}</p>}
              </div>
            );
          })}
        </div>
      </div>
    );
    
    
}
  
export default AgreementList;
