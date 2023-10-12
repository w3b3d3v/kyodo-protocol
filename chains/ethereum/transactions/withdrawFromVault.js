import { ethers } from "ethers";

export const withdrawFromVault = async (details) => {
    const redeemAmountInWei = ethers.utils.parseUnits(details.amount.toString(), details.balance.tokenDecimals)

    if (redeemAmountInWei.gt(details.balance.amount)) {
      alert("You cannot redeem more than your balance!")
      setRedeemValue("")
    }
    
    try {
      const tx = await details.contract.withdraw(
        redeemAmountInWei,
        process.env.NEXT_PUBLIC_FAKE_STABLE_ADDRESS // TODO: Make user select the token desired to withdraw
      )
      await tx.wait()
      return tx
    } catch (error) {
        throw new Error("Error in withdrawFromVault: ", error);
    }
};
    
export default withdrawFromVault;