import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import contractManager from "../chains/ContractManager"
import { useWeb3ModalState, useWeb3Modal } from '@web3modal/wagmi/react'
import useTransactionHandler from '../hooks/useTransactionHandler';

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import { sepolia, avalancheFuji, polygonMumbai, bscTestnet, baseGoerli } from 'wagmi/chains'

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID
const chains = [sepolia, avalancheFuji, polygonMumbai, bscTestnet, baseGoerli]
const wagmiConfig = defaultWagmiConfig({ chains, projectId })

createWeb3Modal({ 
  wagmiConfig, 
  projectId, 
  chains,
  chainImages: {
    11_155_111: "/chains/ethereum.svg",
    43_113: "/chains/avalanche.svg",
    80_001: "/chains/polygon-matic-logo.svg",
    97: "/chains/bsc.svg",
    84531: "/chains/base.svg",
  }
})

const AccountContext = createContext({
  account: null,
  setAccount: () => {},
  selectedChain: null,
  setSelectedChain: () => {},
  isOnboardingComplete: false,
  completeOnboarding: () => {}
});

export function useAccount() {
  return useContext(AccountContext)
}

export function AccountProvider({ children }) {
  const { open } = useWeb3Modal()
  const { selectedNetworkId } = useWeb3ModalState()

  const [isOnboardingComplete, setIsOnboardingComplete] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isOnboardingComplete") === "true";
    }
    return false;
  });
  
  const completeOnboarding = () => {
    setIsOnboardingComplete(true);
    localStorage.setItem("isOnboardingComplete", "true");
  };

  const [account, setAccount] = useState(null)
  const [selectedChain, setSelectedChain] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedChain") || null
    }
    return null
  })

  const { setTransactionFail, setErrorMessage} = useTransactionHandler();

  const network = WalletAdapterNetwork.Devnet
  const endpoint = clusterApiUrl(network)
  const wallets = [new PhantomWalletAdapter()]

  const handleDisconnect = () => {
    setAccount(null)
    localStorage.setItem("selectedChain", null)
    setSelectedChain(null)
  }
  
  const handleSelectChain = () => {
    open({ view: 'Networks' })
  }

  const handleSelectWallet = () => {
    open({ view: 'Account' })
  }

  const updateAccount = async () => {
    if (selectedNetworkId && selectedChain === "ethereum") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0 && accounts[0] !== account) {
          setAccount(accounts[0]);
        }
        
        if (!contractManager.getSupportedChains().includes(selectedNetworkId) && account) {
          setErrorMessage("Unsupported Network");
          setTransactionFail(true);
          handleSelectChain()
        }
      } catch (error) {
        console.error(error);
      }
    } else if (selectedChain === "solana" && window.solana && window.solana.isConnected) {
      try {
        const solanaAccount = window.solana.publicKey.toString()
        if (solanaAccount && solanaAccount !== account) {
          setAccount(solanaAccount)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
  
  useEffect(() => {
    updateAccount();
  
    if (selectedChain) {
      const selectedChainInterface = window[selectedChain];
      if (selectedChainInterface) {
        selectedChainInterface.on("chainChanged", updateAccount);
        selectedChainInterface.on("accountsChanged", updateAccount);
        selectedChainInterface.on("disconnect", handleDisconnect);
    
        return () => {
          selectedChainInterface.removeListener("chainChanged", updateAccount);
          selectedChainInterface.removeListener("accountsChanged", updateAccount);
          selectedChainInterface.removeListener("disconnect", handleDisconnect);
        };
      }
    }
  }, [account, selectedChain, selectedNetworkId]);

  return (
    <AccountContext.Provider value={{
      account,
      setAccount,
      selectedChain,
      selectedNetworkId,
      setSelectedChain,
      isOnboardingComplete,
      completeOnboarding,
      handleSelectChain,
      handleSelectWallet
    }}>
      <WagmiConfig config={wagmiConfig}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>{children}</WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </WagmiConfig>
    </AccountContext.Provider>
  );
}