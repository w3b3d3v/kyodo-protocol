import React, { useState, useEffect} from "react";
import Image from 'next/image'
import styles from "./ConnectWalletButton.module.scss"
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import contractManager from "../../chains/ContractManager"
import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react'
import { useAccount as useWagmiAccount } from 'wagmi';
import { useAccount as useAppAccount } from "../../contexts/AccountContext";

require("@solana/wallet-adapter-react-ui/styles.css")

async function verifyChain(chain) {
  contractManager.verify(chain)
}

function ConnectWalletButton(props) {
  const [showModal, setShowModal] = useState(false);
  const { setVisible } = useWalletModal();
  const { open } = useWeb3Modal()
  const { selectedNetworkId } = useWeb3ModalState()
  const { publicKey } = useWallet();
  const { address } = useWagmiAccount();
  const { setSelectedChain } = useAppAccount();

  useEffect(() => {
    async function handleWalletConnection() {
      const selectedChain = localStorage.getItem('selectedChain');
      if (contractManager.supportedNetworks.includes(selectedChain) && address) {
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        const chainId = parseInt(chainIdHex, 16);
        if (!contractManager.getSupportedChains().includes(chainId)) {
          open({ view: 'Networks' });
        }
        props.value.setAccount(address);
        localStorage.setItem("selectedChain", parseInt(chainId))
      } else if (selectedChain === "solana" && publicKey) {
        props.value.setAccount(publicKey);
        await verifyChain("solana");
      }
    }
  
    handleWalletConnection();
  }, [address, publicKey, selectedNetworkId]);
  
  async function connectEthereumWallet() {
    setShowModal(false);
    if (window.ethereum) {
      open({ view: 'All wallets' });
    }
    const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
    const chainId = parseInt(chainIdHex, 16);
    setSelectedChain(chainId);
    localStorage.setItem("selectedChain", parseInt(chainId))
  }  

  async function connectSolanaWallet() {
    setShowModal(false);
    setVisible(true)
    localStorage.setItem('selectedChain', "solana");
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
