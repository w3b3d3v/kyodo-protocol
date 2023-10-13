import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";
import * as dotenv from "dotenv";
import path from "path";
import fs from 'fs';
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { 
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getOrCreateAssociatedTokenAccount
} from "@solana/spl-token";
dotenv.config({ path: path.resolve(__dirname, '../../../.env.development.local') });

const provider = anchor.AnchorProvider.local("https://api.devnet.solana.com");
anchor.setProvider(provider);
const program = anchor.workspace.AgreementProgram;

async function readAgreements() {
    const provider = anchor.AnchorProvider.local("https://api.devnet.solana.com");
    anchor.setProvider(provider);

    const program = anchor.workspace.AgreementProgram;
    const companyAddress = provider.wallet.publicKey;

    const stringBuffer = Buffer.from("company_agreements", "utf-8");

    const [companyAgreementsPublicKey, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [stringBuffer, companyAddress.toBuffer()],
      program.programId
    );

    const fetchedCompanyAgreements = await program.account.companyAgreements.fetch(
      companyAgreementsPublicKey
    );

    const agreements = [];

    for (const agreementPublicKey of fetchedCompanyAgreements.agreements) {
        const fetchedAgreement = await program.account.agreementAccount.fetch(agreementPublicKey);
    
        // Criando um objeto que contém os dados e o publicKey
        const agreementWithPubKey = {
            ...fetchedAgreement,  // Spread para incluir todos os campos de fetchedAgreement
            publicKey: agreementPublicKey
        };
    
        agreements.push(agreementWithPubKey);
    }

    return agreements;
}

async function processPayment(agreement, company, acceptedPaymentTokensAddress, feesAddress,) {
    const payer = (provider.wallet as NodeWallet).payer;
    const amountToPay = new anchor.BN(1000 * Math.pow(10, 8))

    const associatedTokenAddressCompany = new PublicKey(process.env.NEXT_PUBLIC_SOL_ASSOCIATED_TOKEN_ADDRESS_COMPANY);
    const associatedTokenAddressCommunity = new PublicKey(process.env.NEXT_PUBLIC_SOL_ASSOCIATED_TOKEN_ADDRESS_COMMUNITY);
    const associatedTokenAddressTreasury = new PublicKey(process.env.NEXT_PUBLIC_SOL_ASSOCIATED_TOKEN_ADDRESS_TREASURY);
    const associatedTokenAddressVault = new PublicKey(process.env.NEXT_PUBLIC_SOL_ASSOCIATED_TOKEN_ADDRESS_VAULT);
    const fakeStableAddress = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_FAKE_STABLE_ADDRESS);
    const vaultAddress = new PublicKey(process.env.NEXT_PUBLIC_SOL_VAULT_ADDRESS);
    const professionalAddress = new PublicKey(process.env.NEXT_SOL_PROFESSIONAL_ADDRESS);
    const stringBufferCompany = Buffer.from("company_agreements", "utf-8");

    const [companyAgreementsPublicKey, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [stringBufferCompany, payer.publicKey.toBuffer()],
      program.programId
    );

    const stringBufferProfessional = Buffer.from("professional_agreements", "utf-8");

    const [professionalAgreementsPublicKey, __] = anchor.web3.PublicKey.findProgramAddressSync(
      [stringBufferProfessional, professionalAddress.toBuffer()],
      program.programId
    );

    const tx = await program.methods.processPayment(fakeStableAddress, amountToPay)
    .accounts({
      company: company,
      agreement: agreement[agreement.length - 1].publicKey,
      vault: vaultAddress,
      fromAta: associatedTokenAddressCompany,
      communityDaoAta: associatedTokenAddressCommunity,
      treasuryAta: associatedTokenAddressTreasury,
      vaultAta: associatedTokenAddressVault,
      companyAgreements: companyAgreementsPublicKey,
      professionalAgreements: professionalAgreementsPublicKey,
      acceptedPaymentTokens: acceptedPaymentTokensAddress,
      fees: feesAddress,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc();

    const fetchedAgreement = await program.account.agreementAccount.fetch(
        agreement[agreement.length - 1].publicKey
    );

    console.log("Your paid agreement account:", fetchedAgreement);
    console.log("Your transaction signature:", tx);
    return true;
}

async function main(){
    const company = provider.wallet.publicKey;
    const acceptedPaymentTokensPubkey = new PublicKey(process.env.SOL_ACCEPTED_PAYMENT_TOKENS_ADDRESS);
    const feesPubkey = new PublicKey(process.env.SOL_FEES_ADDRESS);

    const agreement = await readAgreements()
    // console.log("agreement", agreement)
    
    const processPaymentResult = await processPayment(agreement, company, acceptedPaymentTokensPubkey, feesPubkey)
    console.log("processPaymentResult", processPaymentResult)
}

async function getOrCreateAssociatedTokenAccountKyodo(payer, tokenAddress, owner) {
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

main()
