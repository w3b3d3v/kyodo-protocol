import { useState, useCallback } from 'react';
import { useAccount } from "../contexts/AccountContext"
import transactionManager from '../chains/transactionManager';
import { useAgreementContract } from "../contexts/ContractContext"

function useTransactionHandler() {
  const [isLoading, setIsLoading] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);
  const [transactionFail, setTransactionFail] = useState(false);
  const [transactionHash, setTransactionHash] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { account, selectedChain} = useAccount()
  const { contract } = useAgreementContract()

  const sendTransaction = useCallback(async (functionName, details, eventName, onConfirmation) => {
    setIsLoading(true);
    setTransactionFail(false);
    setTransactionPending(false);
    setTransactionSuccess(false);

    try {
        const TRANSACTION_TIMEOUT = 5000;
        const EVENT_TIMEOUT = 10000;
        
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Transaction timed out')), TRANSACTION_TIMEOUT);
        });

        const txResponse = await Promise.race([
          transactionManager[functionName](selectedChain, contract, details),
          timeoutPromise
        ]);

        if (txResponse && txResponse.hash) {
            setTransactionHash(txResponse.hash);

            const eventReceived = new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error(`Timeout waiting for ${eventName} event`));
                }, EVENT_TIMEOUT);

                const filter = contract.filters[eventName](account);

                contract.on(filter, (...args) => {
                    clearTimeout(timeout);
                    resolve(args);
                });
            });

            const eventArgs = await eventReceived;
            setTransactionSuccess(true);
            setTransactionPending(false);

            if (onConfirmation) onConfirmation(eventArgs);
        } else {
            throw new Error("Transaction hash is not available");
        }
    } catch (error) {
        setErrorMessage(error.message);
        console.error("Error:", error.message);
        if (transactionHash) {
          if (error.message.includes(`Timeout waiting for ${eventName} event`)) {
            setTransactionFail(false);
            setTransactionPending(true);
          } else {
            setTransactionFail(true);
          }
        } else {
          setTransactionFail(true);
        }
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }
  }, []);

  return {
    isLoading,
    transactionSuccess,
    transactionPending,
    transactionFail,
    errorMessage,
    sendTransaction,
  };
}

export default useTransactionHandler;