import React, { createContext, useContext, useEffect, useState } from 'react';
import contractManager from '../chains/ContractManager';
import { useAccount} from "../contexts/AccountContext";

const AgreementContractContext = createContext(null);

export function useAgreementContract() {
  return useContext(AgreementContractContext);
}

export function AgreementContractProvider({ children }) {
  const { selectedChain } = useAccount();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeContract() {      
      const initializedContract = contractManager.getContract(selectedChain, "AgreementContract");
      setContract(initializedContract);
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

const VaultContractContext = createContext(null);

export function useVaultContract() {
  return useContext(VaultContractContext);
}

export function VaultContractProvider({ children }) {
  const [vaultContract, setContract] = useState(null);
  const [vaultLoading, setLoading] = useState(true);
  const { selectedChain } = useAccount();

  useEffect(() => {
    async function initializeContract() {
      const initializedContract = contractManager.getContract(selectedChain, "VaultContract");
      setContract(initializedContract);
      setLoading(false);
    }

    initializeContract();
  }, []);

  return (
    <VaultContractContext.Provider value={{ vaultContract, vaultLoading }}>
      {children}
    </VaultContractContext.Provider>
  );
}
