import { ethers } from "ethers";

function transformAgreementData(agreement) {
  return {
      id: agreement.id, 
      title: agreement.title,
      description: agreement.description,
      professional: agreement.professional?.toString(),
      company: agreement.company?.toString(),
      skills: agreement.skills,
      amount: ethers.utils.formatUnits(agreement.payment.amount, 18),
      totalPaid: ethers.utils.formatUnits(agreement.totalPaid, 18)
  };
}


export const fetchAgreements = async (details) => {
  try {
    const userAgreementIds = await details.contract.getUserAgreements(details.account);
    
    if (userAgreementIds.length === 0) return null;

    const stringIds = userAgreementIds.map((id) => id.toString());

    const fetchedAgreements = await Promise.all(
      stringIds.map(async (agreementId) => {
        const agreement = await details.contract.getAgreementById(agreementId);
        const transformedAgreement = transformAgreementData(agreement);
        return {
            ...transformedAgreement
        };
      })
    );

    return fetchedAgreements;
  } catch (error) {
    console.error("Error when fetching agreements:", error);
  }
};


export default fetchAgreements;