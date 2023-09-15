import React, { useState, useEffect } from 'react';
import { BeatLoader } from "react-spinners";
import { ethers } from "ethers";
import tokens from "../../public/allowedTokens.json"
import styles from "./AgreementList.module.css"
import { useAccount } from "../../contexts/AccountContext"
import { useAgreementContract } from "../../contexts/ContractContext"
import "./AgreementList.module.css"
import ERC20Token from '../../utils/ERC20Token';


function AgreementList(props) {
  const { account } = useAccount();
  const { contract, loading } = useAgreementContract();
  const [agreements, setAgreements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentValue, setPaymentValue] = useState('');
  const [showPaymentInput, setShowPaymentInput] = useState(null);
  const [isAllowanceSufficient, setIsAllowanceSufficient] = useState(false);
  const [userAllowance, setUserAllowance] = useState(null);


  const checkAllowance = async (userAddress, contractAddress, paymentTokenAddress) => {
    const tokenContract = new ERC20Token(paymentTokenAddress);
    const allowance = await tokenContract.allowance(userAddress, contractAddress);
    setUserAllowance(ethers.BigNumber.from(allowance.toString()))
  };

  const handleApprove = async (amount, paymentToken, spender) => {
    try {
    
      const amountInWei = ethers.utils.parseUnits(amount.toString(), paymentToken.decimals)
      const tokenContract = new ERC20Token(paymentToken.address);
      const tx = await tokenContract.approve(spender, amountInWei);
      await tx.wait();
  
      console.log(`Approval successful for amount: ${amount}`);
    } catch (error) {
      console.error('Error approving token:', error);
    }
  };
  
  const handlePayClick = (index, paymentToken) => {
    setShowPaymentInput(index);
    checkAllowance(account, contract.address, paymentToken.address);
  };

  const handlePaymentValueChange = async (e, paymentToken) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) {
      setPaymentValue('');
    } else {
      setPaymentValue(value);
      const paymentAmountInWei = ethers.utils.parseUnits(value.toString(), paymentToken.decimals)
      setIsAllowanceSufficient(userAllowance.gte(paymentAmountInWei));
    }
  };
  
  const handleMakePayment = async (agreementId, totalAmount, totalPaid, paymentToken) => {      
      setIsLoading(true)  
      const paymentAmountInWei = ethers.utils.parseUnits(paymentValue.toString(), paymentToken.decimals)

      if (parseFloat(paymentAmountInWei) <= 0) {
        alert('Invalid payment amount.');
        return;
      }

      if (!isAllowanceSufficient) {
        await handleApprove(paymentValue, paymentToken, contract.address);
      }

      try {
        const tx = await contract.makePayment(
          agreementId, 
          paymentAmountInWei
        );
        await tx.wait();
      } catch (error) {
        console.error('Error when making payment', error);
      } finally {
        setIsLoading(false);
        fetchAgreements();
        setShowPaymentInput(false);
      }
  };

  async function fetchAgreements() {
    try {
      const userAgreementIds = await contract.getUserAgreements(account);
      const stringIds = userAgreementIds.map(id => id.toString());

      const fetchedAgreements = await Promise.all(stringIds.map(async (agreementId) => {
        const agreement = await contract.getAgreementById(agreementId);
        return agreement;
      }));
      
      setAgreements(fetchedAgreements);
    } catch (error) {
      console.error('Error when fetching agreements:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
      fetchAgreements();
  }, [account]);    

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

    <div className={styles["agreement-list"]}>
      <h1>Agreements</h1>
      <div className={styles["card-list"]}>

        {agreements.map((agreement, index) => {
          const paymentToken = tokens.find(token => token.address === agreement.payment.tokenAddress);
          const paymentTokenName = paymentToken ? paymentToken.name : 'Unknown Token';

          return (
            <div key={index} className={styles["card"]}>
              <h2>{agreement.title}</h2>
              <div className={styles["wallet-key"]}>
                {agreement.developer}
              </div>
              <div className={styles["card-desc"]}>
                {agreement.description}
              </div>

              <p><strong>Skills</strong> {agreement.skills.join(", ")}</p>
              <p>
                <strong>Payment amount</strong> 
                {parseFloat(ethers.utils.formatUnits(agreement.payment.amount, 18)).toFixed(2).replace(/\.00$/, '')} USD
              </p>
              <p><strong>Payment token</strong> {paymentTokenName}</p> {/* Display token name */}
              <p>
                <strong>Total paid</strong> 
                {parseFloat(ethers.utils.formatUnits(agreement.totalPaid, 18)).toFixed(2).replace(/\.00$/, '')} USD
              </p>

              <div className={styles["card-footer"]}>
                <>
                  <a onClick={() => handlePayClick(index, paymentToken)}>Pay agreement</a>
                  {showPaymentInput === index && (
                    <>
                      <input 
                        type="number" 
                        value={paymentValue}
                        onChange={(e) => handlePaymentValueChange(e, paymentToken)}
                      />
                      <button onClick={() => handleMakePayment(agreement.id, agreement.payment.amount, agreement.totalPaid, paymentToken)} className={styles["confirm-btn"]}>
                        Confirm payment
                      </button>
                    </>
                  )}
                </>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ); 
}

export default AgreementList;
