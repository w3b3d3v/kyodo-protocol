import React, { createContext, useContext, useEffect, useState } from 'react';
import contractManager from '../chains/ContractManager';
import { useAccount} from "../contexts/AccountContext";
import { useWallet } from '@solana/wallet-adapter-react';

const AgreementContractContext = createContext(null);

export function useAgreementContract() {
  return useContext(AgreementContractContext);
}

export function AgreementContractProvider({ children }) {
  const { selectedChain } = useAccount()
  const [contract, setContract] = useState(null)
  const [loading, setLoading] = useState(true)
  const { wallet } = useWallet()

  useEffect(() => {
    async function initializeContract() {
      const agreementContract = contractManager.chains[selectedChain].agreementContract(wallet)
      setContract(agreementContract)
      setLoading(false)
    }

    initializeContract()
  }, [])

  return (
    <AgreementContractContext.Provider value={{ contract, loading }}>
      {children}
    </AgreementContractContext.Provider>
  )
}

const VaultContractContext = createContext(null)

export function useVaultContract() {
  return useContext(VaultContractContext)
}

export function VaultContractProvider({ children }) {
  const [vaultContract, setContract] = useState(null)
  const [vaultLoading, setLoading] = useState(true)
  const { selectedChain } = useAccount()
  const { wallet } = useWallet()

  useEffect(() => {
    async function initializeContract() {
      const initializedContract = contractManager.chains[selectedChain].vaultContract(wallet)
      setContract(initializedContract)
      setLoading(false)
    }

    initializeContract()
  }, [])

  return (
    <VaultContractContext.Provider value={{ vaultContract, vaultLoading }}>
      {children}
    </VaultContractContext.Provider>
  )
}
