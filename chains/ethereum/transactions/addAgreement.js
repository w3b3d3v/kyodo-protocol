import { ethers } from "ethers"

export const addAgreement = async (details) => {
  const paymentAmountInWei = ethers.utils.parseUnits(details.paymentAmount.toString(), 18);

  return details.contract.createAgreement(
    details.title,
    details.description,
    details.professional,
    details.skills,
    paymentAmountInWei
  );
};
  
export default addAgreement;