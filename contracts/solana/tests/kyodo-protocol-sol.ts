/**
 * Agreement Program Test Suite
 *
 * A comprehensive testing suite to validate the agreement program functionalities 
 * developed in a Solana blockchain context using the Anchor framework. This suite 
 * contains tests for token minting, agreement initialization, and payment processing.
 * 
 * @author [Jaxiii]
 * @version 0.0.4
 * @date [09/28/2023]
 */

// Required module and dependency imports

import * as anchor from "@coral-xyz/anchor"; // The anchor module provides various tools to develop and test Solana programs.
import { BN } from "@coral-xyz/anchor"; // Importing the BN (Big Number) library from anchor for handling large integers.
import { AgreementProgram } from "../target/types/agreement_program"; // Custom data type definitions for the agreement program.
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  mintTo,
  getOrCreateAssociatedTokenAccount,
  createMint
} from "@solana/spl-token"; // SPL token utilities for token creation, minting, and account association.
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet"; // NodeWallet is a class from Anchor that represents a wallet on a Solana node.


// Main test suite for the agreement program functionalities.
describe("agreement_program", () => {

  // Setting up the client configuration to connect to a local Solana cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Loading the agreement program from the workspace.
  const program = anchor.workspace.AgreementProgram;

  // Fetching the public key of the company from the provider's wallet.
  const companyPubkey = provider.wallet.publicKey;

  // Generating a new keypair for the professional's address.
  const adminKeypair = anchor.web3.Keypair.generate();
  const professionalKeypair = anchor.web3.Keypair.generate();
  const vaultKeypair = anchor.web3.Keypair.generate();
  const communityDaoKeypair = anchor.web3.Keypair.generate();
  const kyodoTreasuryKeypair = anchor.web3.Keypair.generate();
  const feesKeypair = anchor.web3.Keypair.generate();
  const acceptedPaymentTokensKeypair = anchor.web3.Keypair.generate();

  // Requesting an airdrop (test SOL tokens) to the professional's account.
  provider.connection.requestAirdrop(professionalKeypair.publicKey, 100000000)
    .then(() => console.log("Airdropped to Professional"));

  provider.connection.requestAirdrop(adminKeypair.publicKey, 100000000)
    .then(() => console.log("Airdropped to Admin"));

  // Variable declarations to store associated token addresses and agreement address.
  // We need to initialize these variables here so that they can be used in one or more test.
  let associatedTokenAddressCompany;        // Will be asign, and then used to pay the professional
  let associatedTokenAddressProfessional;   // Will be asign, and then used to recieve payment from the company
  let associatedTokenAddressCommunity;      // Will be asign, and then used to recieve fees
  let associatedTokenAddressTreasury;       // Will be asign, and then used to recieve fees
  let toPayFirstAgreementAddress;           // Will be asign, and then updated when the payment is processed
  let toPaySecondAgreementAddress;          // Will be asign, and then updated when the payment is processed
  
  // Generating a keypair for a fake mint (test payment token).
  const fakeMint = anchor.web3.Keypair.generate();

  // Test case to initialize a fake payment token for testing purposes.
  it("Initializes a Fake Payment Token", async () => {
    // Fetching the payer's account, which is the entity that'll fund the transactions.
    const payer = (provider.wallet as NodeWallet).payer;

    // Create a new mint (token type) and get the transaction signature.
    const tx = await createMint(
      provider.connection,  // Current provider's connection.
      payer,                // Entity funding the transaction.
      companyPubkey,       // Mint's authority.
      companyPubkey,       // Freeze authority (can freeze token accounts).
      8,                    // Decimals for the token.
      fakeMint,             // Mint's keypair.
      null,                 // Optional multisig authority.
      TOKEN_PROGRAM_ID      // SPL token program ID.
    );

    // Logging the minted token's address and the transaction signature.
    console.log("Your Token Account Address:", fakeMint.publicKey);
    console.log("Your Transaction Signature:", tx);
  });

  it("Initializes Fees Account", async () => {
    // Fetching the payer's account, which is the entity that'll fund the transactions.
    const payer = (provider.wallet as NodeWallet).payer;

    // Create a new mint (token type) and get the transaction signature.
    const fees = {
      feePercentage: new anchor.BN(20),
      treasuryFee: new anchor.BN(500),
      communityDaoFee: new anchor.BN(500),
    } as any;

    const tx = await program.methods
      .initializeFees(fees)
      .accounts({
        fees: feesKeypair.publicKey,
        admin: adminKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([adminKeypair, feesKeypair])
      .rpc();

    // Logging the minted token's address and the transaction signature.
    console.log("Your Fees Account Address:", feesKeypair.publicKey);
    console.log("Your Transaction Signature:", tx);
  });

  it("Initializes Accepted Tokens Account", async () => {

    const tx = await program.methods
      .initializeAcceptedPaymentTokens()
      .accounts({
        acceptedPaymentToken: acceptedPaymentTokensKeypair.publicKey,
        admin: adminKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([adminKeypair, acceptedPaymentTokensKeypair])
      .rpc();

    // Logging the minted token's address and the transaction signature.
    console.log("Your Accepted Payment Tokens Account Address:", feesKeypair.publicKey);
    console.log("Your Transaction Signature:", tx);
  });

  // Test case to create associated token accounts and mint tokens to them.
  it("Creates Associated Token Account and Mints Tokens", async () => {

    // Fetching the payer's account which will fund the transactions.
    const payer = (provider.wallet as NodeWallet).payer;

    const stringBufferVault = Buffer.from("professional_vault", "utf-8");

    // Finding the Program Derived Address (PDA) for company agreements using the buffer and company address.
    // https://www.anchor-lang.com/docs/pdas
    // https://solanacookbook.com/core-concepts/pdas.html#facts
    // TODO: check for programs sign / modify pda 
    const [professionalVaultPublicKey, ___] =
    anchor.web3.PublicKey.findProgramAddressSync(
      [stringBufferVault, professionalKeypair.publicKey.toBytes()],
      program.programId
      );

    // Create or fetch the associated token account for the company using the fake mint.
    associatedTokenAddressCompany = await getOrCreateAssociatedTokenAccount(
      provider.connection,               // Current provider's connection.
      payer,                             // Entity funding the transaction. TODO: change if needed
      fakeMint.publicKey,                // Mint's public key.
      companyPubkey,                    // Owner of the associated token account.
      false,                             // Indicates if the function should throw an error if the account already exists.
      null, null,                        // Optional configs (multiSig and options).
      TOKEN_PROGRAM_ID,                  // SPL token program ID.
      ASSOCIATED_TOKEN_PROGRAM_ID        // SPL associated token program ID.
    );

    // Creating or fetching the associated token account for the professional.
    associatedTokenAddressProfessional = await getOrCreateAssociatedTokenAccount(
      provider.connection,                // Current provider's connection.
      payer,                              // Entity funding the transaction. TODO: change if needed
      fakeMint.publicKey,                 // Mint's public key.
      professionalKeypair.publicKey,      // Owner of the associated token account.
      false,                              // Indicates if the function should throw an error if the account already exists.
      null, null,                         // Optional configs (multiSig and options).
      TOKEN_PROGRAM_ID,                   // SPL token program ID.
      ASSOCIATED_TOKEN_PROGRAM_ID         // SPL associated token program ID.
    );


    // Creating or fetching the associated token account for the professional.
    associatedTokenAddressCommunity = await getOrCreateAssociatedTokenAccount(
      provider.connection,                // Current provider's connection.
      payer,                              // Entity funding the transaction. TODO: change if needed
      fakeMint.publicKey,                 // Mint's public key.
      communityDaoKeypair.publicKey,             // Owner of the associated token account.
      false,                              // Indicates if the function should throw an error if the account already exists.
      null, null,                         // Optional configs (multiSig and options).
      TOKEN_PROGRAM_ID,                   // SPL token program ID.
      ASSOCIATED_TOKEN_PROGRAM_ID         // SPL associated token program ID.
    );

    // Creating or fetching the associated token account for the professional.
    associatedTokenAddressTreasury = await getOrCreateAssociatedTokenAccount(
      provider.connection,                // Current provider's connection.
      payer,                              // Entity funding the transaction. TODO: change if needed
      fakeMint.publicKey,                 // Mint's public key.
      kyodoTreasuryKeypair.publicKey,     // Owner of the associated token account.
      false,                              // Indicates if the function should throw an error if the account already exists.
      null, null,                         // Optional configs (multiSig and options).
      TOKEN_PROGRAM_ID,                   // SPL token program ID.
      ASSOCIATED_TOKEN_PROGRAM_ID         // SPL associated token program ID.
    );

    // Mint tokens to the company's associated token account.
    var mintToCompanyTx = await mintTo(
      provider.connection,                    // Current provider's connection.
      payer,                                  // Entity funding the minting.
      fakeMint.publicKey,                     // Mint's public key.
      associatedTokenAddressCompany.address,  // Destination account.
      companyPubkey,                         // Minting authority.
      10000 * (10 ** 8),                        // Amount of tokens to mint.
      [],                                     // Optional multisig authorities.
      null,                                   // Optional config (instructions).
      TOKEN_PROGRAM_ID                        // SPL token program ID.
    );

    // Logging details of the minting transactions and the associated addresses.
    console.log("Tokens Mint tx to Company", mintToCompanyTx.toString());
    console.log("Associated Company Token Account:", associatedTokenAddressCompany);
    console.log("Associated Professional Token Account:", associatedTokenAddressProfessional);
  });

  // Test case for initializing the first agreement.
  it("Initialize First Agreement", async () => {
    // Converting the string "company_agreements" to a buffer to be used for PDA calculations.
    const stringBufferCompany = Buffer.from("company_agreements", "utf-8");
    const stringBufferProfessional = Buffer.from("professional_agreements", "utf-8");

    // Generating a new keypair for the agreement's address.
    const agreementAddress = anchor.web3.Keypair.generate();

    // Asigning the agreement address to the global variable to be used in the payment test.
    toPayFirstAgreementAddress = agreementAddress;

    // Finding the Program Derived Address (PDA) for company agreements using the buffer and company address.
    // https://www.anchor-lang.com/docs/pdas
    // https://solanacookbook.com/core-concepts/pdas.html#facts
    // TODO: check for programs sign / modify pda 
    const [companyAgreementsPublicKey, _] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [stringBufferCompany, companyPubkey.toBytes()],
        program.programId
      );

  const [professionalAgreementsPublicKey, __] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [stringBufferProfessional, professionalKeypair.publicKey.toBytes()],
        program.programId
      );

    // Defining the amount to be used in the agreement.
    // Its not working in nested stuctures like agreement bellow
    // Constructing the agreement data for the second agreement.
    const agreement = {
      title: "test1",
      description: "test1 description",
      skills: ["JavaScript", "Rust", "Solana"], // You can replace these with actual skills
      professional: professionalKeypair.publicKey, // Replace with the professional's public key
      communityDao: communityDaoKeypair.publicKey, // Replace with the professional's public key
      company: companyPubkey, // Since company is signing this, we can use its public key,
      paymentAmount: new anchor.BN(1000),
    } as any;

    const tx = await program.methods
      .initializeAgreement(agreement)
      .accounts({
        agreement: agreementAddress.publicKey,
        company: companyPubkey,
        professional: professionalKeypair.publicKey,
        companyAgreements: companyAgreementsPublicKey,            // The PDA address, you'll have to compute this based on your program logic
        professionalAgreements: professionalAgreementsPublicKey,  // The PDA address, you'll have to compute this based on your program logic
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([agreementAddress])
      .rpc();

    const fetchedAgreement = await program.account.agreementAccount.fetch(
      agreementAddress.publicKey
    );

    const fetchedCompanyAgreements =
      await program.account.companyAgreements.fetch(companyAgreementsPublicKey);

    console.log("Your Agreement Account Address:", fetchedAgreement);
    console.log("Your Company Agreements:", fetchedCompanyAgreements);
    console.log("Your Transaction Signature:", tx);
  });

  // Test case for initializing a second agreement.
  it("Initialize Second Agreement", async () => {

    // Converting the string "company_agreements" to a buffer to be used for PDA calculations.
    const stringBuffer = Buffer.from("company_agreements", "utf-8");
    const stringBufferProfessional = Buffer.from("professional_agreements", "utf-8");

    // Generating a new keypair for the agreement's address.
    const agreementAddress = anchor.web3.Keypair.generate();

    // Asigning the agreement address to the global variable to be used in the payment test.
    toPaySecondAgreementAddress = agreementAddress;

    // Finding the Program Derived Address (PDA) for company agreements using the buffer and company address.
    // https://www.anchor-lang.com/docs/pdas
    // https://solanacookbook.com/core-concepts/pdas.html#facts
    // TODO: check for programs sign / modify pda 
    const [companyAgreementsPublicKey, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [stringBuffer, companyPubkey.toBytes()],
      program.programId
    );

    const [professionalAgreementsPublicKey, __] =
    anchor.web3.PublicKey.findProgramAddressSync(
      [stringBufferProfessional, professionalKeypair.publicKey.toBytes()],
      program.programId
    );

    // Constructing the agreement data for the second agreement.
    const agreement = {
      title: "test2",
      description: "test2 description",
      skills: ["TypeScript", "C++", "DodgeChain"], // Array of skills related to the agreement.
      professional: professionalKeypair.publicKey,
      company: companyPubkey,
      paymentAmount: new anchor.BN(1000),
    } as any;

    // Initializing the agreement on-chain.
    const tx = await program.methods
      .initializeAgreement(agreement)
      .accounts({
        agreement: agreementAddress.publicKey,
        company: companyPubkey,
        professional: professionalKeypair.publicKey,
        companyAgreements: companyAgreementsPublicKey,            // The PDA address, you'll have to compute this based on your program logic
        professionalAgreements: professionalAgreementsPublicKey,  // The PDA address, you'll have to compute this based on your program logic
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([agreementAddress])
      .rpc();

    // Fetching the details of the initialized agreement from the blockchain.
    const fetchedAgreement = await program.account.agreementAccount.fetch(
      agreementAddress.publicKey
    );

    // Fetching details of all agreements associated with the company.
    const fetchedCompanyAgreements =
      await program.account.companyAgreements.fetch(companyAgreementsPublicKey);

    // Logging the details of the agreement, company's agreements, and the transaction for debugging.
    console.log("Your Agreement Account Address:", fetchedAgreement);
    console.log("Your Company Agreements:", fetchedCompanyAgreements);
    console.log("Your Transaction Signature:", tx);
  });

  // Test case for initializing the first agreement.
  it("Add Payment Token to First Agreement", async () => {

    const tx = await program.methods.addAcceptedPaymentToken(fakeMint.publicKey)
      .accounts({
        acceptedPaymentTokens: acceptedPaymentTokensKeypair.publicKey,
        owner: companyPubkey,
      }).rpc();

    console.log("Your Transaction Signature:", tx);
  });

  // Test case for initializing the first agreement.
  it("Add Payment Token to Second Agreement", async () => {

    const tx = await program.methods.addAcceptedPaymentToken(fakeMint.publicKey)
      .accounts({
        acceptedPaymentTokens: acceptedPaymentTokensKeypair.publicKey,
        owner: companyPubkey,
      }).rpc();

    console.log("Your Transaction Signature:", tx);
  });

  // Test case for initializing the first agreement.
  it("Set Fees to Second Agreement", async () => {
    // Constructing the agreement data for the second agreement.
    const fees = {
      feePercentage: new anchor.BN(20),
      treasuryFee: new anchor.BN(500),
      communityDaoFee: new anchor.BN(500),
    } as any;

    const tx = await program.methods.setFees(fees)
      .accounts({
        agreement: toPaySecondAgreementAddress.publicKey,
        fees: feesKeypair.publicKey,
        owner: companyPubkey,
      }).rpc();

    console.log("Your Transaction Signature:", tx);
  });

  // Test case for processing a payment related to an agreement.
  it("Process 1/10 Payment on First Agreement", async () => {

    const stringBufferCompany = Buffer.from("company_agreements", "utf-8");
    const stringBufferProfessional = Buffer.from("professional_agreements", "utf-8");

    // Finding the Program Derived Address (PDA) for company agreements using the buffer and company address.
    // https://www.anchor-lang.com/docs/pdas
    // https://solanacookbook.com/core-concepts/pdas.html#facts
    // TODO: check for programs sign / modify pda 
    const [companyAgreementsPublicKey, _] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [stringBufferCompany, companyPubkey.toBytes()],
        program.programId
      );

    const [professionalAgreementsPublicKey, __] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [stringBufferProfessional, professionalKeypair.publicKey.toBytes()],
        program.programId
      );

    const [professionalVaultPublicKey, ___] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [professionalKeypair.publicKey.toBytes(), fakeMint.publicKey.toBytes()],
        program.programId
      );

    // Fetching the initial balances of the associated token accounts.
    const initialCompanyBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressCompany.address)
    const initialKyodoTreasuryBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressTreasury.address);
    const initialCommunityDAOBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressCommunity.address);

    // Logging the initial balances for debugging.
    console.log("Initial Company Balance:", initialCompanyBalance.value);
    console.log("Initial Kyodo Treasury Balance:", initialKyodoTreasuryBalance.value);
    console.log("Initial Community DAO Balance:", initialCommunityDAOBalance.value);

    const amountToPay = new anchor.BN(100);

    // Processing the payment for the agreement.
    const tx = await program.methods.processPayment(amountToPay)
      .accounts({
        company: companyPubkey,
        agreement: toPayFirstAgreementAddress.publicKey,
        fromAta: associatedTokenAddressCompany.address,
        communityDaoAta: associatedTokenAddressCommunity.address,
        treasuryAta: associatedTokenAddressTreasury.address,
        paymentToken: fakeMint.publicKey,
        professional: professionalKeypair.publicKey,
        professionalVault: professionalVaultPublicKey,
        companyAgreements: companyAgreementsPublicKey,
        professionalAgreements: professionalAgreementsPublicKey,
        acceptedPaymentTokens: acceptedPaymentTokensKeypair.publicKey,
        fees: feesKeypair.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    // Fetching details of the agreement post-payment to verify changes.
    const fetchedAgreement = await program.account.agreementAccount.fetch(
      toPayFirstAgreementAddress.publicKey
    );

    // Fetching the final balances of the associated token accounts.
    const finalCompanyBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressCompany.address)
    const finalVaultBalance = await provider.connection.getTokenAccountBalance(professionalVaultPublicKey)
    const finalKyodoTreasuryBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressTreasury.address);
    const finalCommunityDAOBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressCommunity.address);

    // Logging the final balances for debugging.
    console.log("Final Company Balance:", finalCompanyBalance.value);
    console.log("Final Vault Balance:", finalVaultBalance.value);
    console.log("Final Kyodo Treasury Balance:", finalKyodoTreasuryBalance.value);
    console.log("Final Community DAO Balance:", finalCommunityDAOBalance.value);

    // Logging details of the agreement after the payment and the transaction signature for verification.
    console.log("Your Paid Agreement Account:", fetchedAgreement);
    console.log("Your Transaction Signature:", tx);
  });

  // Test case for processing a payment related to an agreement.
  it("Process Full Payment on Second Agreement", async () => {

    const stringBufferCompany = Buffer.from("company_agreements", "utf-8");
    const stringBufferProfessional = Buffer.from("professional_agreements", "utf-8");

    // Finding the Program Derived Address (PDA) for company agreements using the buffer and company address.
    // https://www.anchor-lang.com/docs/pdas
    // https://solanacookbook.com/core-concepts/pdas.html#facts
    // TODO: check for programs sign / modify pda 
    const [companyAgreementsPublicKey, _] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [stringBufferCompany, companyPubkey.toBytes()],
        program.programId
      );

    const [professionalAgreementsPublicKey, __] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [stringBufferProfessional, professionalKeypair.publicKey.toBytes()],
        program.programId
      );

    const [professionalVaultPublicKey, ___] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [professionalKeypair.publicKey.toBytes(), fakeMint.publicKey.toBytes()],
        program.programId
      );

    // Fetching the initial balances of the associated token accounts.
    const initialCompanyBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressCompany.address)
    const initialVaultBalance = await provider.connection.getTokenAccountBalance(professionalVaultPublicKey)
    const initialKyodoTreasuryBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressTreasury.address);
    const initialCommunityDAOBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressCommunity.address);

    // Logging the initial balances for debugging.
    console.log("Initial Company Balance:", initialCompanyBalance.value);
    console.log("Initial Vault Balance:", initialVaultBalance.value);
    console.log("Initial Kyodo Treasury Balance:", initialKyodoTreasuryBalance.value);
    console.log("Initial Community DAO Balance:", initialCommunityDAOBalance.value);

    const amountToPay = new anchor.BN(1000);

    // Processing the payment for the agreement.
    const tx = await program.methods.processPayment(amountToPay)
      .accounts({
        company: companyPubkey,
        agreement: toPayFirstAgreementAddress.publicKey,
        fromAta: associatedTokenAddressCompany.address,
        communityDaoAta: associatedTokenAddressCommunity.address,
        treasuryAta: associatedTokenAddressTreasury.address,
        paymentToken: fakeMint.publicKey,
        professional: professionalKeypair.publicKey,
        professionalVault: professionalVaultPublicKey,
        companyAgreements: companyAgreementsPublicKey,
        professionalAgreements: professionalAgreementsPublicKey,
        acceptedPaymentTokens: acceptedPaymentTokensKeypair.publicKey,
        fees: feesKeypair.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    // Fetching details of the agreement post-payment to verify changes.
    const fetchedAgreement = await program.account.agreementAccount.fetch(
      toPaySecondAgreementAddress.publicKey
    );

    // Fetching the final balances of the associated token accounts.
    const finalCompanyBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressCompany.address)
    const finalVaultBalance = await provider.connection.getTokenAccountBalance(professionalVaultPublicKey)
    const finalKyodoTreasuryBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressTreasury.address);
    const finalCommunityDAOBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressCommunity.address);

    // Logging the final balances for debugging.
    console.log("Final Company Balance:", finalCompanyBalance.value);
    console.log("Final Vault Balance:", finalVaultBalance.value);
    console.log("Final Kyodo Treasury Balance:", finalKyodoTreasuryBalance.value);
    console.log("Final Community DAO Balance:", finalCommunityDAOBalance.value);

    // Logging details of the agreement after the payment and the transaction signature for verification.
    console.log("Your Paid Agreement Account:", fetchedAgreement);
    console.log("Your Transaction Signature:", tx);
  });

  it("Process 9/10 Payment on First Agreement, to Fulfill", async () => {

    const stringBufferCompany = Buffer.from("company_agreements", "utf-8");
    const stringBufferProfessional = Buffer.from("professional_agreements", "utf-8");

    // Finding the Program Derived Address (PDA) for company agreements using the buffer and company address.
    // https://www.anchor-lang.com/docs/pdas
    // https://solanacookbook.com/core-concepts/pdas.html#facts
    // TODO: check for programs sign / modify pda 
    const [companyAgreementsPublicKey, _] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [stringBufferCompany, companyPubkey.toBytes()],
        program.programId
      );

    const [professionalAgreementsPublicKey, __] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [stringBufferProfessional, professionalKeypair.publicKey.toBytes()],
        program.programId
      );

    const [professionalVaultPublicKey, ___] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [professionalKeypair.publicKey.toBytes(), fakeMint.publicKey.toBytes()],
        program.programId
      );

    // Fetching the initial balances of the associated token accounts.
    const initialCompanyBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressCompany.address)
    const initialVaultBalance = await provider.connection.getTokenAccountBalance(professionalVaultPublicKey)
    const initialKyodoTreasuryBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressTreasury.address);
    const initialCommunityDAOBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressCommunity.address);

    // Logging the initial balances for debugging.
    console.log("Initial Company Balance:", initialCompanyBalance.value);
    console.log("Initial Vault Balance:", initialVaultBalance.value);
    console.log("Initial Kyodo Treasury Balance:", initialKyodoTreasuryBalance.value);
    console.log("Initial Community DAO Balance:", initialCommunityDAOBalance.value);

    const amountToPay = new anchor.BN(900);

    // Processing the payment for the agreement.
    const tx = await program.methods.processPayment(amountToPay)
      .accounts({
        company: companyPubkey,
        agreement: toPayFirstAgreementAddress.publicKey,
        fromAta: associatedTokenAddressCompany.address,
        communityDaoAta: associatedTokenAddressCommunity.address,
        treasuryAta: associatedTokenAddressTreasury.address,
        paymentToken: fakeMint.publicKey,
        professional: professionalKeypair.publicKey,
        professionalVault: professionalVaultPublicKey,
        companyAgreements: companyAgreementsPublicKey,
        professionalAgreements: professionalAgreementsPublicKey,
        acceptedPaymentTokens: acceptedPaymentTokensKeypair.publicKey,
        fees: feesKeypair.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Fetching details of the agreement post-payment to verify changes.
    const fetchedAgreement = await program.account.agreementAccount.fetch(
      toPayFirstAgreementAddress.publicKey
    );

    // Fetching the final balances of the associated token accounts.
    const finalCompanyBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressCompany.address)
    const finalVaultBalance = await provider.connection.getTokenAccountBalance(professionalVaultPublicKey)
    const finalKyodoTreasuryBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressTreasury.address);
    const finalCommunityDAOBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressCommunity.address);

    // Logging the final balances for debugging.
    console.log("Final Company Balance:", finalCompanyBalance.value);
    console.log("Final Vault Balance:", finalVaultBalance.value);
    console.log("Final Kyodo Treasury Balance:", finalKyodoTreasuryBalance.value);
    console.log("Final Community DAO Balance:", finalCommunityDAOBalance.value);

    // Logging details of the agreement after the payment and the transaction signature for verification.
    console.log("Your Paid Agreement Account:", fetchedAgreement);
    console.log("Your Transaction Signature:", tx);
  });

  // Test case for initializing the first agreement.
  it("Professional Withdraw", async () => {
    
    const stringBufferProfessional = Buffer.from("professional_agreements", "utf-8");

    // Finding the Program Derived Address (PDA) for company agreements using the buffer and company address.
    // https://www.anchor-lang.com/docs/pdas
    // https://solanacookbook.com/core-concepts/pdas.html#facts
    // TODO: check for programs sign / modify pda 
    const [professionalAgreementsPublicKey, __] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [stringBufferProfessional, professionalKeypair.publicKey.toBytes()],
        program.programId
      );

    const [professionalVaultPublicKey, ___] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [professionalKeypair.publicKey.toBytes(), fakeMint.publicKey.toBytes()],
        program.programId
      );

    // Fetching the initial balances of the associated token accounts.
    const initialVaultBalance = await provider.connection.getTokenAccountBalance(professionalVaultPublicKey)
    const initialProfessionalBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressProfessional.address)

    // Logging the initial balances for debugging.
    console.log("Initial Vault Balance:", initialVaultBalance.value);
    console.log("Initial Professional Balance:", initialProfessionalBalance.value);

    // Constructing the amount data.
    const amount = new anchor.BN(20);

    const tx = await program.methods.withdraw(amount)
      .accounts({
        professional: professionalKeypair.publicKey,
        professionalAta: associatedTokenAddressProfessional.address,
        vaultAta: professionalVaultPublicKey,
        professionalAgreements: professionalAgreementsPublicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      }).signers([professionalKeypair]).rpc();

    // Fetching details of the agreement post-payment to verify changes.
    const finalVaultBalance = await provider.connection.getTokenAccountBalance(professionalVaultPublicKey)
    const finalProfessionalBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressProfessional.address)

    console.log("Final Vault Balance:", finalVaultBalance.value);
    console.log("Final Professional Balance:", finalProfessionalBalance.value);
    console.log("Your Transaction Signature:", tx);
  });

});
