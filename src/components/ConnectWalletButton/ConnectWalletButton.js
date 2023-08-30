import React from "react";
import Web3 from "web3";

const networkId = "0x13881";

async function vefifyChain(){
  const chainId = window.ethereum.networkVersion;
  console.log("chainId: " + chainId);
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
        <button onClick={connectWallet}>Conectar carteira</button>
      )}
    </div>
  );
}

export {ConnectWalletButton, vefifyChain};
