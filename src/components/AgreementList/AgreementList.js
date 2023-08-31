import React, { useState, useEffect } from 'react';
import { BeatLoader } from "react-spinners";
import Web3 from 'web3';
import "./AgreementList.css";
import AgreementContract from '../../contracts/AgreementContract.json';

const contractABI = AgreementContract.abi;
const contractAddress = '0x4C3073be445B97121ceE882D39299169fb22e1e5';

// TODO: Descobrir se o contrato esta bugado ou o front esta chamando usando um endereço diferente ou wtf

function AgreementList(props) {
    const [agreements, setAgreements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
        async function fetchAgreements() {
          try {
            // Verificar se o provedor Ethereum está presente
            if (window.ethereum) {
              // Conectar à blockchain usando o provedor Ethereum
              const web3 = new Web3(window.ethereum);
    
              // Criar uma instância do contrato usando o endereço e o ABI
              const contract = new web3.eth.Contract(contractABI, contractAddress);
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
    }, [contractABI, contractAddress]);    
  
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
            {agreements.map((agreement, index) => (
              <div key={index} className="card">
                <h2>{agreement.title}</h2>
                <p>{agreement.description}</p>
                <p><strong>Status:</strong> {agreement.status}</p>
                <p><strong>Developer:</strong> {agreement.developer}</p>
                <p><strong>Skills:</strong> {agreement.skills.join(", ")}</p>
                <p><strong>Incentive Amount:</strong> {Web3.utils.fromWei(agreement.tokenIncentive.amount.toString(), 'ether')} tokens</p>
                <p><strong>Incentive Token:</strong> {agreement.tokenIncentive.tokenAddress}</p>
                <p><strong>Payment Amount:</strong> {Web3.utils.fromWei(agreement.payment.amount.toString(), 'ether')} tokens</p>
                <p><strong>Payment Token:</strong> {agreement.payment.tokenAddress}</p>
              </div>
            ))}
          </div>
        </div>
      );
}
  
export default AgreementList;
