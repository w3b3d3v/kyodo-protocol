import { ethers } from "ethers";

function weiToEther(weiValue) {
  const ether = ethers.utils.formatEther(weiValue);
  return Math.round(ether).toString();
}

function transformAgreementData(agreement) {
  // console.log("agreement data", agreement)
  // console.log("agreement", agreement.id.toString())
  // console.log("title",agreement.title)
  // console.log("description",agreement.description)
  // console.log("professional",agreement.professional)
  // console.log("skills",agreement.skills)
  // console.log("payment",agreement.payment.toString())
  // console.log("totalPaid",agreement.totalPaid)

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