export const savePreferedChain = async (details) => {
  console.log("details", details)
  try {
    const tx = await details.contract.setPreferredChain(
      details.paymentsChain.value.toString()
    );

    return tx;
  } catch (error) {
    console.log("Error in savePreferedChain:", error);
    throw error;
  }
};

export default savePreferedChain;
