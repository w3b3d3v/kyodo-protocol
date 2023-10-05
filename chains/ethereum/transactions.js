import addAgreement from "./transactions/addAgreement";

const EVENT_TIMEOUT = 20000;

async function handleTransactionPromise(contract, txResponse, eventName, account, setTransactionHash) {
    const eventReceived = new Promise((resolve, reject) => {
        const timeout = setTimeout(async () => {
            const tx = await contract.provider.getTransaction(txResponse.hash);
            if (tx && tx.blockNumber) {
                resolve({ event: tx });
                setTransactionHash(tx.hash)
            } else {
                reject(new Error(`Timeout waiting for ${eventName} event`));
            }
        }, EVENT_TIMEOUT);

        let filter;
        if(account) {
            filter = contract.filters[eventName](account);
        } else {
            filter = contract.filters[eventName]();
        }

        contract.on(filter, (...args) => {
            clearTimeout(timeout);
            resolve(args);
        });
    });

    const eventArgs = await eventReceived;
    return eventArgs;
}

const transactions = { handleTransactionPromise, addAgreement}
export default transactions