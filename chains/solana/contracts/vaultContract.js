import { PublicKey } from "@solana/web3.js";
import idl from "./agreement_program.json";
import {Connection } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

const opts ={
  preflightCommitment: "processed"
}

export function vaultContract(wallet) {
  const connection = new Connection("https://api.devnet.solana.com");
  const provider = new anchor.AnchorProvider(
    connection,
    wallet.adapter,
    anchor.AnchorProvider.defaultOptions()
  )
  anchor.setProvider(provider);
  
  const programAddress = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_AGREEMENT_CONTRACT_ADDRESS);
  const contract = new anchor.Program(idl, programAddress, provider);
  return contract;
}