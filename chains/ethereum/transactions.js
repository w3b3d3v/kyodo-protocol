// src/chains/ethereum/transactions.js
import { ethers } from "ethers"

export const addAgreement = async ({ title, description, professional, skills, paymentAmount, contract }) => {
  const paymentAmountInWei = ethers.utils.parseUnits(paymentAmount.toString(), 18);

  return contract.createAgreement(
    title,
    description,
    professional,
    skills,
    paymentAmountInWei
  );
};
  
export default addAgreement;