import { PublicKey, Keypair } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { 
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getOrCreateAssociatedTokenAccount
} from "@solana/spl-token";
require('dotenv').config({ path: '../../.env.development.local' });

async function getOrCreateAssociatedNecessaryTokenAccount(provider, payer, tokenAddress, owner) {
    console.log("data to createAccount", {
        connection: provider.connection,
        payer: payer.publicKey,
        tokenAddress: tokenAddress.toString(),
        ownerPublicKey: new PublicKey(owner).toString(),
        tokenProgram: TOKEN_PROGRAM_ID.toString(),
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID.toString()
    });
    
    return await getOrCreateAssociatedTokenAccount(
        provider.connection,
        payer,
        tokenAddress,
        new PublicKey(owner),
        false,
        null, null,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
    );
  };

export const payAgreement = async (details) => {
    try {
        const acceptedPaymentTokensPubkey = new PublicKey(process.env.NEXT_PUBLIC_SOL_ACCEPTED_PAYMENT_TOKENS_ADDRESS);
        const feesPubkey = new PublicKey(process.env.NEXT_PUBLIC_SOL_FEES_ADDRESS);
        const associatedTokenAddressCompany = new PublicKey(process.env.NEXT_PUBLIC_SOL_ASSOCIATED_TOKEN_ADDRESS_COMPANY);
        const associatedTokenAddressCommunity = new PublicKey(process.env.NEXT_PUBLIC_SOL_ASSOCIATED_TOKEN_ADDRESS_COMMUNITY);
        const associatedTokenAddressTreasury = new PublicKey(process.env.NEXT_PUBLIC_SOL_ASSOCIATED_TOKEN_ADDRESS_TREASURY);
        
        const selectedPaymentTokenPubkey = new PublicKey(details.selectedPaymentToken.address);

        // Creating or fetching the associated token account for the professional.
        // console.log("details.agreement.professional", details.agreement.professional)
        // const associatedTokenAddressProfessional = await getOrCreateAssociatedNecessaryTokenAccount(
        //     details.contract.provider,              
        //     details.publicKey,                          // payer: Entity funding the transaction.
        //     selectedPaymentTokenPubkey,               // Mint's public key.
        //     details.agreement.professional,      // Owner of the associated token account.
        // );

        // console.log("associatedTokenAddressProfessional", associatedTokenAddressProfessional);

        console.log("Step 1")

        const professionalPubkey = new PublicKey(details.agreement.professional)
        const companyPubkey = new PublicKey(details.account)

        const [professionalVaultPublicKey, ___] =
        anchor.web3.PublicKey.findProgramAddressSync(
          [professionalPubkey.toBytes(), selectedPaymentTokenPubkey.toBytes()],
          details.contract.programId
        );

        console.log("professionalVaultPublicKey", professionalVaultPublicKey)

        const stringBufferCompany = Buffer.from("company_agreements", "utf-8");
        const [companyAgreementsPublicKey, _] = anchor.web3.PublicKey.findProgramAddressSync(
            [stringBufferCompany, companyPubkey.toBuffer()],
            details.contract.programId
        );

        console.log("companyAgreementsPublicKey", companyAgreementsPublicKey)

        const stringBufferProfessional = Buffer.from("professional_agreements", "utf-8");
        const [professionalAgreementsPublicKey, __] = anchor.web3.PublicKey.findProgramAddressSync(
          [stringBufferProfessional, professionalPubkey.toBytes()],
          details.contract.programId
        );

        console.log("professionalAgreementsPublicKey", professionalAgreementsPublicKey)

        const amountInLamports = new anchor.BN(details.paymentValue * Math.pow(10, details.selectedPaymentToken.decimals));

        const tx = await details.contract.methods.processPayment(amountInLamports)
        .accounts({
            company: companyPubkey,
            agreement: details.agreement.publicKey,
            fromAta: associatedTokenAddressCompany,
            communityDaoAta: associatedTokenAddressCommunity,
            treasuryAta: associatedTokenAddressTreasury,
            paymentToken: selectedPaymentTokenPubkey,
            professional: professionalPubkey,
            professionalVault: professionalVaultPublicKey,
            companyAgreements: companyAgreementsPublicKey,
            professionalAgreements: professionalAgreementsPublicKey,
            acceptedPaymentTokens: acceptedPaymentTokensPubkey,
            fees: feesPubkey,
            tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
        console.log("tx", tx)
        return tx;
    } catch (error) {
        console.error("Error in payAgreement:", error);
        throw error;
    }
};
    
export default payAgreement;