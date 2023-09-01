import React from "react";
import Web3 from "web3";

const networkId = "0x13881";
const customChainId = "0x7A69";

async function vefifyChain() {
  const testEnv = true; //TODO: move this to .env (Is broken for some reason)
  const chainId = window.ethereum.networkVersion;

  if (testEnv) {
    if (chainId !== customChainId && chainId !== "31337"){
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: customChainId,
          rpcUrls: ["http://localhost:8545"], // Update with your custom RPC URL
          chainName: "Hardhat",
          nativeCurrency: {
            name: "ETH",
            symbol: "HETH",
            decimals: 18,
          },
        }],
      });
    }
  } else {
    if (chainId !== networkId && chainId !== "80001") {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: networkId,
          rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
          chainName: "Matic Mumbai Testnet",
          nativeCurrency: {
            name: "Matic",
            symbol: "MATIC",
            decimals: 18,
          },
          blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com/"],
        }],
      });
    }
  }
  }

function ConnectWalletButton(props) {

  async function connectWallet() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        await vefifyChain()
        props.updateAccount(accounts[0]);
      } catch (error) {
        console.error(error);
      } finally {
      }
    }
  }

  return (
    <div>
      {props.account ? (
        <p>Conectado com a carteira {props.account}</p>
      ) : (
        <button className="connect-wallet-button" onClick={connectWallet}>
          Conectar carteira
        </button>
      )}
  </div>
  );
}

export {ConnectWalletButton, vefifyChain};
