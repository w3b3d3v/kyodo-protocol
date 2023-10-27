import { ethers } from "ethers";
import ERC20Token from '../../../utils/ERC20Token';

export const fetchUserBalances = async (details) => {
  // TODO: Make tokens come from accpeted tokens list
  const tokenAddresses = [details.contract.address] //Vault Token Address
  const balances = []

  for (let address of tokenAddresses) {
    try {
      const tokenContract = new ERC20Token(address)
      const rawBalance = await tokenContract.balanceOf(details.account)
      const decimals = await tokenContract.decimals()

      const formattedBalance = ethers.utils.formatUnits(rawBalance, decimals)

      balances.push({
        tokenAddress: address,
        tokenDecimals: decimals,
        amount: formattedBalance,
      })
    } catch (error) {
      console.error(`Error when retrieving balance for ${address}:`, error)
    }
  }

  try {
    const sparkBalance = await details.contract.getSparkBalance(
      process.env.NEXT_PUBLIC_FAKE_STABLE_ADDRESS
    )
    const formattedBalance = ethers.utils.formatUnits(sparkBalance, 18)
    console.log("Spark total balance: " + formattedBalance)
  } catch (e) {
    console.log("failed to get spark balance")
    console.log(e)
  }

  return balances
};
  
  
  export default fetchUserBalances;