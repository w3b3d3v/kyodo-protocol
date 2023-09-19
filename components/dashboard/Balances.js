import { useEffect, useState } from 'react';
import { BeatLoader } from "react-spinners";
import { useVaultContract, useAgreementContract } from "../../contexts/ContractContext";
import { useAccount } from "../../contexts/AccountContext";
import ERC20Token from '../../utils/ERC20Token';
import styles from "./Dashboard.module.css"
import { ethers } from "ethers";
import Payments from './Payments';

function Balances(props) {
  const { vaultContract, vaultLoading } = useVaultContract();
  const { contract, loading } = useAgreementContract();
  const { account } = useAccount();
  const [userBalances, setUserBalances] = useState([]);
  const [showRedeemInput, setShowRedeemInput] = useState(null);
  const [redeemValue, setRedeemValue] = useState('');
  const [paidAgreements, setPaidAgreements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const handleRedeemClick = (index) => {
    setShowRedeemInput(index);
  };  

  const handleRedeemValueChange = (e, balance) => {
    const inputAmount = parseFloat(e.target.value);
    if (isNaN(inputAmount)) {
      setRedeemValue('');
    } else {
      setRedeemValue(inputAmount.toString());
    }
  };

  async function fetchPaidAgreements() {
    const companyFilter = contract.filters.PaymentMade(account, null);
    const professionalFilter = contract.filters.PaymentMade(null, account);

    const companyAgreements = await contract.queryFilter(companyFilter);
    const professionalAgreements = await contract.queryFilter(professionalFilter);

    const allAgreements = [...companyAgreements, ...professionalAgreements];

    setPaidAgreements(allAgreements.map(event => ({
      ...event.args,
      transactionHash: event.transactionHash
    })));
  }

  function renderPaidAgreements() {
    return paidAgreements.map((agreement, index) => (
      <div key={index} className={styles["card"]}>
        <h2>Agreement ID: {agreement.agreementId.toString()}</h2>
        <p>
          <strong>Status:</strong> {account.trim().toLowerCase() === agreement.company.trim().toLowerCase() ? "Paid" : "Received"}
        </p>
        <p>
          <strong>Amount:</strong> {parseFloat(ethers.utils.formatUnits(agreement.amount, 18)).toFixed(2).replace(/\.00$/, '')} USD
        </p>
        <div className={styles["card-footer"]}>
          <a href={`https://polygonscan.com/tx/${agreement.transactionHash}`} target="_blank" rel="noopener noreferrer" className={styles["confirm-btn"]}>
            View on Polygonscan
          </a>
        </div>
      </div>
    ));
  }  

  async function fetchUserBalances() {
    const tokenAddresses = [
      process.env.NEXT_PUBLIC_STABLE_VAULT_ADDRESS, 
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
      tx.wait();
    } catch (error) {
      console.error("Error during withdrawal:", error);
    }finally {
      fetchPaidAgreements();
      fetchUserBalances();
      setIsLoading(false);
      setShowRedeemInput(false);
    }
  };
  
  useEffect(() => {
    setIsLoading(true);
    if (!vaultLoading) {
      fetchUserBalances();
    }

    if (!loading) {
      fetchPaidAgreements()
    }
    setIsLoading(false);
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
      <h1>Balances</h1>
      <div className={styles["card-list"]}>
        {userBalances.map((balance, index) => (
          <div key={index} className={styles["card"]}>
              <h2>{balance.tokenName} ({balance.tokenSymbol})</h2>
            <p>
              <strong>Balance</strong> 
              {parseFloat(ethers.utils.formatUnits(balance.amount, 18)).toFixed(2).replace(/\.00$/, '')} USD
            </p>
            <div className={styles["card-footer"]}>
              <a onClick={() => handleRedeemClick(index)}>Redeem</a>
              {showRedeemInput === index && (
                <>
                  <input 
                    type="number" 
                    value={redeemValue}
                    onChange={(e) => handleRedeemValueChange(e, balance)} // Você precisará obter o saldo do usuário para este token
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
