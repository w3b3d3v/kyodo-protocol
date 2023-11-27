import addAgreement from "./transactions/addAgreement";
import fetchAgreements from "./transactions/fetchAgreements";
import payAgreement from "./transactions/payAgreement";
import fetchUserBalances from "./transactions/fetchUserBalances";
import withdrawFromVault from "./transactions/withdrawFromVault";
import fetchPaidAgreements from "./transactions/fetchPaidAgreements";
import saveUserInfo from "./transactions/saveUserInfo";
import fetchUserInfo from "./transactions/fetchUserInfo";

const EVENT_TIMEOUT = 60000;

async function handleTransactionPromise(contract, txResponse, eventName, account) {
    // TODO: Make event filters more robust based on parameters
    const eventReceived = new Promise((resolve, reject) => {
        const timeout = setTimeout(async () => {
            const tx = await contract.provider.getTransaction(txResponse.hash);
            if (tx && tx.blockNumber) {
                resolve({ event: tx });
            } else {
                reject(new Error(`Timeout waiting for ${eventName} event`));
            }
        }, EVENT_TIMEOUT);

        const filter = contract.filters[eventName]();

        contract.on(filter, (...args) => {
            clearTimeout(timeout);
            resolve(args);
        });
    });

    const eventArgs = await eventReceived;
    return eventArgs;
}

const transactions = { 
    handleTransactionPromise, 
    addAgreement,
    fetchAgreements,
    payAgreement,
    fetchUserBalances,
    withdrawFromVault,
    fetchPaidAgreements,
    saveUserInfo,
    fetchUserInfo
}
export default transactions