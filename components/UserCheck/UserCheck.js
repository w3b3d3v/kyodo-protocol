import React, { useState, useEffect } from 'react';
import { BeatLoader } from "react-spinners";
import AddAgreement from "../AddAgreement/AddAgreement";
import AgreementList from '../AgreementList/AgreementList';
import { useContract } from "../ContractContext"

function UserCheck(props) {
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { contract, loading } = useContract();
  
    useEffect(() => {
        // Só executar se loading for false
        if (!loading) {
          async function checkUserRegistration() {
            try {
              // Verificar se o provedor Ethereum está presente
              if (window.ethereum) {
                // Verificar se o usuário possui acordos
                const userAgreementIds = await contract.methods.getUserAgreements(window.ethereum.selectedAddress).call();
      
                // Defina isRegistered como verdadeiro se o usuário tiver acordos
                setIsRegistered(userAgreementIds.length > 0);
              } else {
                console.error('Provedor Ethereum não encontrado!');
              }
            } catch (error) {
              console.error(error);
            } finally {
              setIsLoading(false);
            }
          }
      
          checkUserRegistration();
        }
      }, [loading]);  // Adiciona loading como uma dependência
  
    if (isLoading) {
        return (
          <div className="loading-overlay">
            <div className="sweet-loading">
              <BeatLoader loading={isLoading} size={50} />
            </div>
          </div>
        );
    }
  
    if (isRegistered) {
        return <AgreementList />;
    } else {
      return <AddAgreement />;
    }
}

export default UserCheck;
