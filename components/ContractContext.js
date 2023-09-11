import React, { createContext, useContext, useEffect, useState } from 'react';
import AgreementContract from './contracts/AgreementContract.json';
import { ethers } from "ethers";

// Create the context
const ContractContext = createContext(null);

// Custom Hook to use context
export function useContract() {
  return useContext(ContractContext);
}

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
