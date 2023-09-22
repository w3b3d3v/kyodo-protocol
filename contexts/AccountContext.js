import React, { createContext, useContext, useState, useEffect } from 'react';
import { vefifyChain } from "../components/ConnectWalletButton/ConnectWalletButton"

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
    }, [account])

    return (
        <AccountContext.Provider value={{ account, setAccount }}>
            {children}
        </AccountContext.Provider>
    );
}
