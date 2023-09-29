import { useState, useCallback } from 'react';
import { useAccount } from "../contexts/AccountContext"
import { ethers } from 'ethers';

function useTransactionHandler() {
  const [isLoading, setIsLoading] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);
  const [transactionFail, setTransactionFail] = useState(false);
  const [transactionHash, setTransactionHash] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { account } = useAccount()

  const sendTransaction = useCallback(async (transactionFunction, contract, eventName, onConfirmation) => {
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

        const txResponse = await Promise.race([transactionFunction(), timeoutPromise]);
        console.log("Transaction Sent:", txResponse);

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
            console.log(`${eventName} Received:`, eventArgs);
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