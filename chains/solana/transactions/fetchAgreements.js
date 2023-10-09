import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

function transformAgreementData(agreement) {
  return {
      title: agreement.title,
      description: agreement.description,
      status: agreement.status,
      professional: agreement.professional?.toString(),
      company: agreement.company?.toString(),
      skills: agreement.skills,
      payment: {"amount": agreement.paymentAmount?.toString()},
      totalPaid: agreement.totalPaid?.toString()
  };
}


export const fetchAgreements = async (details) => {
  const company = new PublicKey(details.account)
  const program = details.contract

  try {
      const stringBuffer = Buffer.from("company_agreements", "utf-8");

      const [companyAgreementsPublicKey, _] = anchor.web3.PublicKey.findProgramAddressSync(
          [stringBuffer, company.toBuffer()],
          program.programId
      );

      const fetchedCompanyAgreements = await program.account.companyAgreements.fetch(
          companyAgreementsPublicKey
      );
      
      if (!fetchedCompanyAgreements.agreements || fetchedCompanyAgreements.agreements.length === 0) return null;

      const fetchedAgreements = await Promise.all(
          fetchedCompanyAgreements.agreements.map(async (agreementAddress) => {
              const agreement = await program.account.agreementAccount.fetch(agreementAddress);
              return transformAgreementData(agreement);
          })
      );

      return fetchedAgreements;

  } catch (error) {
      console.error("Error when fetching agreements:", error);
  }
}

export default fetchAgreements;