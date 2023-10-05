import addAgreement from "./transactions/addAgreement";

async function handleTransactionPromise(txResponse) {
    console.log("txResponse: ", txResponse)
}

const transactions = { handleTransactionPromise, addAgreement}
export default transactions