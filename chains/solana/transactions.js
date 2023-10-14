import addAgreement from "./transactions/addAgreement";
import fetchAgreements from "./transactions/fetchAgreements";
import payAgreement from "./transactions/payAgreement";
import fetchUserBalances from "./transactions/fetchUserBalances";
import fetchPaidAgreements from "./transactions/fetchPaidAgreements";
import withdrawFromVault from "./transactions/withdrawFromVault";

async function handleTransactionPromise(contract, txResponse) {
    const EVENT_TIMEOUT = 30000;  // 30 seconds timeout
    const checkTransaction = async () => {
        const result = await contract.provider.connection.getTransaction(txResponse, {
            commitment: 'confirmed',
        });
        
        if (!result || result.meta?.err) {
            throw new Error('Transaction failed on Solana');
        }

        return true;
    };

    const timeoutPromise = new Promise((_, reject) => {
        const id = setTimeout(() => {
            clearTimeout(id);
            reject(new Error(`Timeout waiting for transaction confirmation`));
        }, EVENT_TIMEOUT);
    });

    const result = await Promise.race([checkTransaction(), timeoutPromise]);

    return result;
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