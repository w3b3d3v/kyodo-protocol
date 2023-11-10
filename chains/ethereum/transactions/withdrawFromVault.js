import { ethers } from "ethers";
import ERC20Token from '../utils/ERC20Token';

const handleWithdrawal = async (user, amount, asset, account) => {
  if (user.toLowerCase() == account.toLowerCase()) {
    if (!localStorage.getItem(asset)) {
      const tokenContract = new ERC20Token(asset)
      const symbol = await tokenContract.symbol()
      const decimals = await tokenContract.decimals()

      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: asset,
            symbol: symbol,
            decimals: decimals,
          },
        },
      })
      localStorage.setItem(asset, "saved")
      return () => {
        details.contract.off("Withdrawal")
      }
    }
  }
}

export const withdrawFromVault = async (details) => {
    const redeemAmountInWei = ethers.utils.parseUnits(details.amount.toString(), details.balance.tokenDecimals)
    const balanceInWei = ethers.utils.parseUnits(details.balance.amount, details.balance.tokenDecimals)
    if (redeemAmountInWei.gt(balanceInWei)) {
      alert("You cannot redeem more than your balance!")
      setRedeemValue("")
    }
    
    try {
      const tx = await details.contract.withdraw(
        redeemAmountInWei,
        details.KyodoRegistry.getRegistry("FAKE_STABLE") // TODO: Make user select the token desired to withdraw
      )
      
      details.contract.on("Withdrawal", (user, amount, asset) => handleWithdrawal(user, amount, asset, details.account));

      return tx
    } catch (error) {
        throw new Error("Error in withdrawFromVault: ", error);
    }
};
    
export default withdrawFromVault;