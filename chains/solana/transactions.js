import addAgreement from "./transactions/addAgreement";
import fetchAgreements from "./transactions/fetchAgreements";

async function handleTransactionPromise(contract, txResponse) {
    const EVENT_TIMEOUT = 20000;  // 20 seconds timeout
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


const transactions = { handleTransactionPromise, addAgreement, fetchAgreements}
export default transactions