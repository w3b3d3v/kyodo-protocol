import React, { createContext, useContext, useState, useEffect } from 'react';
import { vefifyChain } from "../components/ConnectWalletButton/ConnectWalletButton";

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

const AccountContext = createContext({
  account: null,
  setAccount: () => {},
  selectedChain: null,
  setSelectedChain: () => {},
})

export function useAccount() {
  return useContext(AccountContext)
}

export function AccountProvider({ children }) {
  const [account, setAccount] = useState(null)
  const [selectedChain, setSelectedChain] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedChain") || null
    }
    return null
  })

  const network = WalletAdapterNetwork.Devnet
  const endpoint = clusterApiUrl(network)
  const wallets = [new PhantomWalletAdapter()]

  const handleDisconnect = () => {
    setAccount(null)
    localStorage.setItem("selectedChain", null)
  }

  const updateAccount = async () => {
    if (selectedChain === "ethereum" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0 && accounts[0] !== account) {
          await vefifyChain()
          setAccount(accounts[0])
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    updateAccount()

    if (window[selectedChain]) {
      window[selectedChain].on("connect", updateAccount)
      window[selectedChain].on("disconnect", handleDisconnect)

      return () => {
        window[selectedChain].removeListener("connect", updateAccount)
        window[selectedChain].removeListener("disconnect", handleDisconnect)
      }
    }
  }, [account, selectedChain])

  return (
    <AccountContext.Provider value={{ account, setAccount, selectedChain, setSelectedChain }}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </AccountContext.Provider>
  )
}