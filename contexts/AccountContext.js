import React, { createContext, useContext, useState, useEffect } from 'react';
import { vefifyChain } from "../components/ConnectWalletButton/ConnectWalletButton";

const AccountContext = createContext({
  account: null,
  setAccount: () => {},
  selectedChain: null,
  setSelectedChain: () => {},
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
    setAccount(null);
    localStorage.setItem('selectedChain', null);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && selectedChain) {
      localStorage.setItem('selectedChain', selectedChain);
    }
  }, [selectedChain]);

  const updateAccount = async () => {
    if (selectedChain === 'ethereum' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0 && accounts[0] !== account) {
          await vefifyChain();
          setAccount(accounts[0]);
        }
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
  };

  useEffect(() => {
    updateAccount();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", updateAccount);
      window.ethereum.on("disconnect", handleDisconnect);

      return () => {
        window.ethereum.removeListener("accountsChanged", updateAccount);
        window.ethereum.removeListener("disconnect", handleDisconnect);
      };
    }

    if (window.solana) {
      window.solana.on("connect", updateAccount);
      window.solana.on("disconnect", handleDisconnect);

      return () => {
        window.solana.removeListener("connect", updateAccount);
        window.solana.removeListener("disconnect", handleDisconnect);
      };
    }
  }, [account, selectedChain]);

  return (
    <AccountContext.Provider value={{ account, setAccount, selectedChain, setSelectedChain }}>
      {children}
    </AccountContext.Provider>
  );
}