import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { 
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";

function lamportsToSol(lamports) {
  return new BN(Math.round(lamports * Math.pow(10, 8)));
}

export const withdrawFromVault = async (details) => {
  const amountInLamports = lamportsToSol(details.amount)
  const balanceInLamports = lamportsToSol(details.balance.amount)
  
  if (amountInLamports.gt(balanceInLamports)) {
    alert("You cannot redeem more than your balance!")
    setRedeemValue("")
  }

  const professionalPublicKey = new PublicKey(details.account)

  //TODO: Make this token come from withdraw tokens list
  const fakeStablePubkey = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_FAKE_STABLE_ADDRESS)

  const associatedTokenAddressProfessional = await getOrCreateAssociatedTokenAccount(
    details.contract.provider.connection,
    professionalPublicKey,
    fakeStablePubkey,
    professionalPublicKey,
    false,
    null, null,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const [professionalVaultPublicKey, ___] =
  anchor.web3.PublicKey.findProgramAddressSync(
    [professionalPublicKey.toBytes(), fakeStablePubkey.toBytes()],
    details.contract.programId
  );

  const stringBufferProfessional = Buffer.from("professional_agreements", "utf-8");
  const [professionalAgreementsPublicKey, __] = anchor.web3.PublicKey.findProgramAddressSync(
    [stringBufferProfessional, professionalPublicKey.toBuffer()],
    details.contract.programId
  );
    
  try {
    const tx = await details.contract.methods
    .withdraw(amountInLamports)
    .accounts({
      professional: professionalPublicKey,
      professionalAta: associatedTokenAddressProfessional.address,
      vaultAta: professionalVaultPublicKey,
      professionalAgreements: professionalAgreementsPublicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    }).rpc();

    console.log("Your transaction signature:", tx);
    return tx;
  } catch (error) {
    console.log(error)
    throw new Error("Error in withdrawFromVault: ", error);
  }
};
    
export default withdrawFromVault;