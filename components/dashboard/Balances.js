import { useEffect, useState } from 'react';
import { BeatLoader } from "react-spinners";
import { useVaultContract } from "../../contexts/ContractContext";
import { useAccount } from "../../contexts/AccountContext";
import ERC20Token from '../../utils/ERC20Token';
import styles from "./Dashboard.module.scss"
import { ethers } from "ethers";
import Payments from './Payments';
import Image from 'next/image'

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

    <section className={styles["user-home"]}>

      {/* {userBalances.length > 0 && (
        <h1>Balances</h1>
      )} */}

      <div className={styles["dashboard-header"]}>

        <h1>GM, mate!</h1>

        {userBalances.map((balance, index) => (
          <div key={index} className={styles["balance-heading"]}>
            <p className={styles["usd-balance"]}>
              <Image
                src="/usd-icon.svg"
                alt="USD icon"
                width={32}
                height={32}
              />
              <span>{parseFloat(ethers.utils.formatUnits(balance.amount, 18)).toFixed(2).replace(/\.00$/, '')}</span>
            </p>
            <p>
              {showRedeemInput !== index && (
                <a onClick={() => handleRedeemClick(index)}>Redeem</a>
              )}
              {showRedeemInput === index && (
                <>
                  <div className={styles["opened-items"]}>
                    <input 
                      type="number" 
                      value={redeemValue}
                      onChange={(e) => handleRedeemValueChange(e)}
                      placeholder="USD"
                    />
                    <button onClick={() => handleWithdraw(redeemValue, balance)}>Confirm</button>
                  </div>
                </>
              )}
            </p>
          </div>
        ))}

      </div>

      <ul className={styles["home-calls"]}>
        <li className={styles["disabled"]}>
          <h2>Complete your profile to be visible</h2>
          <div className={styles["progressbar"]}>
            <div></div>
          </div>
          <p>You profile is <strong>35%</strong> complete</p>
          <a href="#">Complete profile</a>
        </li>
        <li>
          <h2>Add an agreement</h2>
          <p>Start adding your first agreement.</p>
          <a href="/agreements/new">Add agreement</a>
        </li>
        <li className={styles["disabled"]}>
          <h2>Refer and<br></br> earn</h2>
          <p>Professionals or contractors that refer the usage of Kyodo, can earn a % of paid value to the protocol.</p>
          <a href="#">Get referral link</a>
        </li>
      </ul>

      <Payments limit={2} />
      
    </section>
  );
  
}

export default Balances;
