import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
require('dotenv').config({ path: '../../.env.development.local' });

export const payAgreement = async (details) => {
    try {
        const acceptedPaymentTokensPubkey = new PublicKey(process.env.NEXT_PUBLIC_SOL_ACCEPTED_PAYMENT_TOKENS_ADDRESS);
        const feesPubkey = new PublicKey(process.env.NEXT_PUBLIC_SOL_FEES_ADDRESS);
        const associatedTokenAddressCompany = new PublicKey(process.env.NEXT_PUBLIC_SOL_ASSOCIATED_TOKEN_ADDRESS_COMPANY);
        const associatedTokenAddressCommunity = new PublicKey(process.env.NEXT_PUBLIC_SOL_ASSOCIATED_TOKEN_ADDRESS_COMMUNITY);
        const associatedTokenAddressTreasury = new PublicKey(process.env.NEXT_PUBLIC_SOL_ASSOCIATED_TOKEN_ADDRESS_TREASURY);
        
        const selectedPaymentTokenPubkey = new PublicKey(details.selectedPaymentToken.address)

        const professionalPubkey = new PublicKey(details.agreement.professional)
        const companyPubkey = new PublicKey(details.account)

        const [professionalVaultPublicKey, ___] =
        anchor.web3.PublicKey.findProgramAddressSync(
          [professionalPubkey.toBytes(), selectedPaymentTokenPubkey.toBytes()],
          details.contract.programId
        )

        const stringBufferCompany = Buffer.from("company_agreements", "utf-8")
        const [companyAgreementsPublicKey, _] = anchor.web3.PublicKey.findProgramAddressSync(
            [stringBufferCompany, companyPubkey.toBuffer()],
            details.contract.programId
        )

        const stringBufferProfessional = Buffer.from("professional_agreements", "utf-8")
        const [professionalAgreementsPublicKey, __] = anchor.web3.PublicKey.findProgramAddressSync(
          [stringBufferProfessional, professionalPubkey.toBytes()],
          details.contract.programId
        )

        const amountInLamports = new anchor.BN(details.paymentValue * Math.pow(10, details.selectedPaymentToken.decimals))

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
        .rpc()
        console.log("tx", tx)
        return tx
    } catch (error) {
        console.error("Error in payAgreement:", error);
        throw error;
    }
};
    
export default payAgreement;