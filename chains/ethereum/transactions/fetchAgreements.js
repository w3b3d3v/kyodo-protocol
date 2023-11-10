import { ethers } from "ethers";

function transformAgreementData(agreement, skills) {
  const skillNames = skills.map(skill => skill.name);

  return {
      id: agreement.id, 
      title: agreement.title,
      description: agreement.description,
      professional: agreement.professional?.toString(),
      company: agreement.company?.toString(),
      skills: skillNames,
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
        const agreementSkills = await details.contract.getSkillsByAgreementId(agreementId);
        const transformedAgreement = transformAgreementData(agreement, agreementSkills);
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