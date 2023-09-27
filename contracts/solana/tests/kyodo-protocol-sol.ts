import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { AgreementProgram } from "../target/types/agreement_program";
import {  } from "bn.js";

describe("agreement_program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.AgreementProgram as Program<AgreementProgram>;
  const idAddress = anchor.web3.Keypair.generate();

  // Using privider.wallet, if you want to use the line bellow
  // you need to airdrop some SOL to the wallet first.
  //const userAddress = anchor.web3.Keypair.generate();

  it("Initialized Agrement", async () => {
    const agreementAddress = anchor.web3.Keypair.generate();
    const amount = new BN(1000);
    const agreement = {
      title: "test",
      description: "test description",
      //not working, why?
      payment_amount: amount,
      status: 0,
    } as any;

    
    // Add your test here.
    const tx = await program.methods.initializeAgreement(agreement).accounts({
      agreement: agreementAddress.publicKey,
      company: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).signers([agreementAddress]).rpc();

    const fetchedAgreement = await program.account.agreementAccount.fetch(agreementAddress.publicKey);
    console.log("Your agreement account publickey", agreementAddress.publicKey.toBase58(),);
    console.log("Your agreement account", fetchedAgreement);
    console.log("Your transaction signature", tx);
  });
  
  it("Initialized Agrement 2", async () => {
    const agreementAddress = anchor.web3.Keypair.generate();
    const amount = new BN(1000);
    const agreement = {
      title: "test",
      description: "test description",
      //not working, why?
      payment_amount: amount,
      status: 0,
    } as any;

    
    // Add your test here.
    const tx = await program.methods.initializeAgreement(agreement).accounts({
      agreement: agreementAddress.publicKey,
      company: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).signers([agreementAddress]).rpc();

    const fetchedAgreement = await program.account.agreementAccount.fetch(agreementAddress.publicKey);
    console.log("Your agreement account publickey", agreementAddress.publicKey.toBase58(),);
    console.log("Your agreement account", fetchedAgreement);
    console.log("Your transaction signature", tx);
  });
});
