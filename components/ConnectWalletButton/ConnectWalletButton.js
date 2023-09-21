import React from "react";
import Image from 'next/image'
import { ethers } from "ethers";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from "../../contexts/AccountContext";

const networkId = "0x13881";
const customChainId = "0x7A69";

async function vefifyChain() {
  const testEnv = (process.env.NODE_ENV !== "production");
  const chainId = window.ethereum.networkVersion

  if (testEnv) {
    if (chainId !== customChainId && chainId !== "31337") {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: customChainId,
            rpcUrls: ["http://localhost:8545"], // Update with your custom RPC URL
            chainName: "Hardhat",
            nativeCurrency: {
              name: "ETH",
              symbol: "HETH",
              decimals: 18,
            },
          },
        ],
      })
    }
  } else {
    if (chainId !== networkId && chainId !== "80001") {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: networkId,
            rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
            chainName: "Matic Mumbai Testnet",
            nativeCurrency: {
              name: "Matic",
              symbol: "MATIC",
              decimals: 18,
            },
            blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com/"],
          },
        ],
      })
    }
  }
}

function ConnectWalletButton({ setAccount, chains, account }){

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        // await vefifyChain()
        setAccount(accounts[0])
        // props.updateAccount();
      } catch (error) {
        console.error(error);
      } finally {
      }
    }
  }

  return (
      <div className={"holder home-entry"}>
        {account ? (
          <p>Connected with wallet {account}</p>
        ) : (
          <ConnectButton 
            className="connect-wallet"
            chainStatus="icon" 
            accountStatus="name" 
            showBalance={false}
            onClick={connectWallet}
          />
        )}
      </div>
  );
}

export {ConnectWalletButton, vefifyChain};
