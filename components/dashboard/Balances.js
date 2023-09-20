import { useEffect, useState } from 'react';
import { BeatLoader } from "react-spinners";
import { useVaultContract } from "../../contexts/ContractContext";
import { useAccount } from "../../contexts/AccountContext";
import ERC20Token from '../../utils/ERC20Token';
import styles from "./Dashboard.module.css"
import { ethers } from "ethers";
import Payments from './Payments';

function Balances(props) {
  const { vaultContract, vaultLoading } = useVaultContract();
  const { account } = useAccount();
  const [userBalances, setUserBalances] = useState([]);
  const [showRedeemInput, setShowRedeemInput] = useState(null);
  const [redeemValue, setRedeemValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const handleRedeemClick = (index) => {
    setShowRedeemInput(index);
  };  

  const handleRedeemValueChange = (e) => {
    const inputAmount = parseFloat(e.target.value);
    if (isNaN(inputAmount)) {
      setRedeemValue('');
    } else {
      setRedeemValue(inputAmount.toString());
    }
  };

  const handleWithdrawal = async (user, amount, asset) => {
    if (user.toLowerCase() == account.toLowerCase()) {
    if (!localStorage.getItem(asset)) {
        const tokenContract = new ERC20Token(asset);
        const symbol = await tokenContract.symbol();
        const decimals = await tokenContract.decimals();

        await window.ethereum
        .request({
            method: "wallet_watchAsset",
            params: {
                type: "ERC20",
                options: {
                    address: asset,
                    symbol: symbol,
                    decimals: decimals,
                },
            },
        });
        localStorage.setItem(asset, 'added');
      }
    }
  };


  async function fetchUserBalances() {
    const tokenAddresses = [
      process.env.NEXT_PUBLIC_STABLE_VAULT_ADDRESS
    ]
    const balances = [];

    for (let address of tokenAddresses) {
      try {
        const tokenContract = new ERC20Token(address);
        const balance = await tokenContract.balanceOf(account);
        const decimals = await tokenContract.decimals();

        if (balance > 0) {
          balances.push({
            tokenAddress: address,
            tokenDecimals: decimals,
            amount: balance,
          });
        }
      } catch (error) {
        console.error(`Error when retrieving balance for ${address}:`, error);
      }
    }

    setUserBalances(balances);
  }

  const handleWithdraw = async (amount, balance) => {
    const redeemAmountInWei = ethers.utils.parseUnits(amount.toString(), balance.tokenDecimals);
      
      if (redeemAmountInWei.gt(balance.amount)) {
        alert("You cannot redeem more than your balance!");
        setRedeemValue(''); // Reset the input value
      }
    try {
      setIsLoading(true);
      const tx = await vaultContract.withdraw(redeemAmountInWei, process.env.NEXT_PUBLIC_FAKE_STABLE_ADDRESS)
      await tx.wait();
      await fetchUserBalances();
    } catch (error) {
      console.error("Error during withdrawal:", error);
    } finally {
      setShowRedeemInput(false);
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
        try {
            if (!vaultLoading) {
                await fetchUserBalances();
                vaultContract.on("Withdrawal", handleWithdrawal);
                
                return () => {
                    vaultContract.off("Withdrawal", handleWithdrawal);
                };
            }
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
  }, [vaultLoading]);



  const handleInvestClick = () => {
    alert("Future feature");
  };

  if (isLoading) {
    return (
      <div className={"loading-overlay"}>
        <div className={"sweet-loading"}>
          <BeatLoader loading={isLoading} size={50} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles["balance-list"]}>
      {userBalances.length > 0 && (
        <h1>Balances</h1>
      )}
      <div className={styles["card-list"]}>
        {userBalances.map((balance, index) => (
          <div key={index} className={styles["card"]}>
            <p>
              <strong>Balance</strong> 
              {parseFloat(ethers.utils.formatUnits(balance.amount, 18)).toFixed(2).replace(/\.00$/, '')} USD
            </p>
            <div className={styles["card-footer"]}>
              {showRedeemInput !== index && (
                <a onClick={() => handleRedeemClick(index)}>Redeem</a>
              )}
              {showRedeemInput === index && (
                <>
                  <input 
                    type="number" 
                    value={redeemValue}
                    onChange={(e) => handleRedeemValueChange(e)}
                  />
                  <button onClick={() => handleWithdraw(redeemValue, balance)} className={styles["confirm-btn"]}>Confirm Redeem</button>
                </>
              )}
            </div>
          </div>
        ))}
        <Payments limit={2} />
      </div>
    </div>
  );
  
}

export default Balances;
