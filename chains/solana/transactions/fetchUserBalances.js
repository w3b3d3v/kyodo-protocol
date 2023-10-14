import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

export const fetchUserBalances = async (details) => {
    //TODO: Make these tokens come from accepted payment tokens list
    const tokenAddresses = [process.env.NEXT_PUBLIC_SOLANA_FAKE_STABLE_ADDRESS]
    const balances = [];

    const accountPublicKey = new PublicKey(details.account)

    for (let address of tokenAddresses) {
        try {
            const [professionalVaultPublicKey, ___] =
            anchor.web3.PublicKey.findProgramAddressSync(
                [accountPublicKey.toBytes(), new PublicKey(address).toBytes()],
                details.contract.programId
            );

            const accountBalance = await details.contract.provider.connection.getTokenAccountBalance(professionalVaultPublicKey);

            balances.push({
                amount: accountBalance.value.uiAmountString,
            });

            return balances
        } catch (error) {
            console.error(`Error when retrieving balance for ${address}:`, error);
        }
    }
  return balances;
};

export default fetchUserBalances;
