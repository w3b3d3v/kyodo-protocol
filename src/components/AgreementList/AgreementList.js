import React, { useState, useEffect } from 'react';
import { BeatLoader } from "react-spinners";
import "./AgreementList.css";
import tokens from '../../assets/allowedTokens.json';
import { useContract } from '../../ContractContext';

function AgreementList(props) {
    const [agreements, setAgreements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { contract, loading } = useContract();
  
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
                <p><strong>Status:</strong> {agreement.status}</p>
                <p><strong>Developer:</strong> {agreement.developer}</p>
                <p><strong>Skills:</strong> {agreement.skills.join(", ")}</p>
                <p><strong>Payment Amount:</strong> {adjustedPaymentAmount}</p>
                <p><strong>Payment Token:</strong> {paymentTokenName}</p> {/* Display token name */}
              </div>
            );
          })}
        </div>
      </div>
    );
}
  
export default AgreementList;
