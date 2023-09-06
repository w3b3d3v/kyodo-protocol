import React, { createContext, useContext, useEffect, useState } from 'react';
import AgreementContract from './contracts/AgreementContract.json';
import { ethers } from "ethers";

// Cria o contexto
const ContractContext = createContext(null);

// Hook personalizado para usar o contexto
export function useContract() {
  return useContext(ContractContext);
}

// Provedor de contexto
export function ContractProvider({ children }) {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeContract() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractABI = AgreementContract.abi;
      const newContract = new ethers.Contract(process.env.NEXT_PUBLIC_AGREEMENT_CONTRACT_ADDRESS, contractABI, provider.getSigner());
      setContract(newContract);
      setLoading(false);
    }

    initializeContract();
  }, []);

  return (
    <ContractContext.Provider value={{ contract, loading }}>
      {children}
    </ContractContext.Provider>
  );
}
