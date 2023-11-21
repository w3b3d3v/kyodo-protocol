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
      amount: ethers.utils.formatUnits(agreement.paymentAmount, 18),
      totalPaid: ethers.utils.formatUnits(agreement.totalPaid, 18)
  };
}

export const fetchAgreements = async (details) => {
  try {
    const contractorAgreementIds = await details.contract.getContractorAgreements(details.account);
    const professionalAgreementIds = await details.contract.getProfessionalAgreements(details.account);

    const userAgreementIds = Array.from(new Set([...contractorAgreementIds, ...professionalAgreementIds]));

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