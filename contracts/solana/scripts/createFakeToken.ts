import * as anchor from "@coral-xyz/anchor";
import * as dotenv from "dotenv";
const fs = require("fs");
const path = require("path");
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet"; // NodeWallet is a class from Anchor that represents a wallet on a Solana node.
import { 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID, 
  mintTo, 
  getOrCreateAssociatedTokenAccount, 
  createMint 
} from "@solana/spl-token"; // SPL token utilities for token creation, minting, and account association.
dotenv.config({ path: path.resolve(__dirname, '../../../.env.development.local') });


function updateConfig(fakeStableAddress) {
  const envPath = path.join(__dirname, '../../../.env.development.local');
  let envData = fs.readFileSync(envPath, 'utf8');
  const lines = envData.split('\n');

  const keysToUpdate = {
    'NEXT_PUBLIC_SOLANA_FAKE_STABLE_ADDRESS': fakeStableAddress
  };

  Object.keys(keysToUpdate).forEach(key => {
    let found = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith(`${key}=`)) {
        lines[i] = `${key}=${keysToUpdate[key]}`;
        found = true;
        break;
      }
    }
    if (!found) {
      lines.push(`${key}=${keysToUpdate[key]}`);
    }
  });

  envData = lines.join('\n');
  fs.writeFileSync(envPath, envData);
  console.log(`Updated fakeStable for Solana addresses in ${envPath}`);
}

async function createFakeToken() {
  try {
    // Configure the client to use the local Solana cluster.
    const provider = anchor.AnchorProvider.local("https://api.devnet.solana.com");
    anchor.setProvider(provider);

    // Fetch the public key of the company from the provider's wallet.
    const companyAddress = provider.wallet.publicKey;
    console.log("companyAddress", companyAddress.toBase58())

    const payer = (provider.wallet as NodeWallet).payer;
    console.log("payer", payer.publicKey)
    const fakeMint = anchor.web3.Keypair.generate();

    // Create a new mint (token type) and get the transaction signature.
    const txMint = await createMint(
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
    // console.log("Your token address:", fakeMint.publicKey);
    // console.log("Your transaction signature:", txMint);
    // Defining the agreement details.

    // Fetching the payer's account which will fund the transactions.
    let associatedTokenAddressCompany; // Will be asign, and then used to pay the professional
    //let toPayAgreementAddress; // Will be asign, and then updated when the paymen is processed

    // Create or fetch the associated token account for the company using the fake mint.
    associatedTokenAddressCompany = await getOrCreateAssociatedTokenAccount(
      provider.connection,               // Current provider's connection.
      payer,                             // Entity funding the transaction.
      fakeMint.publicKey,                // Mint's public key.
      companyAddress,                    // Owner of the associated token account.
      false,                             // Indicates if the function should throw an error if the account already exists.
      null, null,                        // Optional configs (multiSig and options).
      TOKEN_PROGRAM_ID,                  // SPL token program ID.
      ASSOCIATED_TOKEN_PROGRAM_ID        // SPL associated token program ID.
    );

    console.log("associatedTokenAddressCompany", associatedTokenAddressCompany);

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

    console.log("Minted successfully");
    console.log("Fake Token address:", fakeMint.publicKey.toBase58());
    console.log("Transaction signature:", mintToCompanyTx);

    updateConfig(fakeMint.publicKey.toBase58());

  } catch (error) {
    console.error("Error minting:", error);
  }
}
// Call the createFakeToken function to create a new agreement.
createFakeToken();
