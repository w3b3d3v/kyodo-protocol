import { useState, useCallback } from 'react'
import { useAccount } from "../contexts/AccountContext"
import transactionManager from '../chains/transactionManager'

function useTransactionHandler() {
  const [isLoading, setIsLoading] = useState(false)
  const [transactionSuccess, setTransactionSuccess] = useState(false)
  const [transactionPending, setTransactionPending] = useState(false)
  const [transactionFail, setTransactionFail] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { account, selectedChain} = useAccount()

  const sendTransaction = useCallback(async (functionName, details, eventName, onConfirmation) => {
    setIsLoading(true);
    setTransactionFail(false);
    setTransactionPending(false);
    setTransactionSuccess(false);

    try {
        const TRANSACTION_TIMEOUT = 30000;
        
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Transaction timed out')), TRANSACTION_TIMEOUT);
        });

        const txResponse = await Promise.race([
          transactionManager[functionName](selectedChain, details),
          timeoutPromise
        ]);

        setTransactionHash(txResponse)

        const response = await transactionManager.handleTransactionPromise
        (
          selectedChain,
          details.contract,
          txResponse,
          eventName,
          account
        )

        if (response){
          setTransactionSuccess(true);
          setTransactionPending(false);
          onConfirmation();
        }
    } catch (error) {
        setErrorMessage(error.message)
        console.error("Error:", error.message)
        if (transactionHash) {
          if (error.message.includes(`Timeout waiting for ${eventName} event`)) {
            setTransactionFail(false)
            setTransactionPending(true)
          } else {
            setTransactionFail(true)
          }
        } else {
          setIsLoading(false)
          setTransactionFail(true)
        }
    }
  }, [])

  return {
    isLoading,
    setIsLoading,
    transactionSuccess,
    transactionPending,
    transactionFail,
    errorMessage,
    sendTransaction,
    transactionHash
  }
}

export default useTransactionHandler