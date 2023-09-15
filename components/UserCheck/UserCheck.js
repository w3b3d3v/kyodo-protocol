import React, { useState, useEffect } from 'react';
import { BeatLoader } from "react-spinners";
import AddAgreement from "../AddAgreement/AddAgreement";
import AgreementList from '../AgreementList/AgreementList';
import { useAgreementContract } from "../../contexts/ContractContext"

function UserCheck(props) {
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { contract, loading } = useAgreementContract();
  
    useEffect(() => {
        if (!loading) {
          async function checkUserRegistration() {
            try {
              if (window.ethereum) {
                const userAgreementIds = await contract.getUserAgreements(window.ethereum.selectedAddress);

                setIsRegistered(userAgreementIds.toString().length > 0);
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
      }, [loading]); 
  
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
