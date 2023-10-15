import React, { createContext, useContext, useEffect, useState } from 'react';
import contractManager from '../chains/ContractManager';
import { useAccount} from "../contexts/AccountContext";
import { useWallet, useConnection} from '@solana/wallet-adapter-react';

const AgreementContractContext = createContext(null);

export function useAgreementContract() {
  return useContext(AgreementContractContext);
}

export function AgreementContractProvider({ children }) {
  const { selectedChain } = useAccount()
  const [contract, setContract] = useState(null)
  const [loading, setLoading] = useState(true)
  const { wallet } = useWallet()
  const { connection } = useConnection();

  useEffect(() => {
    async function initializeContract() {
      const details = {
        wallet,
        connection
      }

      const agreementContract = contractManager.chains[selectedChain].agreementContract(details)
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
  const { connection } = useConnection();

  useEffect(() => {
    async function initializeContract() {
      const details = {
        wallet,
        connection
      }
      
      const initializedContract = contractManager.chains[selectedChain].vaultContract(details)
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
