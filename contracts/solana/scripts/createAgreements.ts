import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, '../../../.env.development.local') });

async function createAgreement() {
  try {
    // Define the URL of your local Solana cluster. Make sure the cluster is running.
    const localClusterUrl = "http://localhost:8899";
    const connection = new anchor.web3.Connection(localClusterUrl, "confirmed");

    // Configure the client to use the local Solana cluster.
    const provider = anchor.AnchorProvider.local("http://localhost:8899");
    anchor.setProvider(provider);

    // Load the agreement program from the workspace.
    const program = anchor.workspace.AgreementProgram;

    // Fetch the public key of the company from the provider's wallet.
    const companyAddress = provider.wallet.publicKey;

    // Generate a new keypair for the professional's address.
    const professionalAddress = anchor.web3.Keypair.generate();

    // Converting the string "company_agreements" to a buffer to be used for PDA calculations.
    const stringBuffer = Buffer.from("company_agreements", "utf-8");

    // Generating a new keypair for the agreement's address.
    const agreementAddress = anchor.web3.Keypair.generate();

    // Finding the Program Derived Address (PDA) for company agreements using the buffer and company address.
    const [companyAgreementsPublicKey, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [stringBuffer, companyAddress.toBuffer()],
      program.programId
    );

    // Defining the agreement details.
    const amount = new anchor.BN(1000);
    const agreement = {
      title: "Agreement de teste 1",
      description: "This is a test agreement",
      payment_amount: amount,
      professional: professionalAddress.publicKey,
      company: companyAddress,
      accepted_payment_token: PublicKey.default, // Replace with the token's public key
      total_paid: new anchor.BN(0),
      status: 0,
    } as any;

    // Initialize the agreement on-chain.
    const tx = await program.methods.initializeAgreement(agreement, {
      accounts: {
        agreement: agreementAddress.publicKey,
        company: companyAddress,
        companyAgreements: companyAgreementsPublicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [agreementAddress],
    });

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
