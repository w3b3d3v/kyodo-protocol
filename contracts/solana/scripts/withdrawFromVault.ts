import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";
import * as dotenv from "dotenv";
import path from "path";
import fs from 'fs';
import bs58 from 'bs58';
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { 
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
dotenv.config({ path: path.resolve(__dirname, '../../../.env.development.local') });

const provider = anchor.AnchorProvider.local("http://127.0.0.1:8899");
anchor.setProvider(provider);
const program = anchor.workspace.AgreementProgram;

async function withdrawFromVault(professionalKeypair, fakeStableAddress) {
    const payer = (provider.wallet as NodeWallet).payer;
    const amountToWithdraw= new anchor.BN(1000)

    const stringBufferProfessional = Buffer.from("professional_agreements", "utf-8");

    const [professionalAgreementsPublicKey, __] = anchor.web3.PublicKey.findProgramAddressSync(
      [stringBufferProfessional, professionalKeypair.publicKey.toBuffer()],
      program.programId
    );

    const [professionalVaultPublicKey, ___] =
    anchor.web3.PublicKey.findProgramAddressSync(
      [professionalKeypair.publicKey.toBytes(), fakeStableAddress.toBytes()],
      program.programId
    );

    const associatedTokenAddressProfessional = await getOrCreateNeededAssociatedTokenAccount(
      payer,
      fakeStableAddress,
      professionalKeypair.publicKey
    );

    const tx = await program.methods.withdraw(amountToWithdraw)
    .accounts({
      professional: professionalKeypair.publicKey,
      professionalAta: associatedTokenAddressProfessional.address,
      vaultAta: professionalVaultPublicKey,
      professionalAgreements: professionalAgreementsPublicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    }).signers([professionalKeypair]).rpc();

    console.log("Your transaction signature:", tx);
    return tx;
}

async function main(){
    const fakeStableAddress = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_FAKE_STABLE_ADDRESS);
    const professionalPrivateKey = process.env.SOL_PROFESSIONAL_PRIVATE_KEY;

    const professionalKeypair = anchor.web3.Keypair.fromSecretKey(bs58.decode(professionalPrivateKey));

    const withdraw = await withdrawFromVault(professionalKeypair, fakeStableAddress);

    console.log(withdraw);
}

main()

async function getOrCreateNeededAssociatedTokenAccount(payer, tokenAddress, owner) {
  return await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      tokenAddress,
      owner,
      false,
      null, null,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
  );
};
