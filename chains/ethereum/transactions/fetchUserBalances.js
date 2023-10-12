import ERC20Token from '../../../utils/ERC20Token';

export const fetchUserBalances = async (details) => {
    try {
        // TODO: Make tokens come from accpeted tokens list
        const tokenAddresses = [process.env.NEXT_PUBLIC_STABLE_VAULT_ADDRESS]
        const balances = []
    
        for (let address of tokenAddresses) {
          try {
            const tokenContract = new ERC20Token(address)
            const balance = await tokenContract.balanceOf(details.account)
            const decimals = await tokenContract.decimals()
    
            if (balance > 0) {
              balances.push({
                tokenAddress: address,
                tokenDecimals: decimals,
                amount: balance,
              })
            }
          } catch (error) {
            console.error(`Error when retrieving balance for ${address}:`, error)
          }
        }
        return balances
    } catch (error) {
      console.error("Error when fetching balances:", error);
    }
  };
  
  
  export default fetchUserBalances;