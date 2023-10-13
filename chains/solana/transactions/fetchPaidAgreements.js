import { ethers } from "ethers";

export const fetchPaidAgreements = async (details) => {
  console.log("fetch paid agreements for solana.")
  try {
    
  } catch (error) {
    console.log("error: ", error)
    throw new Error("Error in fetching agreements: ", error);
  }  
};
  
export default fetchPaidAgreements;