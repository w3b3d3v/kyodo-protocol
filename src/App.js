import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Layouts from "./routes";
import {ConnectWalletButton, vefifyChain} from "./components/ConnectWalletButton/ConnectWalletButton";

function App() {
  const [account, setAccount] = useState(null);
  
  const handleDisconnect = () => {
    setAccount(null);
  };

  const updateAccount = async () => {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length > 0 && accounts[0] !== account) {
      await vefifyChain()
      setAccount(accounts[0]);
    }
  };

  useEffect(() => {
    updateAccount();
    window.ethereum.on("accountsChanged", updateAccount);
    window.ethereum.on("disconnect", handleDisconnect);

    return () => {
      window.ethereum.removeListener("accountsChanged", updateAccount);
      window.ethereum.removeListener("disconnect", handleDisconnect);
    };
  }, [account]);

  return (
    <Router>
      {account ? (
        <Layouts account={account} />
      ) : (
        <ConnectWalletButton account={account} updateAccount={updateAccount} />
      )}
    </Router>
  );
}

export default App;
