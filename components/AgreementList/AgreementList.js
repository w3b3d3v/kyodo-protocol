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
  const [selectedPaymentToken, setSelectedPaymentToken] = useState(null);


  const checkAllowance = async (userAddress, contractAddress, selectedToken) => {
    const tokenContract = new ERC20Token(selectedToken.address);
    const allowance = await tokenContract.allowance(userAddress, contractAddress);
    setUserAllowance(ethers.BigNumber.from(allowance.toString()))
  };

  const handleApprove = async (amount, spender) => {
    try {
      const amountInWei = ethers.utils.parseUnits(amount.toString(), selectedPaymentToken.decimals)
      const tokenContract = new ERC20Token(selectedPaymentToken.address);
      const tx = await tokenContract.approve(spender, amountInWei);
      await tx.wait();
  
      console.log(`Approval successful for amount: ${amount}`);
    } catch (error) {
      console.error('Error approving token:', error);
    }
  };
  
  const handlePayClick = (index) => {
    setShowPaymentInput(index);
  };

  const handlePaymentValueChange = async (e) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) {
      setPaymentValue('');
    } else {
      setPaymentValue(value);
      const paymentAmountInWei = ethers.utils.parseUnits(value.toString(), selectedPaymentToken.decimals)
      setIsAllowanceSufficient(userAllowance.gte(paymentAmountInWei));
    }
  };
  
  const handleMakePayment = async (agreementId) => {      
    console.log("selectedPaymentToken", selectedPaymentToken)
    setIsLoading(true)  
      const paymentAmountInWei = ethers.utils.parseUnits(paymentValue.toString(), selectedPaymentToken.decimals)

      if (parseFloat(paymentAmountInWei) <= 0) {
        alert('Invalid payment amount.');
        return;
      }

      if (!isAllowanceSufficient) {
        await handleApprove(paymentValue, contract.address);
      }

      try {
        const tx = await contract.makePayment(
          agreementId, 
          paymentAmountInWei,
          selectedPaymentToken.address
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
          return (
            <div key={index} className={styles["card"]}>

              <div key={index} className={styles["card-heading"]}>
                <h2>{agreement.title}</h2>
                <div className={styles["wallet-key"]}>
                  {agreement.developer}
                </div>
              </div>

              <div className={styles["card-desc"]}>
                {agreement.description}
              </div>

              <p className={styles["skills-section"]}>
                <strong>Skills</strong> <span>{agreement.skills.join(", ")}</span>
              </p>
              
              <p>
                <strong>Payment amount</strong> 
                {parseFloat(ethers.utils.formatUnits(agreement.payment.amount, 18)).toFixed(2).replace(/\.00$/, '')} USD
              </p>
              <p>
                <strong className={styles["total-paid"]}>Total paid</strong> 
                {parseFloat(ethers.utils.formatUnits(agreement.totalPaid, 18)).toFixed(2).replace(/\.00$/, '')} USD
              </p>

              <div className={styles["card-footer"]}>
                <>
                  <a onClick={() => handlePayClick(index)}>Pay agreement</a>
                  {showPaymentInput === index && (
                    <>
                      <div className={styles["opened-items"]}>
                        <select
                          value={selectedPaymentToken ? selectedPaymentToken.address : ""}
                          onChange={(event) => {
                            const selectedTokenAddress = event.target.value;
                            const selectedToken = tokens.find((token) => token.address === selectedTokenAddress);
                            checkAllowance(account, contract.address, selectedToken);
                            setSelectedPaymentToken(selectedToken);
                          }}
                          className={styles["select-input"]}
                        >
                          <option value="">Select a token</option>
                          {tokens.map((token) => (
                            <option key={token.address} value={token.address} className={styles["token-option"]}>
                              {token.name}
                            </option>
                          ))}
                        </select>
                        <input 
                          type="number" 
                          value={paymentValue}
                          onChange={(e) => handlePaymentValueChange(e)}
                        />
                        <button onClick={() => handleMakePayment(agreement.id, agreement.payment.amount, agreement.totalPaid)} className={styles["confirm-btn"]}>
                          Confirm
                        </button>
                      </div>
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
