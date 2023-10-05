import React, { useState, useEffect} from "react";
import { ethers } from "ethers";
import Image from 'next/image'
import styles from "./ConnectWalletButton.module.scss"
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import contractManager from "../../chains/ContractManager"
require("@solana/wallet-adapter-react-ui/styles.css")

async function verifyChain(chain) {
  contractManager.verify(chain)
}

function ConnectWalletButton(props) {
  const [showModal, setShowModal] = useState(false);
  const { setVisible } = useWalletModal();
  const { publicKey, connected} = useWallet();

  useEffect(() => {
    async function checkSolana() {
      if (connected) {
        props.value.setAccount(publicKey);
        console.log("publicKey", publicKey);
        localStorage.setItem('selectedChain', "solana");
        await verifyChain("solana");
      }
    }

    checkSolana();
  }, [publicKey]);

  async function connectEthereumWallet() {
    setShowModal(false);
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        await verifyChain("ethereum")
        
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
    setVisible(true)
  }

  return (
    <div className={styles["connect-wallet-bg"]}>
      <div className={styles["home-entry"]}>
        <div>
          <Image src="/logo-square.svg" alt="WEB3DEV" width={130} height={130} />
          <h2>Connect your wallet to start</h2>
          <button className={styles["connect-wallet"]} onClick={() => setShowModal(true)}>
            <div>Connect wallet</div>
          </button>
        </div>
      </div>
      {showModal && 
        (
          <div className={styles["modal"]}>
            <div className={styles["modal-content"]}>
              <a className={styles["close-modal"]} onClick={() => setShowModal(false)}>
                <Image src="/close-modal.svg" width={30} height={30} alt="close" />
              </a>
              <h3>Select a chain and unlock the future of work</h3>
              <ul className={styles["chains-list"]}>
                <li>
                  <a onClick={connectEthereumWallet}>
                    <Image src="/eth-icon.svg" width={60} height={60} alt="Eth" />
                    <h4>Ethereum<span>/Other EVMs</span></h4>
                    <p>A solid, well-defined foundation for Web3</p>
                  </a>
                </li>
                <li>
                  <a onClick={connectSolanaWallet}>
                    <Image src="/solana-icon.svg" width={60} height={60} alt="Solana" />
                    <h4>Solana</h4>
                    <p>Web3 Infrastructure for Everyone</p>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )
      }
    </div>
  )
}

export {ConnectWalletButton, verifyChain};
