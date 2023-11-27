export const saveUserInfo = async (details) => {
  console.log("details", details)
  try {
    const tx = await details.contract.storeUserInfo(
      details.name,
      details.taxDocument
    );

    return tx;
  } catch (error) {
    console.log("Error in saveUserInfo:", error);
    throw error;
  }
};

export default saveUserInfo;
