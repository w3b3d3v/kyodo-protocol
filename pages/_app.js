import '../styles/globals.css'
import { VaultContractProvider, AgreementContractProvider } from "../components/ContractContext";
import {
  ConnectWalletButton,
  vefifyChain,
} from "../components/ConnectWalletButton/ConnectWalletButton"
import React, { useState, useEffect } from "react"

function MyApp({ Component, pageProps }) {
  const [account, setAccount] = useState(null)

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
  }, [account])

  return account ? (
    <AgreementContractProvider>
      <header className={"main-header"}>
        <div className={"holder"}>
          <Image
            src="/logo.svg"
            alt="Kyodo Protocol logo"
            width={120}
            height={32}
            className={"logo"}
          />
          <div className={"user-wallet"}>
            <em>4cb4...4c25</em>
            <span className={"wallet-on"}>Status</span>
            <Image
              src="/metamask.svg"
              alt="Metamask icon"
              width={22}
              height={19}
            />
          </div>
        </div>
      </header>

      <Component {...pageProps} />

      <footer className={"footer"}>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/web3dev.svg"
            alt="WEB3DEV Logo"
            width={20}
            height={31}
          />
        </a>
      </footer>
    </AgreementContractProvider>
  ) : (
    <ConnectWalletButton account={account} updateAccount={updateAccount} />
  )
}

export default MyApp
