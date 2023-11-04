import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import contractManager from "../chains/ContractManager"

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import { gnosisChiado, neonDevnet } from 'wagmi/chains'
import { defineChain } from 'viem'

const coreDaoTestnet = defineChain({
  id: 1115,
  name: 'Core Chain TestNet',
  network: 'coreDaoTestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Test Core',
    symbol: 'tCORE',
  },
  rpcUrls: {
    public: { http: ['https://rpc.test.btcs.network'] },
    default: { http: ['https://rpc.test.btcs.network'] },
  },
  blockExplorers: {
    default: { name: 'CoreDao Testnet', url: 'https://scan.test.btcs.network' },
  },
  testnet: true,
})

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID
console.log("projectId", projectId)
const chains = [gnosisChiado, neonDevnet, coreDaoTestnet]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({ 
  wagmiConfig, 
  projectId, 
  chains,
  chainImages: {
    1115: "https://s1.coincarp.com/logo/1/core-dao.png",
    10_200: "https://avatars.githubusercontent.com/u/92709226?s=200",
    245_022_926: "https://neonevm.org/favicons/apple-touch-icon.png",
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
          setAccount(accounts[0])
        }
        
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        const chainId = parseInt(chainIdHex, 16);
        if (!contractManager.getSupportedChains().includes(chainId)) {
          open({ view: 'Networks' });
        }
      } catch (error) {
        console.error(error)
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
    updateAccount()
    if (window[selectedChain]) {
      try {
        window[selectedChain].on("connect", updateAccount)
        window[selectedChain].on("accountsChanged", updateAccount)
        window[selectedChain].on("disconnect", handleDisconnect)
  
        return () => {
          window[selectedChain].removeListener("connect", updateAccount)
          window[selectedChain].removeListener("disconnect", handleDisconnect)
        }
      } catch (error) {
        if (error instanceof UserRejectedRequestError) {
          // Handle user rejection
        }
      }
    }
  }, [account, selectedChain])

  return (
    <AccountContext.Provider value={{
      account,
      setAccount,
      selectedChain,
      setSelectedChain,
      isOnboardingComplete,
      completeOnboarding
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