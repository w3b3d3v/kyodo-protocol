import { PublicKey } from "@solana/web3.js";

export const fetchUserBalances = async (details) => {
  const tokenAddresses = [process.env.NEXT_PUBLIC_SOLANA_FAKE_STABLE_ADDRESS]
  const balances = [];

  for (let address of tokenAddresses) {
    try {
        const tokenAccountInfo = await details.connection.getParsedTokenAccountsByOwner(
            new PublicKey(details.account),  
            { mint: new PublicKey(address) }
        );
    
        if (!tokenAccountInfo.value.length) {
            continue;
        }

        const accountInfo = tokenAccountInfo.value[0].account.data.parsed.info; //Assuming the user has just one tokenAccount for that specific token
        balances.push({
            tokenAddress: address,
            tokenDecimals: accountInfo.tokenAmount.decimals,
            amount: accountInfo.tokenAmount.uiAmountString,
        });

        return balances
    } catch (error) {
        console.error(`Error when retrieving balance for ${address}:`, error);
    }
  }
  return balances;
};

export default fetchUserBalances;
