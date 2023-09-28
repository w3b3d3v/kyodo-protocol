import * as anchor from "@coral-xyz/anchor";
import * as dotenv from "dotenv";
import path from "path";
import { Program } from "@coral-xyz/anchor";
import fs from "fs";

// Load environment variables from .env.development.local
dotenv.config({ path: path.resolve(__dirname, '../../../.env.development.local') });

// Get the Program ID from the environment variable
const programIdString = process.env.NEXT_PUBLIC_SOLANA_AGREEMENT_CONTRACT_ADDRESS;
if (!programIdString) {
  throw new Error("Program ID is not defined in the environment variables");
}

// Convert the Program ID string to a PublicKey
const programId = new anchor.web3.PublicKey(programIdString);

// Configure the client to use the local cluster
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

// Load the IDL from the file
const idlPath = path.resolve(__dirname, "../target/idl/agreement_program.json");
const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));

// Instantiate the program using the Program ID and IDL
const program = new Program(idl, programId, provider);

// Define the company and professional addresses
const companyAddress = provider.wallet.publicKey;
const professionalAddress = anchor.web3.Keypair.generate();

// Define the agreement details
const agreementDetails = {
  title: "Test Agreement",
  description: "Description of the test agreement",
  // ... other agreement details ...
};

async function createAgreement() {
  // Logic to create an agreement using the `program` instance
  // ...

  console.log("Agreement created successfully");
}

// Run the function to create an agreement
createAgreement().catch(err => console.error(err));
