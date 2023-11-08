import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { gnosisChiado, neonDevnet, polygonMumbai, polygonZkEvmTestnet } from 'wagmi/chains'
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
const chains = [gnosisChiado, neonDevnet, coreDaoTestnet, polygonMumbai, polygonZkEvmTestnet]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({ 
  wagmiConfig, 
  projectId, 
  chains,
  chainImages: {
    1442: "/chains/polygon-zk-evm.png",
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
  const [chainMetadata, setChainMetadata] = useState(null);

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
  const [selectedChain, setSelectedChain] = useState(null)

  const { setTransactionFail, setErrorMessage, errorMessage, transactionFail} = useTransactionHandler();

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

  const checkAndHandleChainMetadata = useCallback(() => {
    const metadata = contractManager.chainMetadata(selectedChain);
    if (!metadata) {
      setTransactionFail(true); 
      setErrorMessage("Unsupported Network");
    } else {
      setChainMetadata(metadata);
    }
  }, [selectedChain, setTransactionFail, setErrorMessage, handleSelectChain]);
  
  useEffect(() => {
    checkAndHandleChainMetadata();
  }, [selectedChain, selectedNetworkId, checkAndHandleChainMetadata]);

  const updateAccount = async () => {
    if (selectedChain && selectedChain.chain === "ethereum") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0 && accounts[0] !== account) {
          setAccount(accounts[0]);
        }
  
        setSelectedChain((prevChain) => {
          return prevChain.chainId !== selectedNetworkId ? { ...prevChain, chainId: selectedNetworkId } : prevChain;
        });
        
        if (!contractManager.getSupportedChains().includes(selectedChain) && account) {
          setTransactionFail(true); 
          setErrorMessage("Unsupported Network");
          handleSelectChain()
        }
      } catch (error) {
        console.error(error);
      }
    } else if (selectedChain && selectedChain.chain === "solana" && window.solana && window.solana.isConnected) {
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
      const selectedChainInterface = window[selectedChain.chain];
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
      chainMetadata,
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