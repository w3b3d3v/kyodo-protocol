import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getAccount,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import bs58 from 'bs58';

function lamportsToSol(lamports) {
  return new BN(Math.round(lamports * Math.pow(10, 8)));
}

export const withdrawFromVault = async (details) => {
  const amountInLamports = lamportsToSol(details.amount)
  const balanceInLamports = lamportsToSol(details.balance.amount)

  if (amountInLamports.gt(balanceInLamports)) {
    // alert("You cannot redeem more than your balance!")
    throw new Error("You cannot redeem more than your balance!");
    return
  }

  const professionalPublicKey = new PublicKey(details.account)

  //TODO: Make this token come from withdraw tokens list
  const fakeStablePubkey = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_FAKE_STABLE_ADDRESS)
  const connection = details.contract.provider.connection

  let associatedTokenAddressProfessional = await getAssociatedTokenAddress(
    fakeStablePubkey,
    professionalPublicKey,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  let account;
  let transaction = new anchor.web3.Transaction()
  try {
    account = await getAccount(connection, associatedTokenAddressProfessional, "confirmed", TOKEN_PROGRAM_ID);
  }
  catch (error) {
    try {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          professionalPublicKey,
          associatedTokenAddressProfessional,
          professionalPublicKey,
          fakeStablePubkey,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );

    } catch (error) {
      console.log(error);
    }
  }
  
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
  const instructionWithdraw = await details.contract.methods
    .withdraw(amountInLamports)
    .accounts({
      professional: professionalPublicKey,
      professionalAta: associatedTokenAddressProfessional,
      vaultAta: professionalVaultPublicKey,
      professionalAgreements: professionalAgreementsPublicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    }).instruction();

  transaction.add(instructionWithdraw);

  const latestBlockhash = await connection.getLatestBlockhash();
  transaction.feePayer = professionalPublicKey;
  transaction.recentBlockhash = latestBlockhash.blockhash;

  const tx = await details.contract.provider.wallet.signTransaction(transaction);
  await connection.sendRawTransaction(tx.serialize());

  const decodedSignature = bs58.encode(tx.signature);
  console.log("Your transaction signature:", decodedSignature);

  return decodedSignature;
} catch (error) {
  console.log(error)
  throw new Error("Error in withdrawFromVault: ", error);
}
};

export default withdrawFromVault;