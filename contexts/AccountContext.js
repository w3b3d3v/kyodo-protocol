import React, { createContext, useContext, useState, useEffect } from 'react';
import { vefifyChain } from "../components/ConnectWalletButton/ConnectWalletButton"

const AccountContext = createContext({
  account: null,
  setAccount: () => {},
  selectedChain: null,
  setSelectedChain: () => {}
});

export function useAccount() {
    return useContext(AccountContext);
}

export function AccountProvider({ children }) {
    const [account, setAccount] = useState(null);
    const [selectedChain, setSelectedChain] = useState(() => {
      if (typeof window !== 'undefined') {
          return localStorage.getItem('selectedChain') || null;
      }
      return null;
    });

    const handleDisconnect = () => {
        setAccount(null)
        localStorage.setItem('selectedChain', null);
    }

    useEffect(() => {
      if (typeof window !== 'undefined' && selectedChain) {
          localStorage.setItem('selectedChain', selectedChain);
      }
    }, [selectedChain]);

    const updateAccount = async () => {
      if (selectedChain === 'ethereum' && window.ethereum){
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          await vefifyChain()
          setAccount(accounts[0]);
        } catch (error) {
          console.error(error);
        }
      }
        
      if (selectedChain === 'solana' && window.solana) {        
        try {
          await window.solana.connect();
          const solanaAccount = window.solana.publicKey.toString();
          // TODO: Solana: verify connected chain for development, staging, or production.
          setAccount(solanaAccount);
        } catch (error) {
          console.error("Erro ao conectar com a Phantom Wallet:", error);
        }
      }
    }

    useEffect(() => {
        updateAccount()
        window.ethereum.on("accountsChanged", updateAccount)
        window.ethereum.on("disconnect", handleDisconnect)

        return () => {
        window.ethereum.removeListener("accountsChanged", updateAccount)
        window.ethereum.removeListener("disconnect", handleDisconnect)
        }
    }, [account])

    return (
      <AccountContext.Provider value={{ account, setAccount, selectedChain, setSelectedChain }}>
            {children}
        </AccountContext.Provider>
    );
}
