import React, { createContext, useContext, useEffect, useState } from 'react';
import AgreementContract from './contracts/AgreementContract.json';
import VaultContract from './contracts/W3DStableVault.json';
import { ethers } from "ethers";

// Agreement Contract Context
const AgreementContractContext = createContext(null);

export function useAgreementContract() {
  return useContext(AgreementContractContext);
}

export function AgreementContractProvider({ children }) {
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
    <AgreementContractContext.Provider value={{ contract, loading }}>
      {children}
    </AgreementContractContext.Provider>
  );
}

// Vault Contract Context
const VaultContractContext = createContext(null);

export function useVaultContract() {
  return useContext(VaultContractContext);
}

export function VaultContractProvider({ children }) {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeContract() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractABI = VaultContract.abi;
      const newContract = new ethers.Contract(process.env.NEXT_PUBLIC_FAKE_STABLE_ADDRESS, contractABI, provider.getSigner());
      setContract(newContract);
      setLoading(false);
    }

    initializeContract();
  }, []);

  return (
    <VaultContractContext.Provider value={{ contract, loading }}>
      {children}
    </VaultContractContext.Provider>
  );
}
