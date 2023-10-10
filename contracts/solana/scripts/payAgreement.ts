import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";
import * as dotenv from "dotenv";
import path from "path";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { 
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getOrCreateAssociatedTokenAccount
} from "@solana/spl-token"; 


dotenv.config({ path: path.resolve(__dirname, '../../../.env.development.local') });

const provider = anchor.AnchorProvider.local("https://api.devnet.solana.com");
anchor.setProvider(provider);

const program = anchor.workspace.AgreementProgram;

const FAKE_STABLE_ADDRESS = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_FAKE_STABLE_ADDRESS);

async function readAgreements() {
    const provider = anchor.AnchorProvider.local("https://api.devnet.solana.com");
    anchor.setProvider(provider);

    const program = anchor.workspace.AgreementProgram;
    const companyAddress = provider.wallet.publicKey;

    const stringBuffer = Buffer.from("company_agreements", "utf-8");

    const [companyAgreementsPublicKey, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [stringBuffer, companyAddress.toBuffer()],
      program.programId
    );

    const fetchedCompanyAgreements = await program.account.companyAgreements.fetch(
      companyAgreementsPublicKey
    );

    const agreements = [];

    for (const agreementPublicKey of fetchedCompanyAgreements.agreements) {
        const fetchedAgreement = await program.account.agreementAccount.fetch(agreementPublicKey);
    
        // Criando um objeto que contém os dados e o publicKey
        const agreementWithPubKey = {
            ...fetchedAgreement,  // Spread para incluir todos os campos de fetchedAgreement
            publicKey: agreementPublicKey
        };
    
        agreements.push(agreementWithPubKey);
    }

    return agreements;
}

async function processPayment(agreement, company) {
    const payer = (provider.wallet as NodeWallet).payer;

    // Create or fetch the associated token account for the company using the fake mint.
    const associatedTokenAddressCompany = await getOrCreateAssociatedTokenAccount(
        provider.connection,               // Current provider's connection.
        company,                             // Entity funding the transaction.
        FAKE_STABLE_ADDRESS,                // Mint's public key.
        company,                    // Owner of the associated token account.
        false,                             // Indicates if the function should throw an error if the account already exists.
        null, null,                        // Optional configs (multiSig and options).
        TOKEN_PROGRAM_ID,                  // SPL token program ID.
        ASSOCIATED_TOKEN_PROGRAM_ID        // SPL associated token program ID.
    );

    console.log("associatedTokenAddressCompany", associatedTokenAddressCompany);
  
    //   Creating or fetching the associated token account for the professional.
    const associatedTokenAddressProfessional = await getOrCreateAssociatedTokenAccount(
        provider.connection,                // Current provider's connection.
        payer,                // Entity funding the transaction.
        FAKE_STABLE_ADDRESS,                 // Mint's public key.
        agreement[0].professional,      // Owner of the associated token account.
        false,                              // Indicates if the function should throw an error if the account already exists.
        null, null,                         // Optional configs (multiSig and options).
        TOKEN_PROGRAM_ID,                   // SPL token program ID.
        ASSOCIATED_TOKEN_PROGRAM_ID         // SPL associated token program ID.
    );

    const txAddAcceptedPaymentToken = await program.methods.addAcceptedPaymentToken(FAKE_STABLE_ADDRESS)
      .accounts({
        agreement: agreement[0].publicKey,
        owner: company,
      }).rpc();

    console.log("Token Added as accepted Payment", txAddAcceptedPaymentToken);

    const tx = await program.methods.processPayment()
      .accounts({
        agreement: agreement[0].publicKey,
        company: company,
        fromAta: associatedTokenAddressCompany.address,
        toAta: associatedTokenAddressProfessional.address,
        professional: agreement[0].professional,
        paymentToken: FAKE_STABLE_ADDRESS,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    const fetchedAgreement = await program.account.agreementAccount.fetch(
        agreement[0].publicKey
    );

    console.log("Your paid agreement account:", fetchedAgreement);
    console.log("Your transaction signature:", tx);
    return true;
}

async function main(){
    const company = provider.wallet.publicKey;

    const agreement = await readAgreements()
    // console.log("agreement", agreement)
    const processPaymentResult = await processPayment(agreement, company)
    console.log("processPaymentResult", processPaymentResult)
}

main()
