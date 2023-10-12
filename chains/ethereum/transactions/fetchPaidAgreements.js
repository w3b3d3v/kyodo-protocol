export const fetchPaidAgreements = async (details) => {
    try {
        const companyFilter = details.contract.filters.PaymentMade(details.account, null);
        const professionalFilter = details.contract.filters.PaymentMade(null, details.account);
    
        const companyAgreements = await details.contract.queryFilter(companyFilter);
        const professionalAgreements = await details.contract.queryFilter(professionalFilter);
    
        const allAgreements = [...companyAgreements, ...professionalAgreements];
    
        const agreements = allAgreements.map(event => ({
        ...event.args,
        transactionHash: event.transactionHash
        }));

        return agreements
      } catch (error) {
        // TODO: Move implementation to promiseHandler hook
      }
};
  
  
  export default fetchPaidAgreements;