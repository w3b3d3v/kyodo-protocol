export const fetchUserInfo = async (details) => {
  try {
    const userInfo = await details.contract.getUserInfo(details.userAddress);

    return {
      name: userInfo[0],
      taxDocument: userInfo[1]
    };
  } catch (error) {
    console.log("Error in fetchUserInfo:", error);
    throw error;
  }
};

export default fetchUserInfo;
