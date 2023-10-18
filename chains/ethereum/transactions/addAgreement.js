import { ethers } from "ethers"

export const addAgreement = async (details) => {
  try {
    const paymentAmountInWei = ethers.utils.parseUnits(details.paymentAmount.toString(), 18);

    const tx = await details.contract.createAgreement(
      details.title,
      details.description,
      details.professional,
      details.skills,
      paymentAmountInWei
    );

    return tx;
  } catch (error) {
      console.error("Error in addAgreement:", error);
      throw error;
  }
};
  
export default addAgreement;