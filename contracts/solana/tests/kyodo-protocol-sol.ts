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
  const companyAddress = provider.wallet.publicKey;

  // Generating a new keypair for the professional's address.
  const professionalAddress = anchor.web3.Keypair.generate();
  const communityDao = anchor.web3.Keypair.generate();
  const kyodoTreasury = anchor.web3.Keypair.generate();

  // Requesting an airdrop (test SOL tokens) to the professional's account.
  provider.connection.requestAirdrop(professionalAddress.publicKey, 100000000)
    .then(() => console.log("Airdropped to Professional"));

  // Variable declarations to store associated token addresses and agreement address.
  // We need to initialize these variables here so that they can be used in one or more test.
  let associatedTokenAddressCompany; // Will be asign, and then used to pay the professional
  let associatedTokenAddressProfessional; // Will be asign, and then used to recieve payment from the company
  let associatedTokenAddressCommunity; // Will be asign, and then used to recieve fees
  let associatedTokenAddressTreasury; // Will be asign, and then used to recieve fees
  let toPayAgreementAddress; // Will be asign, and then updated when the paymen is processed

  // Generating a keypair for a fake mint (test payment token).
  const fakeMint = anchor.web3.Keypair.generate();

  // Test case to initialize a fake payment token for testing purposes.
  it("Initializes a fake payment token", async () => {
    // Fetching the payer's account, which is the entity that'll fund the transactions.
    const payer = (provider.wallet as NodeWallet).payer;

    // Create a new mint (token type) and get the transaction signature.
    const tx = await createMint(
      provider.connection,  // Current provider's connection.
      payer,                // Entity funding the transaction.
      companyAddress,       // Mint's authority.
      companyAddress,       // Freeze authority (can freeze token accounts).
      8,                    // Decimals for the token.
      fakeMint,             // Mint's keypair.
      null,                 // Optional multisig authority.
      TOKEN_PROGRAM_ID      // SPL token program ID.
    );

    // Logging the minted token's address and the transaction signature.
    console.log("Your token address:", fakeMint.publicKey);
    console.log("Your transaction signature:", tx);
  });

  // Test case to create associated token accounts and mint tokens to them.
  it("Creates Associated Token Account and Mints Tokens", async () => {

    // Fetching the payer's account which will fund the transactions.
    const payer = (provider.wallet as NodeWallet).payer;

    // Create or fetch the associated token account for the company using the fake mint.
    associatedTokenAddressCompany = await getOrCreateAssociatedTokenAccount(
      provider.connection,               // Current provider's connection.
      payer,                             // Entity funding the transaction. TODO: change if needed
      fakeMint.publicKey,                // Mint's public key.
      companyAddress,                    // Owner of the associated token account.
      false,                             // Indicates if the function should throw an error if the account already exists.
      null, null,                        // Optional configs (multiSig and options).
      TOKEN_PROGRAM_ID,                  // SPL token program ID.
      ASSOCIATED_TOKEN_PROGRAM_ID        // SPL associated token program ID.
    );

    // Creating or fetching the associated token account for the professional.
    associatedTokenAddressProfessional = await getOrCreateAssociatedTokenAccount(
      provider.connection,                // Current provider's connection.
      professionalAddress,                // Entity funding the transaction. TODO: change if needed
      fakeMint.publicKey,                 // Mint's public key.
      professionalAddress.publicKey,      // Owner of the associated token account.
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
      communityDao.publicKey,             // Owner of the associated token account.
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
      kyodoTreasury.publicKey,            // Owner of the associated token account.
      false,                              // Indicates if the function should throw an error if the account already exists.
      null, null,                         // Optional configs (multiSig and options).
      TOKEN_PROGRAM_ID,                   // SPL token program ID.
      ASSOCIATED_TOKEN_PROGRAM_ID         // SPL associated token program ID.
    );

    // Mint tokens to the company's associated token account.
    var mintToCompanyTx = await mintTo(
      provider.connection,                // Current provider's connection.
      payer,                              // Entity funding the minting.
      fakeMint.publicKey,                 // Mint's public key.
      associatedTokenAddressCompany.address, // Destination account.
      companyAddress,                     // Minting authority.
      10000,                              // Amount of tokens to mint.
      [],                                 // Optional multisig authorities.
      null,                               // Optional config (instructions).
      TOKEN_PROGRAM_ID                    // SPL token program ID.
    );

    // Minting tokens to the professional's associated token account.
    var mintToProfessionalTx = await mintTo(
      provider.connection,                    // Current provider's connection.
      payer,                                  // Entity funding the minting.
      fakeMint.publicKey,                     // Mint's public key.
      associatedTokenAddressProfessional.address, // Destination account.
      companyAddress,                         // Minting authority.
      1,                                      // Amount of tokens to mint.
      [],                                     // Optional multisig authorities.
      null,                                   // Optional config (instructions).
      TOKEN_PROGRAM_ID                        // SPL token program ID.
    );

    // Logging details of the minting transactions and the associated addresses.
    console.log("Tokens mint tx to company", mintToCompanyTx.toString());
    console.log("Tokens mint tx to professional:", mintToProfessionalTx.toString());
    console.log("Tokens minted to associated company token account:", associatedTokenAddressCompany);
    console.log("Tokens minted to associated professional token account:", associatedTokenAddressProfessional);
  });

  // Test case for initializing the first agreement.
  it("Initialize first Agreement", async () => {
    // Converting the string "company_agreements" to a buffer to be used for PDA calculations.
    const stringBuffer = Buffer.from("company_agreements", "utf-8");

    // Generating a new keypair for the agreement's address.
    const agreementAddress = anchor.web3.Keypair.generate();

    // Asigning the agreement address to the global variable to be used in the payment test.
    toPayAgreementAddress = agreementAddress;

    // Finding the Program Derived Address (PDA) for company agreements using the buffer and company address.
    // https://www.anchor-lang.com/docs/pdas
    // https://solanacookbook.com/core-concepts/pdas.html#facts
    // TODO: check for programs sign / modify pda 
    const [companyAgreementsPublicKey, _] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [stringBuffer, companyAddress.toBytes()],
        program.programId
      );

    // Defining the amount to be used in the agreement.
    // Its not working in nested stuctures like agreement bellow
    // Constructing the agreement data for the second agreement.
    const agreement = {
      title: "test1",
      description: "test1 description",
      skills: ["JavaScript", "Rust", "Solana"], // You can replace these with actual skills
      professional: professionalAddress.publicKey, // Replace with the professional's public key
      communityDao: communityDao.publicKey, // Replace with the professional's public key
      company: companyAddress, // Since company is signing this, we can use its public key,
      paymentAmount: new anchor.BN(1000),
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

  // Test case for initializing a second agreement.
  it("Initialize second Agreement", async () => {

    // Converting the string "company_agreements" to a buffer to be used for PDA calculations.
    const stringBuffer = Buffer.from("company_agreements", "utf-8");

    // Generating a new keypair for the agreement's address.
    const agreementAddress = anchor.web3.Keypair.generate();

    // Finding the Program Derived Address (PDA) for company agreements using the buffer and company address.
    // https://www.anchor-lang.com/docs/pdas
    // https://solanacookbook.com/core-concepts/pdas.html#facts
    // TODO: check for programs sign / modify pda 
    const [companyAgreementsPublicKey, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [stringBuffer, companyAddress.toBytes()],
      program.programId
    );

    // Constructing the agreement data for the second agreement.
    const agreement = {
      title: "test2",
      description: "test2 description",
      skills: ["TypeScript", "C++", "DodgeChain"], // Array of skills related to the agreement.
      professional: professionalAddress.publicKey,
      company: companyAddress,
      paymentAmount: new anchor.BN(1000),
    } as any;

    // Initializing the agreement on-chain.
    const tx = await program.methods
      .initializeAgreement(agreement)
      .accounts({
        agreement: agreementAddress.publicKey,
        company: companyAddress,
        companyAgreements: companyAgreementsPublicKey,
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
    console.log("Your agreement account:", fetchedAgreement);
    console.log("Your company agreements:", fetchedCompanyAgreements);
    console.log("Your transaction signature:", tx);
  });

  // Test case for initializing the first agreement.
  it("Add payment token to first agreement", async () => {

    const tx = await program.methods.addAcceptedPaymentToken(fakeMint.publicKey)
      .accounts({
        agreement: toPayAgreementAddress.publicKey,
        owner: companyAddress,
      }).rpc();

    console.log("Your transaction signature:", tx);
  });

  // Test case for initializing the first agreement.
  it("Set fees to first agreement", async () => {


    // Constructing the agreement data for the second agreement.
    const fees = {
      feePercentage: new anchor.BN(2),
      treasuryFee: new anchor.BN(50),
      communityDaoFee: new anchor.BN(50),
    } as any;

    const tx = await program.methods.setFees(fees)
      .accounts({
        agreement: toPayAgreementAddress.publicKey,
        owner: companyAddress,
      }).rpc();

    console.log("Your transaction signature:", tx);
  });

  // Test case for processing a payment related to an agreement.
  it("Process Payment", async () => {

    // Fetching the initial balances of the associated token accounts.
    const initialCompanyBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressCompany.address)
    const initialProfessionalBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressProfessional.address)
    const initialKyodoTreasuryBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressTreasury.address);
    const initialCommunityDAOBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressCommunity.address);

    // Logging the initial balances for debugging.
    console.log("Initial company balance:", initialCompanyBalance.value);
    console.log("Initial professional balance:", initialProfessionalBalance.value);
    console.log("Initial kyodo treasury balance:", initialKyodoTreasuryBalance.value);
    console.log("Initial community dao balance:", initialCommunityDAOBalance.value);

    // Processing the payment for the agreement.
    const tx = await program.methods.processPayment()
      .accounts({
        agreement: toPayAgreementAddress.publicKey,
        company: companyAddress,
        professional: professionalAddress.publicKey,
        fromAta: associatedTokenAddressCompany.address,
        toAta: associatedTokenAddressProfessional.address,
        communityDao: associatedTokenAddressCommunity.address,
        treasury: associatedTokenAddressTreasury.address,
        paymentToken: fakeMint.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    // Fetching details of the agreement post-payment to verify changes.
    const fetchedAgreement = await program.account.agreementAccount.fetch(
      toPayAgreementAddress.publicKey
    );

    // Fetching the final balances of the associated token accounts.
    const finalCompanyBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressCompany.address)
    const finalProfessionalBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressProfessional.address)
    const finalKyodoTreasuryBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressTreasury.address);
    const finalCommunityDAOBalance = await provider.connection.getTokenAccountBalance(associatedTokenAddressCommunity.address);

    // Logging the final balances for debugging.
    console.log("Final company balance:", finalCompanyBalance.value);
    console.log("Final professional balance:", finalProfessionalBalance.value);
    console.log("Final kyodo treasury balance:", finalKyodoTreasuryBalance.value);
    console.log("Final community dao balance:", finalCommunityDAOBalance.value);

    // Logging details of the agreement after the payment and the transaction signature for verification.
    console.log("Your paid agreement account:", fetchedAgreement);
    console.log("Your transaction signature:", tx);
  });

});
