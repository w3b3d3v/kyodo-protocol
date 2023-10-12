import { ethers } from "ethers";

export const fetchPaidAgreements = async (details) => {
  try {
    const companyFilter = details.contract.filters.PaymentMade(details.account, null);
    const professionalFilter = details.contract.filters.PaymentMade(null, details.account);
  
    const companyAgreements = await details.contract.queryFilter(companyFilter);
    const professionalAgreements = await details.contract.queryFilter(professionalFilter);
  
    const allAgreements = [...companyAgreements, ...professionalAgreements];
  
    const agreements = allAgreements.map(event => {
      let formattedAmount = ethers.utils.formatUnits(event.args.amount, 18); //TODO: get the correct amount of decimals based on the token
      return {
        ...event.args,
        amount: formattedAmount,
        transactionHash: event.transactionHash
      };
    });
  
    return agreements;
  } catch (error) {
    console.log("error: ", error)
    throw new Error("Error in fetching agreements: ", error);
  }  
};
  
export default fetchPaidAgreements;