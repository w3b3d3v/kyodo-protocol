import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, '../../../.env.development.local') });

async function createAgreement() {
  try {
    // Configure the client to use the local Solana cluster.
    const provider = anchor.AnchorProvider.local("https://api.devnet.solana.com");

    anchor.setProvider(provider);

    // Load the agreement program from the workspace.
    const program = anchor.workspace.AgreementProgram;
    console.log("program", program.programId.toBase58());
    // Fetch the public key of the company from the provider's wallet.
    const companyAddress = provider.wallet.publicKey;

    // Generate a new keypair for the professional's address.
    const professionalAddress = anchor.web3.Keypair.generate();

    // Converting the string "company_agreements" to a buffer to be used for PDA calculations.
    const stringBuffer = Buffer.from("company_agreements", "utf-8");

    // Generating a new keypair for the agreement's address.
    const agreementAddress = anchor.web3.Keypair.generate();

    const communityDaoPubkey = new PublicKey(process.env.SOL_ASSOCIATED_TOKEN_ADDRESS_COMMUNITY);

    // Finding the Program Derived Address (PDA) for company agreements using the buffer and company address.
    const [companyAgreementsPublicKey, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [stringBuffer, companyAddress.toBuffer()],
      program.programId
    );

    const amount = new anchor.BN(1000);
    
    const agreement = {
      title: "test1",
      description: "test1 description",
      skills: ["JavaScript", "Rust", "Solana"], // You can replace these with actual skills
      paymentAmount: amount,
      communityDao: communityDaoPubkey,
      professional: professionalAddress.publicKey, // Replace with the professional's public key
    } as any;

    // Initialize the agreement on-chain.
    const tx = await program.methods
      .initializeAgreement(agreement)
      .accounts({
        agreement: agreementAddress.publicKey,
        company: companyAddress,
        companyAgreements: companyAgreementsPublicKey, // The PDA address, you'll have to compute this based on your program logic
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([agreementAddress])
      .rpc();


    console.log("tx", tx);

    const fetchedAgreement = await program.account.agreementAccount.fetch(
      agreementAddress.publicKey
    );
    console.log("Your agreement account:", fetchedAgreement);

    const fetchedCompanyAgreements = await program.account.companyAgreements.fetch(
      companyAgreementsPublicKey
    );

    console.log("fetchedCompanyAgreements", fetchedCompanyAgreements)

    console.log("Agreement created successfully");
    console.log("Transaction signature:", tx);
  } catch (error) {
    console.error("Error creating agreement:", error);
  }
}
// Call the createAgreement function to create a new agreement.
createAgreement();
