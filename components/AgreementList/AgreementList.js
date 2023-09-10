import React, { useState, useEffect } from 'react';
import { BeatLoader } from "react-spinners";
import { ethers } from "ethers";
import tokens from "../../public/allowedTokens.json"
import ERC20 from '../../contexts/contracts/ERC20.json';
import styles from "./AgreementList.module.css"
import BigNumber from 'bignumber.js';
import { useAccount } from "../../contexts/AccountContext"
import { useAgreementContract } from "../../contexts/ContractContext"
import "./AgreementList.module.css"

// TODO: Handle Promise while transaction runs
// TODO: Show correct Total Paid based in a defined currency base
// TODO: Update after transaction

function AgreementList(props) {
  const { account } = useAccount();
  const { contract, loading } = useAgreementContract();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const [agreements, setAgreements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentValue, setPaymentValue] = useState('');
  const [showPaymentInput, setShowPaymentInput] = useState(null);
  const [isAllowanceSufficient, setIsAllowanceSufficient] = useState(false);
  const [userAllowance, setUserAllowance] = useState(null);

  const checkAllowance = async (userAddress, contractAddress, paymentTokenAddress) => {
    const tokenContract = new ethers.Contract(paymentTokenAddress, ERC20.abi, provider);
    const allowance = await tokenContract.allowance(userAddress, contractAddress);
    setUserAllowance(new BigNumber(allowance.toString()))
  };

  const handleApprove = async (amount, paymentToken, spender) => {
    try {
    
      const amountInWei = new BigNumber(amount)
        .times(new BigNumber(10).pow(paymentToken.decimals))
        .toString();

      const TokenContract = new ethers.Contract(paymentToken.address, ERC20.abi, provider.getSigner());
      console.log("TokenContract", paymentToken.address)
      const tx = await TokenContract.approve(spender, amountInWei);
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
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setPaymentValue('');
    } else {
      setPaymentValue(value);
      const paymentAmountInWei = new BigNumber(value)
        .times(new BigNumber(10).pow(paymentToken.decimals))
        .toString();
    
    setIsAllowanceSufficient(userAllowance.isGreaterThanOrEqualTo(paymentAmountInWei));
    }
  };
  
  const handleMakePayment = async (agreementId, totalAmount, totalPaid, paymentToken) => {      
    const paymentAmountInWei = new BigNumber(paymentValue)
              .times(new BigNumber(10).pow(paymentToken.decimals))
              .toString();
      

    if (parseInt(paymentAmountInWei) <= 0 || parseInt(paymentAmountInWei) > parseInt(totalAmount) || (parseInt(paymentAmountInWei) + parseInt(totalPaid) > parseInt(totalAmount))) {
      alert('Invalid payment amount.');
      return;
    }
    try {
      if (window.ethereum) {
        const tx = await contract.makePayment(
          agreementId, 
          paymentAmountInWei
        );

      } else {
        console.error('Provedor Ethereum não encontrado!');
      }
    } catch (error) {
      console.error('Erro ao fazer pagamento', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
      async function fetchAgreements() {
        try {
          if (window.ethereum) {
            const userAgreementIds = await contract.getUserAgreements(window.ethereum.selectedAddress);
            const stringIds = userAgreementIds.map(id => id.toString());

            const fetchedAgreements = await Promise.all(stringIds.map(async (agreementId) => {
              const agreement = await contract.getAgreementById(agreementId);
              return agreement;
            }));
            
            setAgreements(fetchedAgreements);
          } else {
            console.error('Provedor Ethereum não encontrado!');
          }
        } catch (error) {
          console.error('Erro ao buscar acordos:', error);
        } finally {
          setIsLoading(false);
        }
      }
  
      fetchAgreements();
  }, [account]);    

  if (isLoading) {
    return (
      <div className={styles["loading-overlay"]}>
        <div className={styles["sweet-loading"]}>
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
          const adjustedPaymentAmount = paymentToken

          ? String(BigInt(agreement.payment.amount) / BigInt(10 ** paymentToken.decimals))
          : String(BigInt(agreement.payment.amount));

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
              <p><strong>Payment amount</strong> {adjustedPaymentAmount}</p>
              <p><strong>Payment token</strong> {paymentTokenName}</p> {/* Display token name */}

              {Number(agreement.status) !== 1 && <p><strong>Total paid</strong> {agreement.totalPaid.toString()}</p>}
              
              <div className={styles["card-footer"]}>
                {Number(agreement.status) === 0 ? 
                  <>
                    <a onClick={() => handlePayClick(index)}>Pay agreement</a>
                    {showPaymentInput === index && (
                      <>
                        <input 
                          type="number" 
                          value={paymentValue}
                          onChange={(e) => handlePaymentValueChange(e, paymentToken)}
                        />
                    {isAllowanceSufficient ? (
                      <button onClick={() => handleMakePayment(agreement.id, agreement.payment.amount, agreement.totalPaid, paymentToken)} className={styles["confirm-btn"]}>
                        Confirm Payment
                      </button>
                    ) : (
                      <button onClick={() => handleApprove(paymentValue, paymentToken, contract.address)} className={styles["approve-btn"]}>
                        Approve
                      </button>
                    )}
                      </>
                    )}
                  </> : 
                  (Number(agreement.status) === 1 ? ' Completed' : agreement.status)
                }
              </div>

            </div>
          );
        })}
      </div>
    </div>
  ); 
}

export default AgreementList;
