import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export const addAgreement = async (details) => {
  const companyAccount = details.publicKey
  const professionalPubkey = new PublicKey(details.professional)
  
  const agreementData = {
    title: details.title,
    description: details.description,
    skills: details.skills,
    paymentAmount: new anchor.BN(details.paymentAmount),
    professional: professionalPubkey,
    company: companyAccount,
  }

  const stringBuffer = Buffer.from("company_agreements", "utf-8");
  const [companyAgreementsPublicKey, _] = anchor.web3.PublicKey.findProgramAddressSync(
    [stringBuffer, companyAccount.toBuffer()],
    details.contract.programId
  );

  const stringProfessionalBuffer = Buffer.from("professional_agreements", "utf-8");
  const [professionalAgreementsPublicKey, __] = anchor.web3.PublicKey.findProgramAddressSync(
    [stringProfessionalBuffer, professionalPubkey.toBuffer()],
    details.contract.programId
  );

  try {
    const agreementAddress = anchor.web3.Keypair.generate();

    const tx = await details.contract.methods
      .initializeAgreement(agreementData)
      .accounts({
          agreement: agreementAddress.publicKey,
          company: companyAccount,
          professional:professionalPubkey,
          professionalAgreements: professionalAgreementsPublicKey,
          companyAgreements: companyAgreementsPublicKey, 
          systemProgram: anchor.web3.SystemProgram.programId,
        }).signers([agreementAddress]).rpc();

    console.log("tx: ", tx);
    return tx;

  } catch (error) {
    console.error("Error initializing agreement:", error);
  }
};
  
export default addAgreement;