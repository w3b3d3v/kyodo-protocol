import React from "react";
import Image from 'next/image'
import { ethers } from "ethers";

const networkId = "0x13881";
const customChainId = "0x7A69";

async function vefifyChain() {
  const testEnv = (process.env.NODE_ENV !== "production"); //TODO: move this to .env (Is broken for some reason)
  // const testEnv = false;
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

function ConnectWalletButton(props) {

  async function connectWallet() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        await vefifyChain()
        props.updateAccount(accounts[0]);
      } catch (error) {
        console.error(error);
      } finally {
      }
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
          {props.account ? (
            <p>Conectado com a carteira {props.account}</p>
          ) : (
            <button className="connect-wallet" onClick={connectWallet}>
              <div>Connect wallet</div>
            </button>
          )}
        </div>
      </div>
      <footer>
        <div className={"holder"}>
          <p>
            <Image
              src="/web3dev.svg"
              alt="WEB3DEV"
              width={17}
              height={27}
            />
            &copy; 2023 WEB3DEV
          </p>
          <ul>
            <li>
              <a href="https://www.kyodoprotocol.xyz/code-of-conduct.html" target="_blank">
                Code of conduct 
              </a>
            </li>
            <li>
              <a href="https://www.kyodoprotocol.xyz/privacy-policy.html" target="_blank">
                Privacy policy
              </a>
            </li>
            <li>
              <a href="https://www.kyodoprotocol.xyz/terms-of-use.html" target="_blank">
                Terms of use
              </a>        
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export {ConnectWalletButton, vefifyChain};
