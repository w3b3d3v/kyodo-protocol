import { useEffect, useState } from 'react';
import { BeatLoader } from "react-spinners";
import { useVaultContract, useAgreementContract } from "../../contexts/ContractContext";
import { useAccount } from "../../contexts/AccountContext";
import ERC20Token from '../../utils/ERC20Token';
import styles from "./Dashboard.module.css"
import { ethers } from "ethers";

function Balances(props) {
  const { vaultContract, vaultLoading } = useVaultContract();
  const { contract, loading } = useAgreementContract();
  const { account } = useAccount();
  const [userBalances, setUserBalances] = useState([]);
  const [showRedeemInput, setShowRedeemInput] = useState(null);
  const [redeemValue, setRedeemValue] = useState('');
  const [paidAgreements, setPaidAgreements] = useState([]);


  const handleRedeemClick = (index) => {
    setShowRedeemInput(index);
  };  

  const handleRedeemValueChange = (e, balance) => {
    const inputAmount = parseFloat(e.target.value);
    if (isNaN(inputAmount)) {
      setRedeemValue('');
    } else {
      setRedeemValue(inputAmount.toString());
      const redeemAmountInWei = ethers.utils.parseUnits(inputAmount.toString(), balance.tokenDecimals);
      
      if (redeemAmountInWei.gt(balance.amount)) {
        alert("You cannot redeem more than your balance!");
        setRedeemValue(''); // Reset the input value
      }
    }
  };

  async function fetchPaidAgreements() {
    const companyFilter = contract.filters.PaymentMade(account, null);
    const professionalFilter = contract.filters.PaymentMade(null, account);

    const companyAgreements = await contract.queryFilter(companyFilter);
    const professionalAgreements = await contract.queryFilter(professionalFilter);
    console.log("companyAgreements", companyAgreements);
    console.log("professionalAgreements", professionalAgreements);

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
            {console.log(agreement)}
            <p>
                <strong>Status:</strong> {account.trim().toLowerCase() === agreement.company.trim().toLowerCase() ? "Paid" : "Received"}
            </p>
            <p>
                <strong>Amount: {ethers.utils.formatUnits(agreement.amount, 18)} USD </strong> 
            </p>
            <a href={`https://polygonscan.com/tx/${agreement.transactionHash}`} target="_blank" rel="noopener noreferrer">
            {agreement.transactionHash}
            </a>
        </div>
    ));
  }


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


  const handleWithdraw = async (amount, balance) => {
    const redeemAmountInWei = ethers.utils.parseUnits(amount.toString(), balance.tokenDecimals);
    try {
      const tx = await vaultContract.withdraw(redeemAmountInWei, process.env.NEXT_PUBLIC_FAKE_STABLE_ADDRESS)
      console.log("tx", tx);
    } catch (error) {
      console.error("Error during withdrawal:", error);
    }
  };
  
  useEffect(() => {
    if (!vaultLoading) {
      fetchUserBalances();
    }

    if (!loading) {
      fetchPaidAgreements()
    }
  }, [vaultLoading]);

  const handleInvestClick = () => {
    alert("Future feature");
  };

  if (vaultLoading) {
    return (
      <div className="loading-overlay">
        <div className="sweet-loading">
          <BeatLoader loading={vaultLoading} size={50} />
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
            <button onClick={() => handleRedeemClick(index)}>Redeem</button>
              {showRedeemInput === index && (
                <>
                  <input 
                    type="number" 
                    value={redeemValue}
                    onChange={(e) => handleRedeemValueChange(e, balance)} // Você precisará obter o saldo do usuário para este token
                  />
                  <br></br>
                  <button onClick={() => handleWithdraw(redeemValue, balance)}>Confirm Redeem</button>
                </>
              )}
              <br></br>
              <button onClick={handleInvestClick} className={styles["button"]}>Invest</button>
            </div>
          </div>
        ))}
        <h1>Paid Agreements</h1>
        <div className={styles["card-list"]}>
            {renderPaidAgreements()}
        </div>
      </div>
    </div>
  );
}

export default Balances;
