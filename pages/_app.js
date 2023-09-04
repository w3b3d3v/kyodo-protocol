import '../styles/globals.css'
import { ContractProvider } from "../components/ContractContext"
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
    <ContractProvider>
      <Component {...pageProps} />
    </ContractProvider>
  ) : (
    <ConnectWalletButton account={account} updateAccount={updateAccount} />
  )
}

export default MyApp
