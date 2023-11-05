import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import contractManager from "../chains/ContractManager"
import { useWeb3ModalState, useWeb3Modal } from '@web3modal/wagmi/react'

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import { gnosisChiado, neonDevnet, polygonMumbai } from 'wagmi/chains'
import { defineChain } from 'viem'
import { useAccount as useWagmiAccount } from 'wagmi';

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
const chains = [gnosisChiado, neonDevnet, coreDaoTestnet, polygonMumbai]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({ 
  wagmiConfig, 
  projectId, 
  chains,
  chainImages: {
    1115: "/chains/core-dao.png",
    10_200: "/chains/gnosis-chain.png",
    245_022_926: "/chains/neonevm-logo.png",
    80001: "/chains/polygon-matic-logo.svg",
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
  })

  const network = WalletAdapterNetwork.Devnet
  const endpoint = clusterApiUrl(network)
  const wallets = [new PhantomWalletAdapter()]

  const handleDisconnect = () => {
    setAccount(null)
    localStorage.setItem("selectedChain", null)
    setSelectedChain(null)
  }


  const hancleChainChanged = () => {
    localStorage.setItem("selectedChain", parseInt(selectedNetworkId))
    setSelectedChain(selectedNetworkId)
    window.location.reload()
  }

  const handleSelectChain = () => {
    open({ view: 'Networks' })
  }

  const handleSelectWallet = () => {
    open({ view: 'Account' })
  }

  const updateAccount = async () => {
    if (contractManager.getSupportedChains().includes(Number(selectedChain)) && window.ethereum) {  
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
        localStorage.setItem("selectedChain", parseInt(chainId))
        setSelectedChain(parseInt(chainId))
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

    if (window.ethereum) {
      try {
        window.ethereum.on("chainChanged", hancleChainChanged)
        window.ethereum.on("accountsChanged", updateAccount)
        window.ethereum.on("disconnect", handleDisconnect)
  
        return () => {
          window.ethereum.removeListener("connect", updateAccount)
          window.ethereum.removeListener("disconnect", handleDisconnect)
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