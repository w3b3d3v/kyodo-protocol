import React, { useState } from "react";
import Image from 'next/image'
import { ethers } from "ethers";
import styles from "./ConnectWalletButton.module.css"

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
            rpcUrls: ["http://localhost:8545"],
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

function ConnectWalletButton(props) {
  const [showModal, setShowModal] = useState(false);

  async function connectEthereumWallet() {
    setShowModal(false);
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        await vefifyChain()
        props.value.setAccount(accounts[0]);
        props.value.setSelectedChain("ethereum");
        localStorage.setItem('selectedChain', "ethereum");
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function connectSolanaWallet() {
    setShowModal(false);
    if (window.solana) {
      try {
        await window.solana.connect();
        const solanaAccount = window.solana.publicKey.toString();
        props.value.setAccount(solanaAccount);
        props.value.setSelectedChain("solana");
        localStorage.setItem('selectedChain', "solana");
      } catch (error) {
        console.error("Erro ao conectar com a Phantom Wallet:", error);
      }
    } else {
        alert("Phantom wallet não encontrada, por favor instale a extensão.");
    }
}


  return (
    <div className="connect-wallet-bg">
      <div className={"home-entry"}>
        <div>
          <Image
            src="/logo-square.svg"
            alt="WEB3DEV"
            width={130}
            height={130}
          />
          <h2>Connect your wallet to start</h2>
          <button className="connect-wallet" onClick={() => setShowModal(true)}>
            <div>Connect wallet</div>
          </button>
      </div>
      {showModal && (
        <div className={styles["modal"]}>
          <div className={styles["modal-content"]}>
            <button className="close-modal" onClick={() => setShowModal(false)}>X</button>
            <h2>Select the desired Chain</h2>
            <br></br>
            <button onClick={connectEthereumWallet}>Ethereum and Other EVMs</button>
            <br></br>
            <button onClick={connectSolanaWallet}>Solana</button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export {ConnectWalletButton, vefifyChain};
