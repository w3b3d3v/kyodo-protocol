import { useEffect, useState } from 'react';
import { BeatLoader } from "react-spinners";
import { useVaultContract } from "../../contexts/ContractContext";
import { useAccount } from "../../contexts/AccountContext";
import ERC20Token from '../../utils/ERC20Token';
import styles from "./Dashboard.module.css"
import { ethers } from "ethers";

function Balances(props) {
  const { contract, loading } = useVaultContract();
  const { account } = useAccount();
  const [userBalances, setUserBalances] = useState([]);

  useEffect(() => {
    if (!loading) {
      async function fetchUserBalances() {
        const tokenAddresses = [
          process.env.NEXT_PUBLIC_W3D_STABLE_VAULT_ADDRESS, 
          process.env.NEXT_PUBLIC_FAKE_STABLE_ADDRESS
        ]
        const balances = [];

        for (let address of tokenAddresses) {
          try {
            const tokenContract = new ERC20Token(address);
            const balance = await tokenContract.balanceOf(account);
            const symbol = await tokenContract.symbol();
            const name = await tokenContract.name();
            const decimals = await tokenContract.decimals();

            if (balance > 0) {
              balances.push({
                tokenAddress: address,
                tokenSymbol: symbol,
                tokenDecimals: decimals,
                tokenName: name,
                amount: balance,
              });
            }
          } catch (error) {
            console.error(`Erro ao obter saldo para o token ${address}:`, error);
          }
        }

        setUserBalances(balances);
      }

      fetchUserBalances();
    }
  }, [loading]);

  const handleRedeemClick = () => {
    alert("Future feature");
  };

  const handleInvestClick = () => {
    alert("Future feature");
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="sweet-loading">
          <BeatLoader loading={loading} size={50} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles["balance-list"]}>
      <h1>Balances</h1>
      <div className={styles["card-list"]}>
        {userBalances.map((balance, index) => (
          <div key={index} className={styles["card"]}>
            <a href={`https://polygonscan.com/token/${balance.tokenAddress}`} target="_blank" rel="noopener noreferrer">
              <h2>{balance.tokenName} ({balance.tokenSymbol})</h2>
            </a>
            <p><strong>Balance:</strong> {ethers.utils.formatUnits(balance.amount.toString(), balance.tokenDecimals)}</p>
            <div className={styles["button-group"]}>
              <button onClick={handleRedeemClick} className={styles["button"]}>Redeem</button>
              <button onClick={handleInvestClick} className={styles["button"]}>Invest</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Balances;
