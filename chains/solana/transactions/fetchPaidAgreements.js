import * as anchor from "@coral-xyz/anchor";

function lamportsToSol(lamports) {
  return Math.round(lamports.toString() / Math.pow(10, 8)).toString();
}

export const fetchPaidAgreements = async (details) => {
  console.log("fetch paid agreements for solana.")
  const eventsFound = []

  try {

    let sigOptions = anchor.web3.SignaturesForAddressOptions = {before: null, until: null, limit: 20};

    const signatures = await details.contract.provider.connection.getSignaturesForAddress(details.contract.programId, sigOptions, "confirmed");
    const filteredSignatures = [];
    
    for (const { signature } of signatures) {
      const tx = await details.contract.provider.connection.getParsedTransaction(signature, "confirmed");

      if (tx) {
        for (const account of tx.transaction.message.accountKeys) {
          // change companyPubkey to provider wallet pubkey
          if (account.pubkey.toBase58() === details.account) {
            if(signature) {
              filteredSignatures.push(signature);
            }
          }
        }
      }
    }

      const txs = await details.contract.provider.connection.getParsedTransactions(filteredSignatures, {commitment: "confirmed"});
      const eventsParser = new anchor.EventParser(details.contract.programId, new anchor.BorshCoder(details.contract.idl));
      for (const { meta, transaction } of txs) {
        // console.log("event with meta found", meta)
          const events = eventsParser.parseLogs(meta.logMessages);
          // console.log("events: ", events)
          for (const event of events) {
            if(event.name === "PaymentEvent"){
              console.log("Event", txs[0])
              const formattedEvent = {
                agreementId: event.data.agreementId.toString(),
                amount: lamportsToSol(event.data.amount), 
                company: event.data.company.toString(),
                professional: event.data.professional.toString(),
                transactionHash: transaction.signatures[0]
              };
              eventsFound.push(formattedEvent)
              console.log("Formatted Event: ", formattedEvent)
              console.log(event.data);
            }
          }
          
      }
    
      return eventsFound
    
  } catch (error) {
    console.log("error: ", error)
    throw new Error("Error in fetching agreements: ", error);
  }  
};
  
export default fetchPaidAgreements;