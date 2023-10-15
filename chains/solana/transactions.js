import addAgreement from "./transactions/addAgreement";
import fetchAgreements from "./transactions/fetchAgreements";
import payAgreement from "./transactions/payAgreement";
import fetchUserBalances from "./transactions/fetchUserBalances";
import fetchPaidAgreements from "./transactions/fetchPaidAgreements";
import withdrawFromVault from "./transactions/withdrawFromVault";

async function handleTransactionPromise(contract, txResponse) {
    const EVENT_TIMEOUT = 30000;  // 30 seconds timeout
    const RETRY_INTERVAL = 1000;  // 1 second retry interval

    const checkTransaction = async () => {
        const result = await contract.provider.connection.getTransaction(txResponse, {
            commitment: 'confirmed',
        });
        
        if (result && !result.meta?.err) {
            return true;
        }

        return false;  // Return false instead of throwing an error
    };

    const startTime = Date.now();
    
    while (Date.now() - startTime < EVENT_TIMEOUT) {
        const success = await checkTransaction();
        if (success) {
            return true;
        }

        // Wait for the retry interval before trying again
        await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
    }

    throw new Error('Transaction failed on Solana');  // Throw an error if the timeout is reached without success
}


const transactions = { handleTransactionPromise, 
    addAgreement, 
    fetchAgreements, 
    payAgreement,
    fetchUserBalances,
    fetchPaidAgreements,
    withdrawFromVault
}
export default transactions