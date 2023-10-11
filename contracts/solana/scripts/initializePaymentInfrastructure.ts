import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";
import * as dotenv from "dotenv";
import path from "path";
import fs from 'fs';
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

function loadKeypairFromJSONFile(filePath: string): Keypair {
    // Carregue o conteúdo do arquivo.
    const rawdata = fs.readFileSync(filePath, 'utf8');
    
    // Parse o JSON.
    const keypairData = JSON.parse(rawdata);
  
    // Crie o Keypair.
    const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
  
    return keypair;
  }

const wallet = "/Users/nomadbitcoin/.config/solana/id.json"

function updateConfig(
        associatedTokenAddressCompany, 
        associatedTokenAddressCommunity, 
        associatedTokenAddressTreasury
    ) {
    const envPath = path.join(__dirname, '../../../.env.development.local');
    let envData = fs.readFileSync(envPath, 'utf8');
    const lines = envData.split('\n');

    
    const keysToUpdate = {
        'SOL_ASSOCIATED_TOKEN_ADDRESS_COMPANY': associatedTokenAddressCompany,
        'SOL_ASSOCIATED_TOKEN_ADDRESS_COMMUNITY': associatedTokenAddressCommunity,
        'SOL_ASSOCIATED_TOKEN_ADDRESS_TREASURY': associatedTokenAddressTreasury
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

async function initializePaymentInfrastructure(communityDaoKeypair, kyodoTreasuryKeypair) {
    const payer = (provider.wallet as NodeWallet).payer;
    const adminKeypair = loadKeypairFromJSONFile(wallet);
    const company = provider.wallet.publicKey;
    const feesKeypair = anchor.web3.Keypair.generate();
    const acceptedPaymentTokensKeypair = anchor.web3.Keypair.generate();
  
    // 1. Initialize Fees Account
    const fees = {
        feePercentage: new anchor.BN(20),
        treasuryFee: new anchor.BN(500),
        communityDaoFee: new anchor.BN(500),
    } as any;
  
    await program.methods
        .initializeFees(fees)
        .accounts({
            fees: feesKeypair.publicKey,
            admin: adminKeypair.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([adminKeypair, feesKeypair])
        .rpc();
  
    console.log("Fees Account Initialized")
  
    // 2. Initialize Accepted Tokens Account
    await program.methods
        .initializeAcceptedPaymentTokens()
        .accounts({
            acceptedPaymentToken: acceptedPaymentTokensKeypair.publicKey,
            admin: adminKeypair.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([adminKeypair, acceptedPaymentTokensKeypair])
        .rpc();
  
    console.log("Accepted Tokens Account Initialized")
  
    const associatedTokenAddressCompany = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        payer,
        FAKE_STABLE_ADDRESS,
        company,
        false,
        null, null,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
    );
  
    console.log("associatedTokenAddressCompany Account Initialized")
  
    const associatedTokenAddressCommunity = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        payer,
        FAKE_STABLE_ADDRESS,
        communityDaoKeypair.publicKey,
        false,
        null, null,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
    );
  
    console.log("associatedTokenAddressCommunity Account Initialized")
  
    const associatedTokenAddressTreasury = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        payer,
        FAKE_STABLE_ADDRESS,
        kyodoTreasuryKeypair.publicKey,
        false,
        null, null,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
    );
  
    console.log("associatedTokenAddressTreasury Account Initialized")

    updateConfig(
        associatedTokenAddressCompany.address, 
        associatedTokenAddressCommunity.address, 
        associatedTokenAddressTreasury.address
    )
  
    return {
        associatedTokenAddressCompany,
        associatedTokenAddressCommunity,
        associatedTokenAddressTreasury
    };
  }

async function main() {
    try {
        const communityDaoKeypair = anchor.web3.Keypair.generate();
        const kyodoTreasuryKeypair = anchor.web3.Keypair.generate();

        await initializePaymentInfrastructure(
            communityDaoKeypair,
            kyodoTreasuryKeypair
        )

        console.log("Payment Infrastructure Initialized")

    } catch (error) {
        console.error("error initializing payment infrastructure:", error);
    }
}

main();