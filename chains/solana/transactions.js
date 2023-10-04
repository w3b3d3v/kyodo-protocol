import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Transaction } from "@solana/web3.js";
import idl from "./agreement_program.json";
import {Connection } from "@solana/web3.js";

// TODO Fix: Boesn't work when remove the console.log? what?

export const addAgreement = async (c, details) => {

  const companyAccount = details.publicKey //TODO: Maybe this can be mounted with new PublicKey
  if (!window.solana.isConnected) {
    window.solana.connect();
  }

  console.log()
  const connection = new Connection("https://api.devnet.solana.com");
  const provider = new anchor.AnchorProvider(
    connection,
    details.wallet.adapter,
    anchor.AnchorProvider.defaultOptions(),
  );

  anchor.setProvider(provider);
  const programAddress = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_AGREEMENT_CONTRACT_ADDRESS);
  const contract = new anchor.Program(idl, programAddress, provider);

  const agreementData = {
    title: details.title,
    description: details.description,
    skills: details.skills,
    professional: companyAccount, //TODO: (companyAccount for test) Check if the string address is accepted or is needed a pubkey
    company: companyAccount, //TODO: get the account of the company connected
  }

  const stringBuffer = Buffer.from("company_agreements", "utf-8");

  console.log("contract", contract) 
  const [companyAgreementsPublicKey, _] = anchor.web3.PublicKey.findProgramAddressSync(
    [stringBuffer, companyAccount.toBuffer()],
    contract.programId
  );
  

  try {
    const agreementAddress = anchor.web3.Keypair.generate();

    const tx = await contract.methods
      .initializeAgreement(agreementData).accounts({
          agreement: agreementAddress.publicKey,
          company: companyAccount,
          companyAgreements: companyAgreementsPublicKey, 
          systemProgram: anchor.web3.SystemProgram.programId,
        }).signers([agreementAddress]).rpc();

    console.log("tx", tx);

  } catch (error) {
    console.error("Error initializing agreement:", error);
  } finally {
    return tx
  }
};
  
export default addAgreement;