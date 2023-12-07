import { ethers } from "ethers";

import KyodoGraph from "../graphs";

export const fetchPaidAgreements = async (details) => {
  try {
    const allAgreements = await KyodoGraph.fetchPaidAgreements(
      details.chainId,
      details.account
    );
    
    const agreements = allAgreements.map((event) => {
      let formattedAmount = ethers.utils.formatUnits(event.amount, 18); //TODO: get the correct amount of decimals based on the token
      return {
        ...event,
        amount: formattedAmount,
        transactionHash: event.transactionHash
      };
    });

    return agreements;
  } catch (error) {
    console.log("error: ", error);
    throw new Error("Error in fetching agreements: ", error);
  }
};

export default fetchPaidAgreements;
