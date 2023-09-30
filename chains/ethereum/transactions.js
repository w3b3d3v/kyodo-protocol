// src/chains/ethereum/transactions.js
import { ethers } from "ethers"

export const addAgreement = async (contract, details) => {
  const paymentAmountInWei = ethers.utils.parseUnits(details.paymentAmount.toString(), 18);

  return contract.createAgreement(
    details.title,
    details.description,
    details.professional,
    details.skills,
    paymentAmountInWei
  );
};
  
export default addAgreement;