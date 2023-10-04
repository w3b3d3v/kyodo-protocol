import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Transaction } from "@solana/web3.js";
import idl from "./agreement_program.json";
import {Connection } from "@solana/web3.js";

// TODO Fix: Boesn't work when remove the console.log? what?

export const addAgreement = async (c, details) => {
  const amount = new anchor.BN(details.paymentAmount)

  const companyAccount = details.publicKey //TODO: Maybe this can be mounted with new PublicKey
  if (!window.solana.isConnected) {
    window.solana.connect();
  }

  const connection = new Connection("http://127.0.0.1:8899");
  const provider = new anchor.AnchorProvider(
    connection,
    details.publicKey,
    anchor.AnchorProvider.defaultOptions()
  );
  anchor.setProvider(provider);
  const programAddress = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_AGREEMENT_CONTRACT_ADDRESS);
  const contract = new anchor.Program(idl, programAddress, provider);

  const agreementData = {
    title: details.title,
    description: details.description,
    skills: details.skills,
    payment_amount: amount,
    professional: companyAccount, //TODO: (companyAccount for test) Check if the string address is accepted or is needed a pubkey
    company: companyAccount, //TODO: get the account of the company connected
    token_incentive: {
      amount: new anchor.BN(500), // Sample amount
      token_address: "skynetDj29GH6o6bAqoixCpDuYtWqi1rm8ZNx1hB3vq", // Replace with the token's public key
    },
    payment: {
      amount: new anchor.BN(1000), // Sample amount
      token_address: "skynetDj29GH6o6bAqoixCpDuYtWqi1rm8ZNx1hB3vq", // Replace with the token's public key
    },
    accepted_payment_tokens: "skynetDj29GH6o6bAqoixCpDuYtWqi1rm8ZNx1hB3vq", // Replace with the list of accepted token public keys
    total_paid: new anchor.BN(0),
    status: 0
  }

  const stringBuffer = Buffer.from("company_agreements", "utf-8");

  console.log("contract", contract) 
  const [companyAgreementsPublicKey, _] = anchor.web3.PublicKey.findProgramAddressSync(
    [stringBuffer, companyAccount.toBuffer()],
    contract.programId
  );
  

  try {
    const agreementAddress = anchor.web3.Keypair.generate();

    let latestBlockhash = await provider.connection.getLatestBlockhash(
      "confirmed"
    );

    const instruction = await contract.methods
      .initializeAgreement(agreementData).accounts({
          agreement: agreementAddress.publicKey,
          company: companyAccount,
          companyAgreements: companyAgreementsPublicKey, 
          systemProgram: anchor.web3.SystemProgram.programId,
        }).instruction();


    const messageV0 = new anchor.web3.TransactionMessage({     
      payerKey: companyAccount,
      recentBlockhash: latestBlockhash.blockhash,
      instructions: [instruction],
    }).compileToV0Message();

    const transaction = new anchor.web3.VersionedTransaction(messageV0);

    const confirmation = await window.solana.signAndSendTransaction(transaction);

    console.log("tx", confirmation);

  } catch (error) {
    console.error("Error initializing agreement:", error);
  } finally {
    return tx
  }
};
  
export default addAgreement;