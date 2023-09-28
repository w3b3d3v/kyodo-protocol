import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { AgreementProgram } from "../target/types/agreement_program";
import {  } from "bn.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, mintTo, getOrCreateAssociatedTokenAccount, createMint } from "@solana/spl-token";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

describe("agreement_program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  
  const program = anchor.workspace.AgreementProgram;
  const companyAddress = provider.wallet.publicKey;
  const professionalAddress = anchor.web3.Keypair.generate();
  let toPayAgreementAddress;

  const fakeMint = anchor.web3.Keypair.generate()

  it("Initializes a fake payment token", async () => {
    const payer = (provider.wallet as NodeWallet).payer
    const tx = await createMint(
      provider.connection,
      payer,
      companyAddress,
      companyAddress, 
      8,
      fakeMint,
      null,
      TOKEN_PROGRAM_ID,
    );

     console.log("Your token address:", fakeMint.publicKey);
     console.log("Your transaction signature:", tx);

   });

   it("Creates Associated Token Account and Mints Tokens", async () => {
    const payer = (provider.wallet as NodeWallet).payer
    // Create the associated token account for companyAddress
    const associatedTokenAddress = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      fakeMint.publicKey,
      companyAddress,
      false,
      null,
      null,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

  
    // Mint to the associated token address
    await mintTo(
      provider.connection,
      payer, 
      fakeMint.publicKey,
      associatedTokenAddress.address,
      companyAddress, 
      10000,
      [],
      null,
      TOKEN_PROGRAM_ID,
    );
    
    console.log("Tokens minted to associated token account:", associatedTokenAddress.toString());
  });

  it("Initialize first Agreement", async () => {
    const stingBuffer = Buffer.from("company_agreements", "utf-8");
    const agreementAddress = anchor.web3.Keypair.generate();
    toPayAgreementAddress = agreementAddress;

    // find PDA
    // https://www.anchor-lang.com/docs/pdas
    // https://solanacookbook.com/core-concepts/pdas.html#facts
    // TODO: check for programs sign / modify pda 
    const [companyAgreementsPublicKey, _] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [stingBuffer, companyAddress.toBytes()],
        program.programId
      );

    const amount = new anchor.BN(1000);
    const agreement = {
      title: "test",
      description: "test description",
      skills: ["JavaScript", "Rust", "Solana"], // You can replace these with actual skills
      payment_amount: amount,
      professional: professionalAddress.publicKey, // Replace with the professional's public key
      company: companyAddress, // Since company is signing this, we can use its public key
      token_incentive: {
          amount: new anchor.BN(500), // Sample amount
          token_address: "skynetDj29GH6o6bAqoixCpDuYtWqi1rm8ZNx1hB3vq", // Replace with the token's public key
      },
      payment: {
          amount: new anchor.BN(1000), // Sample amount
          token_address: "skynetDj29GH6o6bAqoixCpDuYtWqi1rm8ZNx1hB3vq", // Replace with the token's public key
      },
      accepted_payment_token: fakeMint.publicKey, // Replace with the list of accepted token public keys
      total_paid: new anchor.BN(0),
      status: 0
  } as any;

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

    const fetchedAgreement = await program.account.agreementAccount.fetch(
      agreementAddress.publicKey
    );

    const fetchedCompanyAgreements =
      await program.account.companyAgreements.fetch(companyAgreementsPublicKey);

    console.log("Your agreement account:", fetchedAgreement);
    console.log("Your company agreements:", fetchedCompanyAgreements);
    console.log("Your transaction signature:", tx);
  });

  it("Initializes a second Agreement", async () => {
    const stingBuffer = Buffer.from("company_agreements", "utf-8");
    const agreementAddress = anchor.web3.Keypair.generate();

    // find PDA
    // https://www.anchor-lang.com/docs/pdas
    // https://solanacookbook.com/core-concepts/pdas.html#facts
    // TODO: check for programs sign / modify pda 
    const [companyAgreementsPublicKey, _] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [stingBuffer, companyAddress.toBytes()],
        program.programId
      );

    const amount = new anchor.BN(1000);
    const agreement = {
      title: "test",
      description: "test description",
      skills: ["JavaScript", "Rust", "Solana"], // You can replace these with actual skills
      payment_amount: amount,
      professional: professionalAddress.publicKey, // Replace with the professional's public key
      company: companyAddress, // Since company is signing this, we can use its public key
      token_incentive: {
          // nested data is not working
          amount: new anchor.BN(500), // Sample amount
          token_address: "skynetDj29GH6o6bAqoixCpDuYtWqi1rm8ZNx1hB3vq", // Replace with the token's public key
      },
      payment: {
          // nested data is not working
          amount: new anchor.BN(1000), // Sample amount
          token_address: "skynetDj29GH6o6bAqoixCpDuYtWqi1rm8ZNx1hB3vq", // Replace with the token's public key
      },
      accepted_payment_token: professionalAddress.publicKey, // Replace with the list of accepted token public keys
      total_paid: new anchor.BN(0),
      status: 0
  } as any;

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

    const fetchedAgreement = await program.account.agreementAccount.fetch(
      agreementAddress.publicKey
    );

    const fetchedCompanyAgreements =
      await program.account.companyAgreements.fetch(companyAgreementsPublicKey);

    console.log("Your agreement account:", fetchedAgreement);
    console.log("Your company agreements:", fetchedCompanyAgreements);
    console.log("Your transaction signature:", tx);
  });

  it("Process Payment", async () => {
    const tx = await program.methods.processPayment()
      .accounts({
        agreement: toPayAgreementAddress.publicKey,
        company: companyAddress,
        professional: professionalAddress.publicKey,
        paymentToken: fakeMint.publicKey,
      })
      .rpc();

    const fetchedAgreement = await program.account.agreementAccount.fetch(
      toPayAgreementAddress.publicKey
    );

    console.log("Your payed agreement account:", fetchedAgreement);
    console.log("Your transaction signature:", tx);
  });
});
