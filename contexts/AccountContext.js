import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

import {
    ConnectWalletButton,
    vefifyChain,
} from "../components/ConnectWalletButton/ConnectWalletButton"

import {
  RainbowKitProvider,
  connectorsForWallets,
  lightTheme
} from '@rainbow-me/rainbowkit';

import {
  phantomWallet,
  metaMaskWallet,
  trustWallet,
  ledgerWallet
} from '@rainbow-me/rainbowkit/wallets';

import {
  polygon,
  polygonMumbai,
} from 'wagmi/chains';

const hardhatNode = {
  id: 31337,
  name: 'Hardhat',
  network: 'hardhat',
  iconUrl: '../public/hardhat.svg',
  iconBackground: '#fff',
  nativeCurrency: {
    name: "ETH",
    symbol: "HETH",
    decimals: 18,
  },
  rpcUrls: {
    public: { http: ['http://localhost:8545'] },
    default: { http: ['http://localhost:8545'] },
  },
  testnet: false,
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    hardhatNode,
    polygon,
    polygonMumbai,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [publicProvider()]
);

const projectId = 'YOUR_PROJECT_ID';

const connectors = connectorsForWallets([
  {
    groupName: 'Supported',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      phantomWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains })
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const AccountContext = createContext();

export function useAccount() {
    return useContext(AccountContext);
}

export function AccountProvider({ children }) {
    const [account, setAccount] = useState(null);

    const handleDisconnect = () => {
        setAccount(null)
    }

    const updateAccount = async () => {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0 && accounts[0] !== account) {
        await vefifyChain()
        setAccount(accounts[0])
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
    }, [account]);

    return (
        <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider theme={lightTheme()} chains={chains}>
          <AccountContext.Provider value={{ account, setAccount }}>
          <ConnectWalletButton setAccount={setAccount} chains={chains} account={account}/>
            {account && children}
          </AccountContext.Provider>
        </RainbowKitProvider>
        </WagmiConfig>
    );
}